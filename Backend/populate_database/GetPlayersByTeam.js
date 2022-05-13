/*
Huddle Up Initial Player Data Grab

Date Last Modified: 5/11/2022

This program accesses SportsData.io api node PlayersByTeam
Player data from each team is collected and saves in a team Json file

This program has already run once and saved all player data
  Run was compledted at 4:00pm on 5/7/2022
  Run compledted by Jackson on Jackson's Razer
  
*/

//  DEPENDENCIES
const https = require('https');
const mysql = require('mysql');
const teamAbbrv = require ('./ApiObjects.js');


// MAIN
let team = teamAbbrv[13];
getPlayerByTeam(team);

teamAbbrv.forEach(team => {
  
  getPlayerByTeam(team);
 
});

// FUNCTIONS

// Function gets player information by team
function getPlayerByTeam(team) {
  
  const sdioOptions = {   // SportDataIO (sdio) url destination (host & path) and API Key (headers)
    host: 'api.sportsdata.io',
    path: '/v3/nfl/scores/json/Players/' + team,  // Gets player info by team
    headers: {'Ocp-Apim-Subscription-Key': 'e3d1821e0d254cf48477554b14281734'}
  };

  const conn = mysql.createConnection({   // create huddleup database object
    host: 'localhost',
    user: 'root',
    password: 'MyNewPass',
    database: 'huddleupdata'
  });


  https.get(sdioOptions, resp => {    // SportDataIO API call 
    let data = '';    // container for incomming data

    resp.on('data', (chunk) => {  // collects data as it filters in and adds to data container
      data += chunk;
    });

    resp.on('end', () => {
      conn.connect((err) => {   // Connect to huddleupdata database
        if (err) {console.log('Error: Failed to connect to DB: ' + err);}
          else {  
            console.log('Connection to DB Successful');
            let playerFieldHeaders = [];  // Container for player table field names
            const databaseColumns = conn.query('SHOW COLUMNS FROM player', (err, results) => {  // MySQL selects all colums in player table
              if (err) {console.log(err.message);}
                else {
                  results.forEach(obj => {  // Each column's field name is selected and added to the container
                    let field = Object.values(obj);
                    playerFieldHeaders.push(field[0]);
                    console.log(playerFieldHeaders);
                    return playerFieldHeaders
                  });
                }
            });
            conn.end();
          }
      });
        
      const dataObject = JSON.parse(data);
      console.log('Data is of type: ' + typeof dataJson);
      
      const dataKeys = Object.keys(dataObject);
      console.log(dataObject);
      //dataKeys.forEach(key =>{
    });
      
  }).on("error", (err) => {   // Catch error and log it in console
    console.log("Error: " + err.message);
  });

}