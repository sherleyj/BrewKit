import React from 'react';

// The Equation Used
// ASG=MSG*((1.00130346-0.000134722124*ST+0.00000204052596*ST^2-0.00000000232820948*ST^3)/(1.00130346-0.000134722124*HTC+0.00000204052596*HTC^2-0.00000000232820948*HTC^3))

// Where:
// MSG: Measured Specific Gravity
// ST: Sample Temperature
// HCT: Hydrometer Calibration Temperature
// ASG: Adjusted Specific Gravity

class Gravity extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            measured_gravity : 1.056,
            temp : 80,
            hydrometer_calibration : 60,
            corrected_gravity : 1.0585,
        }

        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(event) {
        this.setState({
            [event.target.name] : event.target.value,
        }, this.calcGravityAdjust);
        event.preventDefault();
    }

    calcGravityAdjust() {
        const corrected_gravity = this.state.measured_gravity*((1.00130346-0.000134722124*this.state.temp+0.00000204052596*Math.pow(this.state.temp,2)-0.00000000232820948* Math.pow(this.state.temp,3))/(1.00130346-0.000134722124*this.state.hydrometer_calibration+0.00000204052596* Math.pow(this.state.hydrometer_calibration,2)-0.00000000232820948*Math.pow(this.state.hydrometer_calibration,3)))

        this.setState({
            corrected_gravity : Math.round(corrected_gravity * 10000) / 10000,
        });

    }


    render() {

        return (
            <div className="flexItem">
                <div className="flexItemInner">
                    <h2>Gravity Adjust by Temperature</h2>
                    <form onSubmit={this.handleSubmit}>
                        <div className="input-wrapper">
                        <div className="inputLabel">Measured Gravity:</div>
                            <input 
                                type="text"
                                name="measured_gravity" 
                                defaultValue={this.state.measured_gravity}
                                onChange={this.handleChange}
                            />
                        </div>
                        <div className="input-wrapper">
                        <div className="inputLabel">Temperature:</div>
                            <input 
                                type="text"
                                name="temp" 
                                defaultValue={this.state.temp}
                                onChange={this.handleChange}
                            />
                        </div>
                        <div className="input-wrapper">
                        <div className="inputLabel">Hydrometer Calibration:</div>
                            <input 
                                type="text"
                                name="hydrometer_calibration" 
                                defaultValue={this.state.hydrometer_calibration}
                                onChange={this.handleChange}
                            />
                        </div>
                        <br></br>
                        {/* <input type="submit" value="Submit" className="submit-btn"/>  */}
                    </form>
                    <div className="abv-value">
                        <span>Corrected Gravity:  </span>
                        {this.state.corrected_gravity}
                    </div>
                </div>
            </div>
        );
    }

}

export default Gravity;