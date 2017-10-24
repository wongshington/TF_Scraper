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
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_phantom__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_phantom___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_phantom__);


const timeout = function(ms) {
  return new Promise(function(res){setTimeout(res, ms)});
};
  // a setTimout wrapped in a promise, allows us to await later

const scraper = async function() {

  const instance = await __WEBPACK_IMPORTED_MODULE_0_phantom___default.a.create();
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


/***/ }),
/* 1 */
/***/ (function(module, exports) {

module.exports = require("phantom");

/***/ })
/******/ ]);