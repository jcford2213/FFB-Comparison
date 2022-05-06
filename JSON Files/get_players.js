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

// Leads to 2020 player fantasy data
const siteURL = 'https://www.pro-football-reference.com/years/2020/fantasy.htm';

// Players object
const players2020 = {}

// Get the html
request(siteURL, (err, res, html) => {
  if (err) throw err;

  if (res.statusCode == 200) {
    // Parse html with Cheerio
    const $ = cheerio.load(html);

    // Select the player hyperlink from the fantasy rankings table
    const playerPath = $('#fantasy  tbody tr td[data-stat="player"] a');
    // Each hyperlink yeilds a path and a player name
    playerPath.each( (i, elem) => {
      path = $(elem)
        .attr('href')
        .replace(/(?:\/players\/)/, '')
        .replace(/(?:\.htm)/, '');
      player = $(elem).text()
      // Add the player path and player name to the Players object
      players2020[`${path}`] = player;
    });

    // Turns players object to a JSON string
    const playersJSON = JSON.stringify(players2020);
    console.log(playersJSON);

    // Writes the players JSON string to players.json file
    fs.writeFile('players.json', playersJSON, (err) => {
      if (err) throw err;
      console.log('players.json SAVED!');
    });
  }
});
