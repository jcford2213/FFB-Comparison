/*
NFL Stat Scraper -- Jack Doyle, TE, Indianapolis Colts

Author: Jackson Crantford (Idiotic Marlin)

Node.js using Request and Cheerio modules

Last Update: 6/5/2921 - 11:28 am

AS of last update - This scrapes Jack Doyle player information and career statistics from his profile page on Pro Football Reference
The program logs 3 JSON objects to the console; Doyle's basic profile, stat headers, and career stats.
*/

// || Dependencies ||
const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');


// || Global Constants ||
const pfrDomain = 'https://www.pro-football-reference.com/players/';
const test_Players = {
  "B/BrisJa00":"Jacoby Brissett",
  "J/JoneAa00":"Aaron Jones",
  "C/CrowJa00":"Jamison Crowder",
  "D/DoylJa00":"Jack Doyle"
};
const paths = Object.keys(test_Players);
const allPositions = ['QB', 'RB', 'WR', 'TE'];
let jsonContainer = [];

// || Functions ||

/* Asynchronous Function. Requests html from Player's PFR page.
* Runs getPlayerProfile and getPlayerStats functions
*/

const main = async () => {
  await getAllPlayerInfo(paths)
  .then(console.log('BETWEEN AXIOS AND FS'))
  .then(saveJsonObject(jsonContainer))
  .catch(err => {
    console.log(err);
  });
}


const getAllPlayerInfo =  async path => {
  path.forEach(async path => {
    const axiosResponse = await axios.get(`${pfrDomain}${path}.htm`);  // Request html from pfr
    console.log(`... Requesting ${path} ...`);
    if (axiosResponse.status == 200) {
      console.log(`... Request Success ... StatusCode: ${axiosResponse.status}...`)
      const playerObject = getPlayerProfile(axiosResponse, path);
      const playerStatsObject = getPlayerStats(axiosResponse, playerObject.current_position)
      playerObject[`stats`] = playerStatsObject;
      console.log(`=== ${test_Players[path]}'s object: `, playerObject, ` ===`);
      jsonContainer.push(playerObject);
    } else {
        throw `...Request Failure... StatusCode: ${axiosResponse.status}...`;
    }
  });
}


/* Takes Axios html request as argument
* Creates a Player Profile Object from selected pfr html tags
* Returns the Player Profile Object
*/
const getPlayerProfile = (axiosConn, playerUrl) => {
  const $ = cheerio.load(axiosConn.data);
  const playerInfoSelection = $('div[itemtype="https://schema.org/Person"] > p');   // Select player profile section <p> tags
  console.log(`=== Scraping ${test_Players[playerUrl]} ===`);
  let playerProfileObject = {
    'player_Id':playerUrl,
    'player_name':test_Players[playerUrl]
  };
  playerInfoSelection.each( (i, elem) => {
    const element = $(elem).text().replace(/\s\s+/g, '');
    let currentPosition = null;
    if (i == 1) {
      for(let i = 0; i < allPositions.length; i++) {
        if (element.includes(allPositions[i])){
          currentPosition = allPositions[i];
        }
      }
      playerProfileObject[`current_position`] = currentPosition;
    } else if (i == 3) {
      const team = element.replace('Team:', '').trim();
      playerProfileObject[`Team`] = team;
    } else if (i == 2) {
      const height = element.slice(0, 3);
      const weight = element.slice(5, 8);
      playerProfileObject[`height`] = height;
      playerProfileObject['weight'] = weight;
    } else if (i == 4) {
      let ageSelection = $('span', playerInfoSelection);
      const birthday = $(ageSelection[3]).text().replace(/\s\s+/g, '');
      playerProfileObject[`birth_date`] = birthday;
    } else if (i == 5) {
      let collegeSelection = $('a', playerInfoSelection)
      const college = $(collegeSelection[3]).text().replace(/\s\s+/g, '');
      playerProfileObject[`college`] = college;
    }
  });

  return playerProfileObject;
}


