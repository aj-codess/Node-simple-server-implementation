const fs=require("node:fs");
const path=require("node:path");
const fs_promises=require("node:fs").promises;

let gen=async(req_nes,des)=>{
    try{
        await fs_promises.appendFile(path.join(__dirname,des),req_nes,'utf-8');
    }catch(error){
        console.log("failed writing to file");
    }
};

module.exports=gen;