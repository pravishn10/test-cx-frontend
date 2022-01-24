const request = require("postman-request");

const forecast = (latitude, longitude, callback) => {

    const url = `http://api.weatherstack.com/current?access_key=6595b5985f9d2bb8da9e2e393408cd92&query=${latitude},${longitude}&units=m`;

    request({url, json: true}, (error, response, body) => {

        if(error) {
            callback("Unable to connect to weather service!", undefined);
        } else if(body.error) {
            callback("Unable to find location.", undefined);
        }
        else {
            callback(undefined, body.current.weather_descriptions[0] + ". It is currently "+body.current.temperature+" degrees. It feels like "+body.current.feelslike+ " degrees out.");
        }
        
    });
};

module.exports = forecast;