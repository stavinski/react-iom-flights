'use strict';

(function (globals) {

  var FLIGHT_DIRECTIONS = {
    arrivals: 'arrivals',
    departures: 'departures'
  };

  var App = React.createClass({
    retrieveFlights: function () {
      var self = this;

      self.state.refreshing = true;
      self.setState(self.state);

      globals.flightApi.getFlights(this.state.direction, function (err, data) {
        self.setState({
          error: err,
          updated: (data) ? data.updated : null,
          flights: (data) ? data.flights : [],
          direction: self.state.direction,
          refreshing: false
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
        direction: FLIGHT_DIRECTIONS.arrivals,
        refreshing: true
      };
    },
    componentDidMount: function () {
      this.retrieveFlights();
    },
    render: function () {
      var body = (this.state.refreshing) ? <div className="progress">
                                              <div className="progress-bar progress-bar-striped active" role="progressbar" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100" style={{width: "100%"}}>
                                              </div>
                                            </div>
                                          : <FlightsList flights={this.state.flights} />;

      return (<div className="row">
                <FlightsHeader error={this.state.error}
                               updated={this.state.updated}
                               direction={this.state.direction}
                               onDirectionChange={this.handleDirectionChange}
                               onRefresh={this.retrieveFlights} />
                {body}
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
                      <span style={{color: 'red'}}>There was an issue retrieving flights</span>
                    : <span>last updated <strong>{globals.moment(this.props.updated).fromNow()}</strong></span>;
      var arrivals = (this.props.direction == FLIGHT_DIRECTIONS.arrivals) ?
                       <button type="button" disabled="disabled" className="btn btn-primary active" role="button">
                          <span className="glyphicon glyphicon-plane arrivals-icon"></span> Arrivals
                       </button>
                     : <button type="button" onClick={this.handleDirectionChange} className="btn btn-primary" role="button">
                          <span className="glyphicon glyphicon-plane arrivals-icon"></span> Arrivals
                       </button>;
      var departures = (this.props.direction == FLIGHT_DIRECTIONS.departures) ?
                       <button type="button" disabled="disabled" className="btn btn-primary active" role="button">
                          <span className="glyphicon glyphicon-plane departures-icon"></span> Departures
                       </button>
                     : <button type="button" onClick={this.handleDirectionChange} className="btn btn-primary" role="button">
                          <span className="glyphicon glyphicon-plane departures-icon"></span> Departures
                       </button>;

      return (<div className="row">
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
                {header}
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
                    <th>Airport</th>
                    <th>Scheduled</th>
                    <th>Status</th>
                  </thead>
                  <tbody>{flights}</tbody>
                </table>
              </div>);
    }
  });

  var Flight = React.createClass({
    render: function () {
      return (<tr>
                <td>{this.props.flight.id}</td>
                <td>{this.props.flight.airport.fullname}</td>
                <td><DateTimeFormatter date={this.props.flight.scheduled.local} format={'HH:mm:ss'} /></td>
                <td>{this.props.flight.status}</td>
              </tr>);
    }
  });

  var DateTimeFormatter = React.createClass({
    render: function () {
      var moment = globals.moment;

      return (<span>{moment(this.props.date).format(this.props.format)}</span>);
    }
  });

  React.render(<App/>, globals.document.getElementById('flights-container'));

}(window));
