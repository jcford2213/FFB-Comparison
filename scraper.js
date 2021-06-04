/*
NFL Stat Scraper

Author: Jackson Crantford (Idiotic Marlin)

Node.js using Request and Cheerio modules

Last Update: 6/4/2921 - 12:00 pm

AS of last update - This scrapes the player information and career statistics from their profile page on Pro Football Reference
The program outputs 3 JSON objects to the console containing the player's information and stats.
*/


// || Dependencies ||
const request = require("request");
const cheerio = require("cheerio");

// || Global Constants ||
const siteURL = "https://www.pro-football-reference.com/players/D/DoylJa00.htm";
const playerInfoArray = [];
const statHeadeerArray = [];
const playerStatsArray = [];

// || Get HTML from siteIRL using REQUEST ||
request(siteURL, (err, res, html) => {

  if (err) throw err;

  if (res.statusCode == 200) {
    // Create CHEERIO object with the requested html
    const $ = cheerio.load(html);

    // Grab basic player info (name, age, position, team, school, etc.)
    // From the top profile card section next to player's picture
    const playerInfo = $("div[itemtype='https://schema.org/Person'] > *");
    playerInfo.each( (i, elem) =>{
      const element = $(elem)
        .text()
        .replace(/\s\s+/g, "");
      playerInfoArray.push(element);
    });
    const playerJSON = JSON.stringify(playerInfoArray);
    console.log(playerJSON);

    // Grab stat table stat headers (games played, receptions, yards, etc.)
    // From the Receiving and Rushing table
    const statHeaders = $("#receiving_and_rushing > thead> tr > th").not(".over_header");
    statHeaders.each( (i, elem) => {
      const element = $(elem)
        .text()
        .replace(/\s\s+/g, "");
      if (element !== "") {
        statHeadeerArray.push(element);
      };
    });
    const headerJSON = JSON.stringify(statHeadeerArray);
    console.log(headerJSON);

    // Grab all actual stats from the Receiving and Rushing table
    // Includes every season the player has played
    const playerStats = $("#receiving_and_rushing > tbody > tr > th, td");
    playerStats.each( (i, elem) => {
      $("tr").each( (i, elem) => {
        const tempList = [];
        const element = $(elem)
          .text()
          .replace(/\s\s+/g, "");
      });
      const element = $(elem)
        .text()
        .replace(/\s\s+/g, "");
      playerStatsArray.push(element);  // 
    });
    const statsJSON = JSON.stringify(playerStatsArray);  // 
    console.log(statsJSON);
  };
});
