/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 1);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

module.exports = require("phantom");

/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_phantom__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_phantom___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_phantom__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__page_scraper_js__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_fs__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_fs___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_fs__);



// const fs1 = require('fs');
// var fs = require("fs");


const timeout = function(ms) {
  return new Promise(function(res){setTimeout(res, ms)});
};
  // a setTimout wrapped in a promise, allows us to await later

const scraper = async function() {

  const instance = await __WEBPACK_IMPORTED_MODULE_0_phantom___default.a.create();
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

  const pageResults = await Object(__WEBPACK_IMPORTED_MODULE_1__page_scraper_js__["a" /* default */])(page);
  // this line above runs the separate file that scrapes an individual "page"


  const output = JSON.stringify(pageResults, null, 4);
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

await __WEBPACK_IMPORTED_MODULE_2_fs___default.a.writeFile("./output.csv", output, (err) => {
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


/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_phantom__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_phantom___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_phantom__);


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
        // case 3:
        // // i dont care about this info
        //   break;
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




/* harmony default export */ __webpack_exports__["a"] = (pageScraper);


/***/ }),
/* 3 */
/***/ (function(module, exports) {

module.exports = require("fs");

/***/ })
/******/ ]);