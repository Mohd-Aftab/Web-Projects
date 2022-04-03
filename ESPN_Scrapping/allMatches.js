let request = require("request");
let cheerio = require("cheerio");
let scoreObj = require("./scorecard")

function scoreCards(html){
    let $ = cheerio.load(html);
    let allCards = $(`a[data-hover="Scorecard"]`);
    for(let i of allCards){
        let cardLink = $(i).attr("href");
        cardLink = `https://www.espncricinfo.com${cardLink}`;
        // console.log(cardLink);
        scoreObj.matchDetail(cardLink);
    }
}

function excelWrite(filePath){
    let newWb = xlsx.utils.book_new();
    let newWS = xlsx.utils.json_to_sheet(data);
    xlsx.utils.book_append_sheet(newWb, newWS, "sheet-1"); // workbook sheetData, sheetName
    xlsx.writeFile(newWb, filePath);
}


function excelRead(filePath, sheetName){
    let wb = xlsx.readFile(filePath);
    let excelData = wb.Sheets[sheetName];
    let ans = xlsx.utils.sheet_to_json(excelData);
    ans.push({
        name : "sgdgfjkfgug",
        character_name : "Thor",
        height: 6.2
    })
    return ans;
}


module.exports = {
    sc : scoreCards
}