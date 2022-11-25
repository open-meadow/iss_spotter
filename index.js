/**
 * Makes a single API request to retrieve the user's IP address.
 * Input:
 *   - A callback (to pass back an error or the IP string)
 * Returns (via Callback):
 *   - An error, if any (nullable)
 *   - The IP address as a string (null if error). Example: "162.245.144.188"
 */

const { fetchMyIp } = require('./iss');
const { fetchCordsByIP } = require('./iss');
const { fetchISSFlyoverTimes } = require('./iss');
const { nextISSTimesForMyLocation } = require('./iss')


// // fetch IP
// fetchMyIp((error, ip) => {
//   if (error) {
//     console.log("Error: ", error);
//     return;
//   }

//   //fetch co-ordinates by ip
//   console.log("It worked! ", ip);
//   fetchCordsByIP (ip, (error, data) => {
//     if (error) {
//       console.log("Error: ", error);
//       return;
//     }

//     // fetch ISS flyover times
//     console.log("Data: ", data);
//     fetchISSFlyoverTimes (data, (error, data) => {
//       if(error) {
//         console.log("Error: ", error);
//         return;
//       }

//       // next ISS times for my location
//       console.log("Data: ", data);
//       nextISSTimesForMyLocation(data, (error, passTimes) => {
//         if(error) {
//           console.log("It didn't work", error);
//           return;
//         }

//         console.log(passTimes);
//       });

//     });

//   });


// });

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

nextISSTimesForMyLocation((error, passTimes) => {
  if (error) {
    return console.log("It didn't work!", error);
  }
  // success, print out the deets!
  printPassTimes(passTimes);
});




// latitude: 43.6655,
// longitude: -79.4204

// current ip: 169.150.204.47

