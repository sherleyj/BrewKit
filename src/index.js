import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Ibu from './ibu.js';



class Abv extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            og : 1.05,
            fg : 1.01,
            abv: 5.25,
            formula : "std",
        };
    // binding necessary to make "this" work in the callback
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);

}

    handleChange(event) {
        console.log("*********************");
        console.log("name: ", event.target.name);
        console.log("value: ", event.target.value);
        console.log("formula before: ", this.state.formula);
        this.setState({
            [event.target.name] : event.target.value,
        });
        console.log("og: ", this.state.og);
        console.log("fg :", this.state.fg);
        console.log("abv: ", this.state.abv);
        console.log("formula: ", this.state.formula);
        // event.preventDefault();
    }

    handleSubmit(event) {
        let abv = 0;
        const og = this.state.og;
        const fg = this.state.fg;
        if (this.state.formula === 'std') {
            abv = (og - fg) * 131.25;
        }
        else {
            abv = (76.08 * (og-fg) / (1.775-og)) * (fg / 0.794);
        }
        this.setState({
            abv : abv,
        });
        console.log("abv: ", this.state.abv);
        event.preventDefault();
    }


    render() {
        return (
            <div className="flexItem abv">
            <div className="flexItemInner">
            <h2>ABV Calculator</h2>
            <form onSubmit={this.handleSubmit}>
                <label>Equation:</label>
                <br></br>
                <input 
                    type="radio" 
                    name="formula"
                    value="std"
                    checked={this.state.formula === "std"}
                    onChange={this.handleChange}
                /> <span>Standard</span>
                <br></br>
                <input 
                    type="radio" 
                    name="formula"
                    value="alt"
                    checked={this.state.formula === "alt"}
                    onChange={this.handleChange}
                /> <span>Alternate (for high ABV)</span>
                <br></br><br></br>
                <label>OG:</label>
                <input 
                    type="text"
                    name="og" 
                    defaultValue={this.state.og}
                    onChange={this.handleChange}
                />
                <br></br>
                <label>FG:</label>
                <input 
                    type="text"
                    name="fg" 
                    defaultValue={this.state.fg}
                    onChange={this.handleChange}
                />
                <br></br>
                <input type="submit" value="submit"/>
                <br></br>
            </form>
            <div>{this.state.abv}</div>
            </div>
            </div>
        );
    }
} 


class Calc extends React.Component {
    render() {
        return (
            <div className="flexContaner">
                <Abv />
                <Ibu />
            </div>
        );
    }

}

ReactDOM.render(<Calc />, document.getElementById('abv'));