import React from "react";
import ReactDOM from "react-dom";
import axios from "axios";

import "./index.css";
import config from "./config";


if (typeof window !== "undefined") {
    window.React = React;
}

class Weather extends React.Component {
    constructor(props) {
        super(props);
        // This binding is necessary to make `this` work in the callback
        this.state = {weather: {}, isLoaded: false, hasError: false};
    }

    getWeatherAndUpdateState() {
        // this is not ideal :P
        var url = config.WEATHER_ENDPOINT+"?q="+this.props.city+"&mode=xml"+config.OPEN_WEATHER_MAP_APP_ID+"&apikey="+config.OPEN_WEATHER_MAP_API_KEY;
        axios.get(url)
            .then(res => {
                this.setState({isLoaded: true, weather: res.data.list, hasError: false});
            })
            .catch((e) => {
                this.setState({isLoaded: true, weather: {}, hasError: true});
            });
    }

    componentDidMount() {
        this.getWeatherAndUpdateState();
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.city !== this.props.city) {
            this.getWeatherAndUpdateState();
        }
    }

    
    render() {
        let dataList = [];
        let element = <div className="error"><span>Error : Not Found</span></div>;
        if (!this.state.hasError) {
            if (this.state.isLoaded) {
                dataList = this.state.weather;
            }
            
            element = (

                <ul className="weatherBlock">
                    {dataList.map((name, index)=>{
                    return <li key={ index }>
                        <ul className="forecastBlock">
                            <li>
                            <strong>Date: </strong>
                            <span>{name.dt_txt}</span>
                            </li>
                            <li>
                            <strong>Humidity: </strong>
                            <span>{name.main.humidity}</span>
                            </li>
                            <li>
                            <strong>Temperature: </strong>
                            <span>{name.main.temp} K</span>
                            </li>
                            <li>
                            <strong>Clouds: </strong>
                            <span>  {name.weather[0].description}</span>
                            </li>
                            <li>
                            <strong>Wind: </strong>
                            <span> {name.wind.speed}</span>
                            </li>
                            
                        </ul>
                    </li>;
                  })}
                
                </ul>

            );
        }

        return element;
    }
}

class EditableWeather extends React.Component {
    constructor(props) {
        super(props);
        this.state = {cityValue: "London", city: "London"};
        // This binding is necessary to make `this` work in the callback
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        this.setState({cityValue: event.target.value})
    }

    handleSubmit(event) {
        event.preventDefault();
        this.setState({city: this.state.cityValue});
    }

    render() {
        return (
            <div className="wrapperText">
                <div className="headingName">Weather Forecast</div>
                <div className="inlineBlock">
                    <span className="currentWather">Country/City Name: </span>
                    <form className="formText" onSubmit={this.handleSubmit}>
                        <input className="inputText" type="text" value={this.state.cityValue} onChange={this.handleChange}/>
                        <button className="button" type="submit">Update</button>
                    </form>
                </div>
                <div>
                    <Weather city={this.state.city}/>
                </div>
            </div>
        );
    }
}

function App(props) {
    return (
        <div>
            <EditableWeather city="London"/>
        </div>
    );
}

ReactDOM.render(
    <App />,
    document.getElementById('root')
);
