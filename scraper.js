const request = require("request");
const cheerio = require("cheerio");

const siteURL = "https://www.pro-football-reference.com/players/D/DoylJa00.htm";

request(siteURL, (err, res, html) => {
  if (err) throw err;
  if (res.statusCode == 200) {
    const $ = cheerio.load(html);
    const playerName = $("h1[itemprop='name']")
    console.log(playerName.text());
  }
});