/* Takes Axios html request and player position as arguments
* Creates a Player Stats Object from selected pfr stats table based on player position
* Returns the player stats object
*/
const getPlayerStats = (axiosConn, position) => {
  const standardHeader = ['year', 'age', 'team', 'position', 'number', 'games', 'games_started'];

  const passHeader = ['qb_record', 'completions', 'attempts', 'completion_percentage', 'passing_yards', 'passing_tds',
                    'passing_td_percentage', 'interceptions', 'interception_percentage', 'passing_firstdowns', 'longest_completion',
                    'yards_per_attempt', 'adj_yards_per_attempt', 'yards_per_completion', 'yards_per_game',
                    'qb_rate', 'espn_qbr', 'sacks', 'sack_yards', 'net_yards_per_attempt', 'adj_net_yards_per_attempt',
                    'sack_percentage', 'comebacks', 'game_winning_drives', 'approximate_value'];

  const rushHeader = ['rush', 'rush_yards', 'rush_td', 'rush_1d', 'longest_rush', 'yards_per_rush', 'rush_yards_per_game',
                      'rush_per_game', 'targets', 'receptions', 'rec_yards', 'yards_per_reception', 'rec_td', 'rec_1d',
                      'longest_reception', 'receptions_per_game', 'rec_yards_per_game', 'catch_percentage', 'yards_per_target',
                      'total_touches', 'total_yards_per_touch', 'total_yards', 'total_td', 'fumbles', 'approximate_value'];

  const recHeader = ['targets', 'receptions', 'rec_yards', 'yards_per_reception', 'rec_td', 'rec_1d', 'longest_reception',
                      'receptions_per_game', 'rec_yards_per_game', 'catch_percentage', 'yards_per_target', 'rush', 'rush_yards',
                      'rush_td', 'rush_1d', 'longest_rush', 'yards_per_rush', 'rush_yards_per_game', 'rush_per_game', 
                      'total_touches', 'total_yards_per_touch', 'total_yards', 'total_td', 'fumbles', 'approximate_value'];
  let headersArray = [];
  let statsArray = [];
  let statTableStats;

  // load html 
  const $ = cheerio.load(axiosConn.data); 
  console.log(`=== Scrapping stats ===`)
  // Determine stat headers based on player position
  switch(position) {
    case allPositions[0]: // QB
      headersArray = standardHeader.concat(passHeader);  // Will return 2 <tr>. Only need <tr>[1].
      statTableStats = $('tr[id="passing.2020"]').children();
      break;
    case allPositions[1]: // RB
      headersArray = standardHeader.concat(rushHeader);  // Will return 2 <tr>. Only need <tr>[1].
      statTableStats = $('tr[id="rushing_and_receiving.2020"]').children();
      break;
    case allPositions[2]: // WR
      headersArray = standardHeader.concat(recHeader);  // Will return 2 <tr>. Only need <tr>[1].
      statTableStats = $('tr[id="receiving_and_rushing.2020"]').children();
      break;
    case allPositions[3]: // TE
      headersArray = standardHeader.concat(recHeader);  // Will return 2 <tr>. Only need <tr>[1].
      statTableStats = $('tr[id="receiving_and_rushing.2020"]').children();// Returns only 2020 year <tr> (last year in list).
      break;
    default:
      throw 'Player Position is NULL';
  }

  // convert each stat to clean string and append to statArray
  statTableStats.each((i, elem) => {
    if ($(elem).text() == '') {
      if (headersArray[i] == 'position') {
        statsArray.push(`${position}`);
      } else if (headersArray[i] == 'qb_record'){
        statsArray.push('0-0');
      } else {
        statsArray.push("0");
      }
    } else {
      statsArray.push($(elem).text());
    }
  });

  // add headers and statArray to playerStatsObject
  let playerStatsObject = {};
  headersArray.forEach((elem, i) => {
    playerStatsObject[`${elem}`] = statsArray[i];
  });

  return playerStatsObject;
}


const saveJsonObject = async (containerObject) => {
  fs.writeFile('test_player_stats.json', JSON.stringify(containerObject), err => {
    if (err) {
      return console.log(`... ERROR ... ${err} ...`);
    }
    console.log(`... Json file has been updated with latest player information ...`);
  });
} 


// || Run program ||
if (require.main === module) {
  main();
}