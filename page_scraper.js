import phantom from 'phantom';

const pageScraper = (page) =>  page.evaluate(function() {
  const rows = document.querySelectorAll('table.DataTable tr');
  // console.log(rows.length);

  const returnData = [];
  //going to create row objects with data and push them into returnData

  var current = {athletes: []};
  var first = true;
  for (var i = 0; i < rows.length-1; i++) {
    // console.log(i);
    const currRow = rows[i];

    if (first) {
      current['event'] = document.querySelectorAll('h2')[0].innerText;
      //this will query from the whole page to find the title element and input that into our results
      first = false;

    } else if (currRow.classList.contains('.btn.btn-default.mRight10')){
      // this conditional will ultimately handle clicking onto the next page
        first = true;

        current = { athletes: [] };
        break;
        //we reset our "current" once we hit a new event gorup
    } else {
      const cols = currRow.children;
      //cols = all the td's inside each tr
      // console.log(cols);
      const athlete = {};

      for (var j = 1; j < 7; j++ ){
        // i dont care about [0]
        switch(j) {
        case 1:
          athlete['grade'] = cols[j].innerText;
          break;
        case 2:
          athlete['name'] = cols[j].innerText;
          break;
        case 3:
        // i dont care about this info
          break;
        case 4:
          athlete['PR'] = cols[j].innerText;
          break;
        case 5:
          athlete['state'] = cols[j].innerText;
          break;
        case 6:
          athlete['school'] = cols[j].innerText;
          break;
        }
      }
      current.athletes.push(athlete);
      // console.log("current", current);
    }
  }
  returnData.push(current);
  //end of main for loop (what to copy paste in dev tools up until)

return window.JSON.stringify(returnData);
//because phantom will only let you return strings or numbers
});




export default pageScraper;
