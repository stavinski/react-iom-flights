'use strict';

(function (globals) {

  var FLIGHT_DIRECTIONS = {
    arrivals: 'arrivals',
    departures: 'departures'
  };

  var getFlights = function (direction, cb) {
    var url = 'https://iom-flights.herokuapp.com/v1/flights/' + direction;
    var request = globals.superagent;

    request.get(url)
           .type('application/json')
           .withCredentials()
           .end(flightsResponse);

    function flightsResponse(err, response) {
      if (err) {
        cb(err, null);
      } else {
        cb(null, response.body);
      }
    }
  };

  var App = React.createClass({
    retrieveFlights: function () {
      var self = this;

      getFlights(this.state.direction, function (err, data) {
        self.setState({
          error: err,
          updated: (data) ? data.updated : null,
          flights: (data) ? data.flights : [],
          direction: self.state.direction
        });
      });
    },
    handleDirectionChange: function(direction) {
      var newState = this.state;
      newState.direction = direction;
      this.setState(newState);
      this.retrieveFlights();
    },
    getInitialState: function () {
      return {
        error: null,
        updated: new Date(),
        flights: [],
        direction: FLIGHT_DIRECTIONS.arrivals
      };
    },
    componentDidMount: function () {
      this.retrieveFlights();
    },
    render: function () {
      return (<div className="row">
                <FlightsHeader error={this.state.error}
                               updated={this.state.updated}
                               direction={this.state.direction}
                               onDirectionChange={this.handleDirectionChange}
                               onRefresh={this.retrieveFlights} />
                <FlightsList flights={this.state.flights} />
              </div>);
    }
  });

  var FlightsHeader = React.createClass({
    handleDirectionChange: function(e) {
      e.preventDefault();

      var newDirection = (this.props.direction == FLIGHT_DIRECTIONS.arrivals) ? FLIGHT_DIRECTIONS.departures
                          : FLIGHT_DIRECTIONS.arrivals;

      this.props.onDirectionChange(newDirection);
    },
    render: function () {
      var header = (this.props.error) ?
                      <h3 style={{color: 'red'}}>There was an issue retrieving flights</h3>
                    : <h3>{this.props.updated}</h3>;
      var arrivals = (this.props.direction == FLIGHT_DIRECTIONS.arrivals) ?
                       <button type="button" disabled="disabled" className="btn btn-primary active" role="button">
                          <span className="glyphicon glyphicon-plane"></span> Arrivals
                       </button>
                     : <button type="button" onClick={this.handleDirectionChange} className="btn btn-primary" role="button">
                          <span className="glyphicon glyphicon-plane"></span> Arrivals
                       </button>;
      var departures = (this.props.direction == FLIGHT_DIRECTIONS.departures) ?
                       <button type="button" disabled="disabled" className="btn btn-primary active" role="button">
                          <span className="glyphicon glyphicon-plane"></span> Departures
                       </button>
                     : <button type="button" onClick={this.handleDirectionChange} className="btn btn-primary" role="button">
                          <span className="glyphicon glyphicon-plane"></span> Departures
                       </button>;

      return (<div className="row">
                {header}
                <div className="col-md-3">
                  <div className="btn-group" role="group">
                    {arrivals}
                    {departures}
                  </div>
                </div>
                <div className="col-md-offset-11">
                  <button type="button" role="button" className="btn btn-primary" onClick={this.props.onRefresh}>
                    <span className="glyphicon glyphicon-refresh"></span>
                  </button>
                </div>
              </div>)
    }
  });

  var FlightsList = React.createClass({
    render: function () {
      var flights = this.props.flights.map(function (flight) {
        return (<Flight key={flight.id} flight={flight}/>);
      });

      return (<div className="row">
                <table className="table table-striped">
                  <thead>
                    <th>Flight No.</th>
                  </thead>
                  <tbody>{flights}</tbody>
                </table>
              </div>);
    }
  });

  var Flight = React.createClass({
    render: function () {
      return (<tr>
                <td>{this.props.flight}</td>
              </tr>);
    }
  });

  React.render(<App/>, globals.document.getElementById('flights-container'));

}(window));
