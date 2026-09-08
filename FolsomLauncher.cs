using System;
using System.Diagnostics;
using System.IO;
using System.Net;
using System.Threading;
using System.Windows.Forms;
class FolsomLauncher {
 [STAThread] static void Main(){try{
  string dir=AppDomain.CurrentDomain.BaseDirectory;
  string url="http://127.0.0.1:5187/";
  if(!Ready()){
   var si=new ProcessStartInfo(Path.Combine(dir,"runtime","node.exe"),"\""+Path.Combine(dir,"server.cjs")+"\"");si.WorkingDirectory=dir;si.UseShellExecute=false;si.CreateNoWindow=true;si.WindowStyle=ProcessWindowStyle.Hidden;Process.Start(si);
   bool ok=false;for(int i=0;i<100;i++){if(Ready()){ok=true;break;}Thread.Sleep(100);}if(!ok)throw new Exception("The local simulator could not start. Port 5187 may be used by another program.");
  }
  string chrome=Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.ProgramFiles),"Google","Chrome","Application","chrome.exe");
  string edge=Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.ProgramFilesX86),"Microsoft","Edge","Application","msedge.exe");
  string browser=File.Exists(chrome)?chrome:File.Exists(edge)?edge:null;
  if(browser!=null)Process.Start(new ProcessStartInfo(browser,"--app="+url+" --window-size=1440,940"){UseShellExecute=true});else Process.Start(new ProcessStartInfo(url){UseShellExecute=true});
 }catch(Exception e){MessageBox.Show(e.Message,"Folsom Play Lab",MessageBoxButtons.OK,MessageBoxIcon.Information);}}
 static bool Ready(){try{var r=WebRequest.Create("http://127.0.0.1:5187/__folsom_health");r.Timeout=350;using(var response=r.GetResponse())using(var sr=new StreamReader(response.GetResponseStream()))return sr.ReadToEnd().Contains("folsom-play-lab");}catch{return false;}}
}
