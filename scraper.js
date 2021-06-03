const request = require("request");
const cheerio = require("cheerio");

const siteURL = "https://www.pro-football-reference.com/players/D/DoylJa00.htm";

request(siteURL, (err, res, html) => {
  if (err) throw err;
  if (res.statusCode == 200) {
    const $ = cheerio.load(html);
    const playerName = $("div[itemtype='https://schema.org/Person'] > *")
    playerName.each( (i, elem) =>{
      const element = $(elem).text();
      const string = element.replace(/\s/g, "");
      playerArray.push(string);
    });
    
    const playerJSON = JSON.stringify(playerArray);
    console.log(playerJSON);
  };
});
