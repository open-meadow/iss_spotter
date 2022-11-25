const request = require('request');

const fetchMyIp = function (callback) {
  request("https://api64.ipify.org?format=json", (error, response, data) => { // credit to ipify.io
    if (error) { // error if invalid domain, user is offline, etc
      callback(error, data);
      return;
    }

    // if non-200 status, assume server error
    if (response.statusCode !== 200) {
      const msg = `Status code ${response.statusCode} when fetching IP. Response ${data}`;
      callback(Error(msg).message, null);
      return;
    }

    const ip = JSON.parse(data).ip;
    callback(error, ip);

  });
};

const fetchCordsByIP = function (ip, callback) {
  // let returnObj = {};
  console.log(ip);
  request(`http://ipwho.is/${ip}`, (error, response, data) => {

    console.log(data);

    if (error) {
      callback(error, null);
    } else {
      let parsedData = JSON.parse(data);

      if (parsedData.success === false) {
        callback(`Success status was ${parsedData.success}. Server message says: ${parsedData.message} when fetching for IP ${parsedData.ip}`);
        return;
      } else {
        // returnObj["latitude"] = parsedData.latitude;
        // returnObj["longitude"] = parsedData.longitude;
        const { latitude, longitude } = parsedData; // shorter version of above
        callback(error, { latitude, longitude });
      }
    }
  });
};

/**
 * Makes a single API request to retrieve upcoming ISS fly over times the for the given lat/lng coordinates.
 * Input:
 *   - An object with keys `latitude` and `longitude`
 *   - A callback (to pass back an error or the array of resulting data)
 * Returns (via Callback):
 *   - An error, if any (nullable)
 *   - The fly over times as an array of objects (null if error). Example:
 *     [ { risetime: 134564234, duration: 600 }, ... ]
 */

const fetchISSFlyoverTimes = function (coords, callback) {

  let YOUR_LAT_INPUT_HERE = coords["latitude"];
  let YOUR_LON_INPUT_HERE = coords["longitude"];

  // console.log(YOUR_LAT_INPUT_HERE, YOUR_LON_INPUT_HERE);

  request(`https://iss-flyover.herokuapp.com/json/?lat=${YOUR_LAT_INPUT_HERE}&lon=${YOUR_LON_INPUT_HERE}`, (error, response, body) => {
    // console.log(JSON.parse(body));

    // console.log("Error: ", error);

    if (error) {
      callback(error, null);
      return;
    }
    // if non-200 status, assume server error
    if (response.statusCode !== 200) {
      const msg = `Status code ${response.statusCode} when fetching IP. Response ${body}`;
      callback(Error(msg).message, null);
      return;
    }
    // console.log(body);

    // if (body === "invalid coordinates") {
    //   callback(body, null);

    // console.log(body);

    let parsedData = JSON.parse(body);
    callback(error, parsedData.response);



  });
}


/**
 * Orchestrates multiple API requests in order to determine the next 5 upcoming ISS fly overs for the user's current location.
 * Input:
 *   - A callback with an error or results. 
 * Returns (via Callback):
 *   - An error, if any (nullable)
 *   - The fly-over times as an array (null if error):
 *     [ { risetime: <number>, duration: <number> }, ... ]
 */

const nextISSTimesForMyLocation = function (callback) {
  // empty for now
  fetchMyIp((error, ip) => {
    if (error) {
      callback(error, null);
      return;
    }

    //fetch co-ordinates by ip
    // console.log("It worked! ", ip);
    fetchCordsByIP(ip, (error, data) => {
      if (error) {
        callback(error, null);
        return;
      }

      // fetch ISS flyover times
      // console.log("Data: ", data);
      fetchISSFlyoverTimes(data, (error, data) => {
        if (error) {
          callback(error, null);
          return;
        }

        // next ISS times for my location
        // console.log("Data: ", data);
        // nextISSTimesForMyLocation(data, (error, passTimes) => {
        //   if(error) {
        //     callback("It didn't work", error);
        //     return;
        //   }

        callback(null, data);
      });
    });
  });
};

const printPassTimes = (passTimes) => {
  const newArr = [];

  for (let i = 0; i < passTimes.length; i++) {
    const risetime = passTimes[i].risetime * 1000;
    // console.log(risetime);

    const date = new Date(risetime);
    const dateUTC = date.toString();
    // console.log(dateUTC);
    let nextPass = `Next pass at ${dateUTC} for ${passTimes.duration} seconds`;
    newArr.push(nextPass);
  }

  console.log(newArr)
};

module.exports = { fetchMyIp, fetchCordsByIP, fetchISSFlyoverTimes, nextISSTimesForMyLocation, printPassTimes };