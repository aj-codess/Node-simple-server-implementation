let gen=require(`${__dirname}/server_dep.js`);
const fs=require("node:fs");
const fs_promises=require("node:fs").promises;
const path=require("node:path");
const http=require("node:http");

const PORT=process.env.PORT || 3000;

let fileServe=async(des,cnt_type,response)=>{
    try{
        let rawData=await fs_promises.readFile(des,cnt_type.includes("image")?null:"utf8");
        let data=cnt_type==="application/json"?JSON.parse(rawData):rawData;
        response.writeHead(des.includes("404.html")?404:200,{"content-type":cnt_type});
        response.end(cnt_type==="application/json"?JSON.stringify(data):data);
    } catch(err){
        console.log(err);
        gen(`${err.name} : ${err.message}`,"errLog.txt");
        response.statusCode=500;
        response.end();
    }
};

const server=http.createServer((req,res)=>{
    gen(`${req.url}\t${req.method}`,"reqLog.txt");
    let extention=path.extname(req.url);

    if(!extention && req.url.slice(-1)==="/"){
        extention+=".html";
    };

    let cnt_type_ext_obj={
        ".html":"text/html",
        ".css":"text/css",
        ".txt":"plain/text",
        ".js":"text/javascript",
        ".json":"application/json",
        ".mp3":"audio/mpeg",
        ".jpg":"image/jpeg",
        ".png":"image/png",
        ".svg":"image/svg+xml",
        ".mp4":"video/mp4"
    };

    let content_type=cnt_type_ext_obj[extention] || "text/html";

    let filePath=content_type==="text/html" && req.url==="/"?
        path.join(__dirname,"views","index.html"):
        content_type==="text/html" && req.url.slice(-1)==="/"?
        path.join(__dirname,req.url,"index.html"):content_type==="text/html"?
        path.join(__dirname,"views",req.url):path.join(__dirname,req.url);
    
        let file_ext_checks=fs.existsSync(filePath);

        if(file_ext_checks){
            fileServe(filePath,content_type,res);
        } else{
                switch(path.parse(filePath).base){
                    case "old_page.html":
                        res.writeHead(301,{"Location":"new_page.html"});
                        res.end();
                    break;
                    default:
                        fileServe(path.join(__dirname,"views","404.html"),"text/html",res);
                }
        }
});

server.listen(PORT,()=>{
    console.log(`listening to port ${PORT}........`);
});

process.on("uncaughtException",(err)=>{
    if(err) throw err;
    process.exit(1);
})