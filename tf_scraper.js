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
    'https://www.athletic.net/TrackAndField/Division/Top.aspx?DivID=80281'
  );

  page.property('onConsoleMessage', function(msg) {
    console.log(msg);
  });

  await timeout(3000);
  //tells it to wait 3 seconds, just in case page has extra js or
  // other things that need a little extra time to load


  await page.evaluate(function() {
    const rows = document.querySelectorAll('table.DataTable tr');
    console.log(rows.length);

    const returnData = [];
    //going to create row objects with data and push them into returnData

    let current = {finishers: []};
    let first = true;
    for (let i = 0; i < rows.length; i++) {
      const currRow = rows[i];

      if (first) {
        current['event'] = currRow.querySelector('a').innerHTML;
        //this will query from the parent element of currRow
        first = false;

      } else if (currRow.classList.contains('hidden-print')){
          first = true;
      } else {
        const cols = currRow.children;
        //cols = all the td's inside each tr

        const finisher = {};

        for (let j = 0; j < cols.length; j++ ){
          switch(j) {
          case 0:
            finisher['place'] = cols[j].innerHTML;
            break;
          case 1:
            finisher['grade'] = cols[j].innerHTML;
            break;
          }
        }
        current.finishers.push(finisher)

      }
      returnData.push(current);
      current = { finishers: [] };
    }


  });

  instance.exit();
};

scraper();












//