const request = require('request-promise-native');
const { printPassTimes } = require('./iss');
const { nextISSTimesForMyLocation } = require('./iss_promised');
// const { fetchCordsByIP } = request('./iss_promised');

nextISSTimesForMyLocation()
  .then((body) => printPassTimes(body))
  .catch((error) => {
    console.log("It didn't work");
  });
