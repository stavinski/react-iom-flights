'use strict';

(function (globals) {
  var getFlights = function (direction, cb) {
    var url = 'https://iom-flights.herokuapp.com/v1/flights/' + direction;
    var request = globals.superagent;

    request.get(url)
    .type('application/json')
    .end(flightsResponse);

    function flightsResponse(err, response) {
      if (err) {
        cb(err, null);
      } else {
        cb(null, response.body);
      }
    }
  };

  globals.flightApi = {
    getFlights: getFlights
  };

}(window));
