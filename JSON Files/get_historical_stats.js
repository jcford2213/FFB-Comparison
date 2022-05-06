/*
NFL Stat Scraper -- Jack Doyle, TE, Indianapolis Colts

Author: Jackson Crantford (Idiotic Marlin)

Node.js using Request and Cheerio modules

Last Update: 6/5/2921 - 11:28 am

AS of last update - This scrapes Jack Doyle player information and career statistics from his profile page on Pro Football Reference
The program logs 3 JSON objects to the console; Doyle's basic profile, stat headers, and career stats.
*/


// || Dependencies ||
const request = require('request');
const cheerio = require('cheerio');
const fs = require('fs');

// || Global Variables
const playerInfoArray = [];
const playerStatsArray = [];

// || Open and read playrs.json
fs.readFile('playerIds.json', 'utf-8', (err, data) => {
  if (err) throw err;

  // Convert players data string to JSON object
  const dataJSON = JSON.parse(data);
  console.log(`===== players.json OPENED. Data CONVERTED to JSON =====`)

  // Array containing each dataJSON pair as an element.
  // Each element is a list [key : value]
  const newJSON = Object.entries(dataJSON);

  // Loop through newJSON grab each key, which completes a URL path
  // The path sets URL to the corresponding player's PFR profile page
  for (let i = 0; i < 2; i++) {
    const playerPath = newJSON[i][0];
    const playerName = newJSON[i][1];
    const siteURL = `https://www.pro-football-reference.com/players/${playerPath}.htm`;

  // || Get HTML from siteURL using REQUEST ||
    request(siteURL, (err, res, html) => {
      if (err) {
        console.log(`ERROR... ${err} on ${playerName}`);
      }
      if (res && res.statusCode == 200) {
        console.log(`CONNECTION to ${siteURL} ... status code - ${res.statusCode}`)
        // Create CHEERIO object with the requested html
        const $ = cheerio.load(html);

      // || Grab Player Profile
        // Create a player profile object
        const playerProfile = {
          id : playerPath,
          name : playerName
        };
        const allPositions = ['QB', 'RB', 'WR', 'TE'];
        let currentPosition = 'QB'
        const playerInfo = $('div[itemtype="https://schema.org/Person"] > *');
        playerInfo.each( (i, elem) => {
          const element = $(elem)
            .text()
            .replace(/\s\s+/g, '')  // replace all whitespace chars with ''
            .trim();
          // get player position 
          if (element.includes('Position')) {
            for (let i = 0; i < allPositions.length; i++) {
              if (element.includes(allPositions[i])) {
                currentPosition = allPositions[i];
              }
            };
            playerProfile['position'] = currentPosition;  // Append new position key and position value to playerProfile object
          } else if (element.includes('Team')) {
            const team = element
              .replace('Team:', '')
              .trim();
            playerProfile[`Team`] = team;
          } else if (i == 3) {
            const height = element.slice(0, 4);
            const weight = element.slice(6, 9);
            playerProfile[`height`] = height;
            playerProfile['weight'] = weight;
          } else {
            // pass
          }
        });
      
// || Grab Career Stats ||
        // Create temporary stats list
        const statsArray = [];
        let playerStats;
        switch (currentPosition) {
          case 'RB':
            playerStats = $('#rushing_and_receiving > tbody > tr > th, #rushing_and_receiving > tbody > tr > td');
            break;
          case 'WR':
            playerStats = $('#receiving_and_rushing > tbody > tr > th, #receiving_and_rushing > tbody > tr > td');
            break;
          case 'TE':
            playerStats = $('#receiving_and_rushing > tbody > tr > th, #receiving_and_rushing > tbody > tr > td');
            break;
          case 'QB':
            playerStats = $('#passing > tbody > tr > th, #passing > tbody > tr > td');
        };
        
        playerStats.each( (i, elem) => {
          const element = $(elem)
            .text()
            .replace(/\s\s+/g, '')
            .trim();
          statsArray.push(element);  // 
        });
        
// || Grab Stat Headers
        // Create player stats object
        const headersArray = [];
        let headers;
        // Determine table selection target from currentPosition
        switch (currentPosition) {
          case 'RB':
            headers = $('#rushing_and_receiving > thead > tr > th').not('.over_header');
            break;
          case 'WR':
            headers = $('#receiving_and_rushing > thead > tr > th').not('.over_header');
            break;
          case 'TE':
            headers = $('#receiving_and_rushing > thead > tr > th').not('.over_header');
            break;
          case 'QB':
            headers = $('#passing > thead > tr > th').not('.over_header');
        }
        // Select and gather table headers
        const statsJSON = {};
        headers.each( (i, elem) => {
          const element = $(elem)
            .text()
            .replace(/\s\s+/g, '')
            .trim();
          if (element != '') {
            if (currentPosition == 'WR' || currentPosition == 'TE') {
              if ( i >= 7 && i < 18) {
                headersArray.push(`Rec${element}`);
              } else if (i >= 18) {
                headersArray.push(`Run${element}`);
              } else {
                headersArray.push(element);
              }
            } else if (currentPosition == 'RB') {
                if ( i >= 7 && i < 15) {
                  headersArray.push(`Run${element}`);
                } else if (i >= 15) {
                  headersArray.push(`Rec${element}`);
                } else {
                  headersArray.push(element);
                }
            } else if (i > 7) {
                headersArray.push(`Pas${element}`);
            } else {
              headersArray.push(element);
            }
          }
        });
        let count = 0;
        let year;
        for (let i = 0; i < (statsArray.length); i++) {
          if (count == 0) {  // Append year key for nested stats as value
            year = statsArray[i];
            statsJSON[`${statsArray[i]}`] = {};
            count += 1;
          } else {
            statsJSON[`${year}`][`${headersArray[count]}`] = statsArray[i];
            if (count == (headersArray.length - 1)) {
              count = 0;
              continue;
            }
            count += 1;
          }
        };
        
        playerProfile[`stats`] = statsJSON;
        
        console.log(`JSON object has been created for ${playerProfile.name}`)
        fs.writeFile('playerStats.json', JSON.stringify(playerProfile, null, 2), (err) => {
          if (err) {
            throw err
          } else {
          console.log(`${playerProfile.name} has been added to the file. Player id: ${playerProfile.id}`);
          }
        });
      }
    });
  }
});

