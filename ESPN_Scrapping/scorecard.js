let request = require("request");
let cheerio = require("cheerio");
let xlsx = require("xlsx");
let fs = require("fs");
let path = require("path");
// let url = "https://www.espncricinfo.com/series/ipl-2021-1249214/mumbai-indians-vs-royal-challengers-bangalore-1st-match-1254058/full-scorecard";

function processScoreCard(url){
    request(url, cb);
}
function cb(err, response, html){
    if(err){
        console.log(err);
        return;
    }else{
        ExtractMatchDetail(html);
    }
}


/*
venue date opponent result runs balls fours sixes sr
ipl
    team
        player
            venue date opponent result runs balls fours sixes sr
*/
function ExtractMatchDetail(html){
    // Venue date result
    let $ = cheerio.load(html);
    let venueDate = $(".header-info .description").text();
    venueDate = venueDate.split(",");
    let venue = venueDate[1].trim();
    date = venueDate[2].trim();
    let winningTeam = $(".event .status-text").text();
    winningTeam = winningTeam.split("won");
    winningTeam = winningTeam[0].trim();
    // console.log(winningTeam);
    let inings = $(".card.content-block.match-scorecard-table>.Collapsible");
    let htmlString = "";
    for(let i=0; i<inings.length; i++){
        let teamName = $(inings[i]).find("h5").text();
        teamName = teamName.split("INNINGS");
        teamName = teamName[0].trim();
        let opponentIdx = i == 0? 1 : 0;
        let opponentTeam = $(inings[opponentIdx]).find("h5").text();
        opponentTeam = opponentTeam.split("INNINGS");
        opponentTeam = opponentTeam[0].trim();
        // console.log(`${venue} ${date} ${teamName} VS ${opponentTeam} ${result}`);

        // Players runs balls foures sixes sr
        let cining = $(inings[i]);
        let allRows = cining.find(".table.batsman tbody tr");
        for(let j=0; j<allRows.length; j++){
            let allCols = $(allRows[j]).find("td");
            let isWorthy = $(allCols[0]).hasClass("batsman-cell");
            if(isWorthy){
                let playerName = $(allCols[0]).text().trim();
                let run = $(allCols[2]).text().trim();
                let balls = $(allCols[3]).text().trim();
                let fours = $(allCols[5]).text().trim();
                let sixes = $(allCols[6]).text().trim();
                let sr = $(allCols[7]).text().trim();
                // console.log(`${playerName} ${run} ${balls} ${fours} ${sixes} ${sr}`);
                // playerName,run,balls,fours,sixes,sr,teamName,opponentTeam,venue,date
                playerFile(playerName,run,balls,fours,sixes,sr,teamName,opponentTeam,venue,date, winningTeam);
            }
        }

    }
}

function playerFile(playerName,run,balls,fours,sixes,sr,teamName,opponentTeam,venue,date, winningTeam){
    let teamFold = path.join(__dirname, "IPL", teamName);
    createDir(teamFold);
    let playerFilePath = path.join(teamFold, playerName+".xlsx");
    let playerDetail = excelRead(playerFilePath, playerName);
    let playerObj = {
        teamName,
        playerName,
        opponentTeam,
        venue,
        date,
        balls,
        run,
        fours,
        sixes,
        sr,
        winningTeam,
    }
    playerDetail.push(playerObj);
    excelWrite(playerFilePath, playerDetail, playerName)
}

function excelWrite(filePath,data, sheetName){
    let newWb = xlsx.utils.book_new();
    let newWS = xlsx.utils.json_to_sheet(data);
    xlsx.utils.book_append_sheet(newWb, newWS, sheetName); // workbook sheetData, sheetName
    xlsx.writeFile(newWb, filePath);
}


function excelRead(filePath, sheetName){
    if(!fs.existsSync(filePath)){
        return [];
    }
    let wb = xlsx.readFile(filePath);
    let excelData = wb.Sheets[sheetName];
    let ans = xlsx.utils.sheet_to_json(excelData);
    return ans;
}

function createDir(filePath){
    if(!fs.existsSync(filePath)){
        fs.mkdirSync(filePath);
    }
}

module.exports = {
    matchDetail : processScoreCard
}