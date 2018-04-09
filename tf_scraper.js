import phantom from 'phantom';
import pageScraper from './page_scraper.js'
import fs from "fs";
// const fs1 = require('fs');
// var fs = require("fs");


const timeout = function(ms) {
  return new Promise(function(res){setTimeout(res, ms)});
};
  // a setTimout wrapped in a promise, allows us to await later

const scraper = async function() {

  const instance = await phantom.create();
  // everything after this await is as if inside of a .then()

  const page = await instance.createPage();

  await page.open(
    'https://www.athletic.net/TrackAndField/Division/Event.aspx?DivID=80281&Event=1&page=0'
  );

  page.property('onConsoleMessage', function(msg) {
    // console.log(msg);
  });

  await timeout(3000);
  //tells it to wait 3 seconds, just in case page has extra js or
  // other things that need a little extra time to load

  const pageResults = await pageScraper(page);
  // this line above runs the separate file that scrapes an individual "page"


  const output = JSON.stringify(pageResults, null, 10);
  const tester = {
    a:"string",
    b:"string2",
    c: {
      a1: "nest",
      b2: "nester"
    }
  };


  // console.log(results);
  // const output2 = JSON.parse(results);
  // console.log(output);

await fs.writeFile("./output.csv", output, (err) => {
    if (err) {
      console.error(err);
      return;
    }
    console.log("File has been created");
  });

  instance.exit();
};

scraper();












//
