const http=require('node:http'),fs=require('node:fs'),path=require('node:path');
const ROOT=path.join(__dirname,'app'),PORT=5187;let lastRequest=Date.now();
const types={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json','.glb':'model/gltf-binary','.png':'image/png','.svg':'image/svg+xml','.ico':'image/x-icon','.woff2':'font/woff2','.rsc':'text/x-component'};
const server=http.createServer((req,res)=>{
 lastRequest=Date.now();const url=new URL(req.url,'http://127.0.0.1:'+PORT);
 if(url.pathname==='/__folsom_health'){res.writeHead(200,{'Content-Type':'application/json','Cache-Control':'no-store'});res.end(JSON.stringify({app:'folsom-play-lab',version:1}));return}
 let requestPath;try{requestPath=decodeURIComponent(url.pathname)}catch{res.writeHead(400);res.end('Invalid path');return}
 let file=path.resolve(ROOT,'.'+requestPath);if(file!==ROOT&&!file.startsWith(ROOT+path.sep)){res.writeHead(403);res.end('Forbidden');return}
 try{if(fs.statSync(file).isDirectory())file=path.join(file,'index.html')}catch{}
 if(!fs.existsSync(file)){res.writeHead(404);res.end('Not found');return}
 const stat=fs.statSync(file);res.writeHead(200,{'Content-Type':types[path.extname(file)]||'application/octet-stream','Content-Length':stat.size,'Cache-Control':path.extname(file)==='.html'?'no-cache':'public, max-age=3600','X-Content-Type-Options':'nosniff'});fs.createReadStream(file).pipe(res);
});
server.on('error',error=>{if(error.code==='EADDRINUSE')process.exit(0);console.error(error);process.exit(1)});
server.listen(PORT,'127.0.0.1',()=>console.log('Folsom Play Lab: http://127.0.0.1:'+PORT));
setInterval(()=>{if(Date.now()-lastRequest>300000)server.close(()=>process.exit(0))},60000).unref();
