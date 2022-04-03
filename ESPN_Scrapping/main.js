let request = require("request");
let cheerio = require("cheerio");
let path = require("path");
let fs = require("fs");
let matchesObj = require("./allMatches");
const { Console } = require("console");
let url = "https://www.espncricinfo.com/series/ipl-2021-1249214";

let iplPath = path.join(__dirname, "IPL");
let seriesExtracted = createDir(iplPath);
if(seriesExtracted){
    console.log("Already Present");
    return;
}
request(url, cb);
function cb(err, response, html){
    if(err){
        console.log(err);
        return;
    }else{
        getPlayerStats(html);
    }
}

function getPlayerStats(html){
    let $ = cheerio.load(html);
    let allResultsLink = $(".widget-items.cta-link").find("a").attr("href");
    allResultsLink = `https://www.espncricinfo.com${allResultsLink}`;
    console.log(allResultsLink); 
    getScoreCards(allResultsLink);
}

function getScoreCards(link){
    request(link, (err, res, html)=>{
        if(err){
            console.log(err);
            return;
        }else{
            matchesObj.sc(html);
        }
    })
}

function createDir(filePath){
    if(!fs.existsSync(filePath)){
        fs.mkdirSync(filePath);
        return false;
    }
    return true;

}
