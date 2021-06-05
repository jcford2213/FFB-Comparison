/*
NFL Stat Scraper -- Scrape nfl players' URL file path name

Author: Jackson Crantford (Idiotic Marlin)

Node.js using Request and Cheerio modules

Last Update: 6/5/2921 - 2:40 pm

AS of last update - This program scrapes all fantasy NFL players' names and file path from PFR Fantasy Rankings Table
The players' URL path and name is saved as a JSON object to players.json
This program is intended to be part of the initialization of the fantasy stats database.
*/

// || Dependencies ||
const request = require('request');
const cheerio = require('cheerio');
const fs = require('fs');

const siteURL = 'https://www.pro-football-reference.com/years/2020/fantasy.htm';


const players2020 = {}
request(siteURL, (err, res, html) => {
  if (err) throw err;

  if (res.statusCode == 200) {
    const $ = cheerio.load(html);

    const playerPath = $('#fantasy  tbody tr td[data-stat="player"] a');
    playerPath.each( (i, elem) => {
      player = $(elem).text()
      path = $(elem)
        .attr('href')
        .replace(/(?:\/players\/)/, '')
        .replace(/(?:\.htm)/, '');
      
      players2020[`${path}`] = player;
    });
    const playersJSON = JSON.stringify(players2020);
    console.log(playersJSON);
    fs.writeFile('players.json', playersJSON, (err) => {
      if (err) throw err;
      console.log('players.json SAVED!');
    });
  }
});