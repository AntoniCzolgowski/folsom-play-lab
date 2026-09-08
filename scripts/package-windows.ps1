$ErrorActionPreference = 'Stop'
$repoRoot = Split-Path -Parent $PSScriptRoot
$staticRoot = Join-Path $repoRoot 'dist/client'
if (-not (Test-Path -LiteralPath (Join-Path $staticRoot 'index.html'))) {
    throw 'Missing dist/client/index.html. Build and verify the static export first.'
}
$nodePath = (Get-Command node.exe -ErrorAction Stop).Source
$compilerPath = Join-Path $env:WINDIR 'Microsoft.NET/Framework64/v4.0.30319/csc.exe'
if (-not (Test-Path -LiteralPath $compilerPath)) { throw 'The .NET Framework C# compiler was not found.' }
$packageRoot = Join-Path $repoRoot 'release/Folsom_Play_Lab'
if (Test-Path -LiteralPath $packageRoot) { throw 'release/Folsom_Play_Lab already exists. Move it aside before packaging a new version.' }
New-Item -ItemType Directory -Path (Join-Path $packageRoot 'runtime') -Force | Out-Null
Copy-Item -LiteralPath $staticRoot -Destination (Join-Path $packageRoot 'app') -Recurse
Copy-Item -LiteralPath (Join-Path $repoRoot 'launcher-server.cjs') -Destination (Join-Path $packageRoot 'server.cjs')
Copy-Item -LiteralPath $nodePath -Destination (Join-Path $packageRoot 'runtime/node.exe')
Copy-Item -LiteralPath (Join-Path $repoRoot 'THIRD_PARTY_LICENSES.txt') -Destination $packageRoot
$nodeLicense = Join-Path (Split-Path -Parent $nodePath) 'LICENSE'
$licenseDestination = Join-Path $packageRoot 'runtime/NODE_LICENSE.txt'
if (Test-Path -LiteralPath $nodeLicense) {
    Copy-Item -LiteralPath $nodeLicense -Destination $licenseDestination
} else {
    $nodeVersion = (& $nodePath --version).Trim()
    Invoke-WebRequest -Uri "https://raw.githubusercontent.com/nodejs/node/$nodeVersion/LICENSE" -OutFile $licenseDestination
}
$launcherPath = Join-Path $packageRoot 'Folsom Play Lab.exe'
& $compilerPath /nologo /target:winexe /reference:System.Windows.Forms.dll "/out:$launcherPath" (Join-Path $repoRoot 'FolsomLauncher.cs')
if ($LASTEXITCODE -ne 0) { throw 'Launcher compilation failed.' }
@'
FOLSOM PLAY LAB

Double-click Folsom Play Lab.exe. Keep this folder together.
No Blender or Node.js installation is required.
Choose a play, coverage, and camera, then click Snap ball.
Space plays/pauses; R resets. Drag to orbit; scroll to zoom.

Source and instructions: https://github.com/AntoniCzolgowski/folsom-play-lab
'@ | Set-Content -LiteralPath (Join-Path $packageRoot 'START HERE.txt') -Encoding UTF8
Write-Output "Portable application: $packageRoot"
