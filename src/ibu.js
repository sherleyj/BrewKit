import React from 'react';


class Ibu extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            boilSizeGAL : 6.5,
            batchSizeGAL : 5,
            og : 5.25,
            totalIbu : 'Yay',
            hops : [
                {
                    ounces: null,
                    alphaAcid: null,
                    boilTime: null,
                    utilization: null,
                    ibus: null,
                    aau: null,
                }
            ],
        };
    // binding necessary to make "this" work in the callback
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleAddHopClick = this.handleAddHopClick.bind(this);
    this.handleHopChange = this.handleHopChange.bind(this);

}
    calcIbu() {
        
        this.setState({
            // aau : (this.state.hops[0].ounces && this.state.hops[0].alphaAcid) ? this.state.ounce *this.state.alphaAcid : null,
            totalIbu : 'IBU calculated!',
        });
        console.log("aau: ", this.state.hops[0].aau);
    }

    handleChange(event) {
        console.log("*********************");
        console.log("name: ", event.target.name);
        console.log("value: ", event.target.value);
        this.setState({
            [event.target.name] : event.target.value,
            // abv : (this.state.og - this.state.fg) * 131.25,
        });
        event.preventDefault();
        console.log("og: ", this.state.og);
        console.log("ibu: ", this.state.totalIbu);
    }

    handleSubmit(event) {
        this.calcIbu();
        event.preventDefault();

    }

    handleHopChange(event, i) {
        const hops = this.state.hops.slice();
        hops[i] = {
            [event.target.name] : event.target.value,
            aau : (this.state.ounces && this.state.alphaAcid) ? this.state.ounce *this.state.alphaAcid : null,
        }
        console.log('handleHopChange');
        this.setState({
            hops : hops
        });
        console.log("ounces: ", hops[i].ounces);
        console.log("alphaAcid: ", hops[i].alphaAcid);
        console.log("aau: ", hops[i].aau);
    }

    handleAddHopClick(event) {
        console.log('hopEvent');
        const newHop = 
        {
            ounces: null,
            alphaAcid: null,
            boilTime: null,
            utilization: null,
            ibus: null,
        }
        this.setState({
            hops : this.state.hops.concat(newHop),
        });
    }


    render() {
        const hops = this.state.hops;
        const hopsToRender = hops.map((hop, i) => {
            return ( 
            <div key={i}>
            <h6>Hop {i + 1}</h6>
            <label>Ounces:</label>
                <input 
                    type="text"
                    name="ounces" 
                    defaultValue={hop.ounces}
                    onChange={(event) => this.handleHopChange(event, i)}
                />
            <br></br>
            <label>% Alpha Acid:</label>
                <input 
                    type="text"
                    name="alphaAcid" 
                    defaultValue={hop.alphaAcid}
                    onChange={(event) => this.handleHopChange(event, i)}
                />
            <br></br>
            <label>Boil Time in Minutes:</label>
                <input 
                    type="text"
                    name="boilTime" 
                    defaultValue={hop.boilTime}
                    onChange={(event) => this.handleHopChange(event, i)}
                />
            <br></br>
            <label>Utilization:</label>
                <input 
                    type="text"
                    name="utilization" 
                    defaultValue={hop.utilization}
                    onChange={(event) => this.handleHopChange(event, i)}
                />
            <br></br>
            <label>ibu:</label>
                <input 
                    type="text"
                    name="ibu" 
                    defaultValue={hop.ibu}
                    onChange={(event) => this.handleHopChange(event, i)}
                />
            
            </div>
            );
        });

        return (
            <div className="flexItem ibu">
            <div className="flexItemInner">
            <h2>IBU Calculator</h2>
            <form id="ibuForm" onSubmit={this.handleSubmit}>
                <label>Boil Size in Gallons:</label>
                <input 
                    type="text"
                    name="boilSizeGal" 
                    defaultValue={this.state.boilSizeGal}
                    onChange={this.handleChange}
                />
                <br></br>
                <label>Batch Size in Gallons:</label>
                <input 
                    type="text"
                    name="batchSizeGAL" 
                    defaultValue={this.state.batchSizeGAL}
                    onChange={this.handleChange}
                />
                <br></br>
                <label>OG:</label>
                <input 
                    type="text"
                    name="og" 
                    defaultValue={this.state.fg}
                    onChange={this.handleChange}
                />
                <br></br>
                <input type="submit" value="submit"/>
                <br></br>
                <h5>HOPS:</h5>
                <div>{hopsToRender}</div>
                <button form_id="hopsForm" onClick={this.handleAddHopClick}>Add Hop</button>
            </form>
            <div>{this.state.totalIbu}</div>
            </div>
            </div>
        );
    }
} 

export default Ibu;
