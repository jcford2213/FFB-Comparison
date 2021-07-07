const mysql = require('mysql');
const fs = require('fs');

const main = () => {
  try {
    const playerObject = getPlayerObject();
    console.log(playerObject);
    const database = mysql.createConnection({
      host: `localhost`,
      user:`root`,
      password:`MyNewPass`
    });
    /*database.connect(err => {
      if (err) throw err;
      console.log("Connected!");
    }); */
  } catch (err) {
      console.log(`... ERROR ... ${err}`);
  }
}

const getPlayerObject = () => {
  fs.readFile('test_player_stats.json', 'utf-8', (err, data) => {
    if (err) throw err;
    playerObject = JSON.parse(data);
    return playerObject;
  });
}

if (require.main === module) {
  main();
}