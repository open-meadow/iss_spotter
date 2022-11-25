const request = require('request-promise-native');

const fetchMyIP = function () {
  return request("https://api.ipify.org?format=json");
};

const fetchCoordsByIP = function (body) {
  let newIp = JSON.parse(body)["ip"];
  // request(`http://ipwho.is/${newIp}`, (error, response, body) => {
  //   return (body);
  // }); -- not returning anything

  return request(`http://ipwho.is/${newIp}`);
};

const fetchISSFlyOverTimes = function (body) {
  const { latitude, longitude } = JSON.parse(body);

  console.log(latitude, longitude);

  return request(`https://iss-flyover.herokuapp.com/json/?lat=${latitude}&lon=${longitude}`);
};

const nextISSTimesForMyLocation = function() {
  return fetchMyIP()
    .then(fetchCoordsByIP)
    .then(fetchISSFlyOverTimes)
    .then((data) => {
      const { response } = JSON.parse(data);
      return response;
    });
};

module.exports = { nextISSTimesForMyLocation };
