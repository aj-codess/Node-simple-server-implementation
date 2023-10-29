const fs=require("node:fs");
const path=require("node:path");
const fs_promises=require("node:fs").promises;
const uuid=require("uuid");
const id=uuid.v4;

let gen=async(get_data,des)=>{
    let content=`${get_data}\t${id()}`;
    try{
        await fs_promises.appendFile(path.join(__dirname,des),content,'utf-8');
    }catch(error){
        console.log("failed writing to file");
    }
};

module.exports=gen;