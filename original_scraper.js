import phantom from 'phantom';

const timeout = function(ms) {
  return new Promise(function(res){setTimeout(res, ms)});
};
  // a setTimout wrapped in a promise, allows us to await later

const scraper = async function() {

  const instance = await phantom.create();
  // everything after this await is as if inside of a .then()

  const page = await instance.createPage();

  await page.open(
    'https://www.athletic.net/TrackAndField/Division/Event.aspx?DivID=80281&Event=1&type=4'
    // 'https://www.athletic.net/TrackAndField/Division/Top.aspx?DivID=80281'
  );

  page.property('onConsoleMessage', function(msg) {
    console.log(msg);
  });

  await timeout(3000);
  //tells it to wait 3 seconds, just in case page has extra js or
  // other things that need a little extra time to load


  cot results = await page.evaluate(function() {
    const rows = document.querySelectorAll('table.DataTable tr');
    console.log(rows.length);

    const returnData = [];
    //going to create row objects with data and push them into returnData

    var current = {athletes: []};
    var first = true;
    for (var i = 0; i < rows.length; i++) {
      const currRow = rows[i];

      if (first) {
        current['event'] = currRow.querySelector('a').innerHTML;
        //this will query from the parent element of currRow
        first = false;

      } else if (currRow.classList.contains('hidden-print')){
          first = true;

          returnData.push(current);
          current = { athletes: [] };
          //we reset our "current" once we hit a new event gorup
      } else {
        const cols = currRow.children;
        //cols = all the td's inside each tr

        const athlete = {};

        for (var j = 0; j < cols.length; j++ ){
          switch(j) {
          case 0:
            athlete['place'] = cols[j].innerHTML;
            break;
          case 1:
            athlete['grade'] = cols[j].innerHTML;
            break;
          }
        }
        current.athletes.push(athlete)
      }

    }
    //end of main for loop (what to copy paste in dev tools up until)

  return window.JSON.stringify(returnData);
  //because phantom will only let you return strings or numbers
  });
  //end of .evaluate function
  console.log(results);
  const output = JSON.parse(results);
  console.log(output);
  instance.exit();
};

scraper();












//
