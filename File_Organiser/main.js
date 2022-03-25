#!/usr/bin/env node

let inputArr = process.argv.slice(2);
let command = inputArr[0];
let fs = require("fs");
let path = require("path");
let types = {
    media : ["mp4", "mkv"],
    pics : ["jpeg", "png", "gif", "jpg", "tif", "tiff", "eps"],
    archives : ["zip", "7z", "rar", "tar", "gz", "ar", "iso", "xz"],
    documents : ["docx", "doc", "pdf", "xlsx", "xls", "odt", "ods", "odp", "odg", "odf", "txt", "ps", "tex"],
    app: ["exe", "dmg", "pkg", "deb"]
}
switch(command){
    case "help":
        helpFn();
        break;
    case "tree":
        treeFn(inputArr[1]);
        break;
    case "organise":
        organiseFn(inputArr[1]);
        break;
    default:
        console.log("Please 🧐 Enter the right command");
        break;
}

function helpFn(){
    console.log(`List of commands:
            help=> node main.js help
            organise=> node main.js organise "Directory Path"
            tree=> node main.js tree "Directory Path"
    `)
}


// ORGANISE IN FOLDERS
function organiseFn(dirPath){
    let destPath;
    // console.log(`Command Implemented for organise Folder`);
    if(dirPath == undefined){
        console.log("Please right the dir path.");      
        let dirPath = process.cwd();
        destPath = path.join(dirPath, "organise");
        if(!fs.existsSync(destPath)){
            fs.mkdirSync(destPath);
        }
        organise_helper(dirPath, destPath);
    }else{
        let doesExist = fs.existsSync(dirPath);
        if(doesExist){
            destPath = path.join(dirPath, "organise");
            if(!fs.existsSync(destPath)){
                fs.mkdirSync(destPath);
            }
            organise_helper(dirPath, destPath);
        }
        else{
            console.lof("Enter the correct directory path");
            return;
        }
    }
}
function organise_helper(dirPath, destPath){
    let childNames = fs.readdirSync(dirPath);
    // console.log(childNames);
    for(let child of childNames){
        let childAddr = path.join(dirPath, child);
        let isFile = fs.lstatSync(childAddr).isFile();
        if(isFile){
            let category = getCategory(childAddr);
            sendFile(childAddr, destPath, category);
        }
    }
}

function sendFile(childAddr, dest, category){
    let categoryPath = path.join(dest, category);
    if(!fs.existsSync(categoryPath)){
        fs.mkdirSync(categoryPath);
    }
    let fileName = path.basename(childAddr);
    let destFilePath = path.join(categoryPath, fileName);   
    fs.copyFileSync(childAddr, destFilePath);
    console.log(fileName, "copied to", category);
}

function getCategory(filePath){
    let extName = path.extname(filePath);
    extName = extName.slice(1);
    for(let type in types){
        let singleType = types[type];
        for(let st of singleType){
            if(extName == st){
                return type;
            }
        }
    }
    return "others";
}







// "├──"
// └──
function treeFn(dirPath){
    if(dirPath == undefined){
        console.log("Please provide the directory path");
        treeHelper(process.cwd(), "");
    }else{
        let doesExist = fs.existsSync(dirPath);
        if(doesExist){
            treeHelper(dirPath, "");
        }
        else{
            console.log("Please provide the correct path.");
            return;
        }
    }
}

function treeHelper(dirPath, indent){
    let isFile = fs.lstatSync(dirPath).isFile();
    if(isFile){
        let fileName = path.basename(dirPath);
        console.log(indent + "├──" + fileName);
    }else{
        let dirName = path.basename(dirPath);
        console.log(indent + "└──" + dirName);
        let children = fs.readdirSync(dirPath);
        for(let i=0; i<children.length; i++){
            let childPath = path.join(dirPath, children[i]);
            treeHelper(childPath, indent+"\t");
        }
    }
}

