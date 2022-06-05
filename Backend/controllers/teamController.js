const https = require('https');

exports.teams =  () =>{
  const teams = {
    "ARI": 'Arizona Cardinals', "ATL": "Atlanta Falcons", "BAL": "Baltimore Ravens",
    "BUF": "Buffalo Bills", "CAR": "Carolina Panthers", "CHI": "Chicago Bears",
    "CIN": "Cincinnati Bengals", "CLE": "Cleveland Browns", "DAL": "Dalas Cowboys",
    "DEN": "Denver Broncos", "DET": "Detroit Lions", "GB": "Green Bay Packers",
    "HOU": "Houston Texans", "IND": "Indianapolis Colts", "JAX": "Jacksonville Jaguars",
    "KC": "Kansas City Chiefs", "LAC": "Las Angeles Chargers", "LAR": "Las Angeles Rams",
    "LV": "Las Vegas Raiders", "MIA": "Miami Dolphins", "MIN": "Minnesota Vikings",
    "NE": "New England Patriots", "NO": "New Orleans Saints", "NYG": "New York Giants",
    "NYJ": "New York Jets", "PHI": "Philadelphia Eagles", "PIT": "Pittsburgh Steelers",
    "SEA": "Seattle Seahawks", "SF": "Sanfransisco 49ers", "TB": "Tampa Bay Buccanneers",
    "TEN": "Tennessee Titans", "WAS": "Washing Commanders"
  };
  return teams;
};

exports.getTeamData = (teamID) => {
  const sdioOptions = {   // SportDataIO (sdio) url destination (host & path) and API Key (headers)
    host: 'api.sportsdata.io',
    path: '/v3/nfl/stats/json/PlayerSeasonStatsByTeam/2021/' + teamID,  // Gets player info by team
    headers: {'Ocp-Apim-Subscription-Key': 'e3d1821e0d254cf48477554b14281734'}
  };

  https.get(sdioOptions, resp => {
    let data = '';    // container for incomming data

    resp.on('data', (chunk) => {  // collects data as it filters in and adds to data container
      data += chunk;
    });

    resp.on('end', () => {
      data = JSON.parse(data);
      return data;
    });
    console.log(data);
  })
  
  console.log('this is the getTeamData function');
};