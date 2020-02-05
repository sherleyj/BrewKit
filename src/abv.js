import React from 'react';

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
    this.handleChange = this.handleChange.bind(this);

    }

    handleChange(event) {
        console.log("******* Handle IBU change ********");
        console.log("Before call to setState. name: ", event.target.name + ", value: ", event.target.value + ", formula: ", this.state.formula);
        this.setState({
            [event.target.name] : event.target.value,
        }, this.calculateAbv);
        console.log("After call to setState. og: ", this.state.og + ", fg :", this.state.fg + ", abv: ", this.state.abv + ", formula: ", this.state.formula);
        // commenting this out allowed for the change in radio button selection to be updated with just one click.
        // event.preventDefault();
    }


    calculateAbv(event) {
        let abv = 0;
        const og = this.state.og;
        const fg = this.state.fg;
        if (this.state.formula === 'std') {
            abv = Math.round((og - fg) * 131.25 *1000) / 1000;
        }
        else {
            abv = Math.round((76.08 * (og-fg) / (1.775-og)) * (fg / 0.794) * 1000) / 1000;
        }
        this.setState({
            abv : abv,
        });
        console.log("abv: ", this.state.abv);
    }


    render() {
        return (
            <div className="flexItem abv">
            <div className="flexItemInner">
            <h2>ABV Calculator</h2>
            <form>
                <div className="input-wrapper">
                    <div className="inputLabel">Equation:</div>
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
                </div>
                <div className="input-wrapper">
                    <div className="inputLabel">OG:</div>
                    <input 
                        type="text"
                        name="og" 
                        defaultValue={this.state.og}
                        onChange={this.handleChange}
                    />
                </div>
                <div className="input-wrapper">
                    <div className="inputLabel">FG:</div>
                    <input 
                        type="text"
                        name="fg" 
                        defaultValue={this.state.fg}
                        onChange={this.handleChange}
                    />
                </div>
                <br></br>
                {/* <input type="submit" value="submit" className="submit-btn"/> */}
            </form>
            <div className="abv-value">
                <span>ABV:  </span>
                {this.state.abv}
            </div>
            </div>
            </div>
        );
    }
} 


export default Abv;