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
        console.log("event target name: ", event.target.name);
        console.log("event target value: ", event.target.value);
        this.setState({
            [event.target.name] : event.target.value,
            // abv : (this.state.og - this.state.fg) * 131.25,
        });
        event.preventDefault();
        console.log("boilSizeGAL: ", this.state.boilSizeGAL);
        console.log("batchSizeGAL: ", this.state.batchSizeGAL);
        console.log("og: ", this.state.og);
        console.log("hops[0]: ", this.state.hops[0].aau);
    }

    handleSubmit(event) {
        this.calcIbu();
        event.preventDefault();

    }

    handleHopChange(event, i) {
        let hops = this.state.hops;
        let hop = hops[i];
        console.log('*****handleHopChange******');
        event.preventDefault();
        hop[event.target.name] = event.target.value;
        hop["aau"] = (hop.ounces && hop.alphaAcid) ? hop.ounce * hop.alphaAcid : null;
        hops[i] = hop;
        console.log('AFTER::: ');
        this.setState({
            hops : hops,
        });
        console.log("i: ", i);
        console.log("ounces: ", this.state.hops[i].ounces);
        console.log("alphaAcid: ", this.state.hops[i].alphaAcid);
        console.log("aau: ", this.state.hops[i].aau);
        event.preventDefault();
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
                    name="boilSizeGAL" 
                    defaultValue={this.state.boilSizeGAL}
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

function Utilization() {
    const utilization = {
       0: { 1.030: 0.00, 1.04: 0.00, 1.05: 0.00, 1.06: 0.00, 1.07: 0.00, 1.08: 0.00, 1.09: 0.00, 1.10: 0.00, 1.11: 0.00, 1.120: 0.00} ,
       5: { 1.030: 0.055, 1.04: 0.050, 1.05: 0.046, 1.06: 0.042, 1.07: 0.038, 1.08: 0.035, 1.09: 0.032, 1.10: 0.029, 1.11: 0.027, 1.120: 0.25} ,
       10: { 1.030: 0.100, 1.04: 0.91, 1.05: 0.84, 1.06: 0.76, 1.07: 0.070, 1.08: 0.064, 1.09: 0.058, 1.10: 0.053, 1.11: 0.049, 1.120: 0.045} ,
       15: { 1.030: 0.137, 1.04: 0.125, 1.05: 0.114, 1.06: 0.105, 1.07: 0.096, 1.08: 0.087, 1.09: 0.080, 1.10: 0.073, 1.11: 0.67, 1.120: 0.061} ,
       20: { 1.030: 0.167, 1.04: 0.153, 1.05: 0.140, 1.06: 0.128, 1.07: 0.117, 1.08: 0.107, 1.09: 0.098, 1.10: 0.089, 1.11: 0.81, 1.120: 0.074} ,
       25: { 1.030: 0.192, 1.04: 0.175, 1.05: 0.160, 1.06: 0.147, 1.07: 0.134, 1.08: 0.122, 1.09: 0.112, 1.10: 0.102, 1.11: 0.94, 1.120: 0.085} ,
       30: { 1.030: 0.212, 1.04: 0.194, 1.05: 0.177, 1.06: 0.162, 1.07: 0.148, 1.08: 0.135, 1.09: 0.124, 1.10: 0.113, 1.11: 0.103, 1.120: 0.094} ,
       35: { 1.030: 0.229, 1.04: 0.209, 1.05: 0.191, 1.06: 0.175, 1.07: 0.160, 1.08: 0.146, 1.09: 0.133, 1.10: 0.122, 1.11: 0.111, 1.120: 0.102} ,
       40: { 1.030: 0.242, 1.04: 0.221, 1.05: 0.202, 1.06: 0.185, 1.07: 0.169, 1.08: 0.155, 1.09: 0.141, 1.10: 0.129, 1.11: 0.118, 1.120: 0.108} ,
       45: { 1.030: 0.253, 1.04: 0.232, 1.05: 0.212, 1.06: 0.194, 1.07: 0.177, 1.08: 0.162, 1.09: 0.148, 1.10: 0.135, 1.11: 0.123, 1.120: 0.113} ,
       50: { 1.030: 0.263, 1.04: 0.240, 1.05: 0.219, 1.06: 0.200, 1.07: 0.183, 1.08: 0.168, 1.09: 0.153, 1.10: 0.140, 1.11: 0.128, 1.120: 0.117} ,
       55: { 1.030: 0.270, 1.04: 0.247, 1.05: 0.226, 1.06: 0.206, 1.07: 0.188, 1.08: 0.172, 1.09: 0.157, 1.10: 0.144, 1.11: 0.132, 1.120: 0.120} ,
       60: { 1.030: 0.276, 1.04: 0.252, 1.05: 0.231, 1.06: 0.211, 1.07: 0.193, 1.08: 0.176, 1.09: 0.161, 1.10: 0.147, 1.11: 0.135, 1.120: 0.123} ,
       65: { 1.030: 0.285, 1.04: 0.261, 1.05: 0.238, 1.06: 0.218, 1.07: 0.199, 1.08: 0.182, 1.09: 0.166, 1.10: 0.152, 1.11: 0.139, 1.120: 0.127} ,
       70: { 1.030: 0.291, 1.04: 0.266, 1.05: 0.243, 1.06: 0.222, 1.07: 0.203, 1.08: 0.186, 1.09: 0.170, 1.10: 0.155, 1.11: 0.142, 1.120: 0.130} ,
       75: { 1.030: 0.295, 1.04: 0.270, 1.05: 0.247, 1.06: 0.226, 1.07: 0.206, 1.08: 0.188, 1.09: 0.172, 1.10: 0.157, 1.11: 0.144, 1.120: 0.132} ,
       80: { 1.030: 0.298, 1.04: 0.272, 1.05: 0.249, 1.06: 0.228, 1.07: 0.208, 1.08: 0.190, 1.09: 0.174, 1.10: 0.159, 1.11: 0.145, 1.120: 0.133} ,
       85: { 1.030: 0.300, 1.04: 0.274, 1.05: 0.251, 1.06: 0.229, 1.07: 0.209, 1.08: 0.191, 1.09: 0.175, 1.10: 0.160, 1.11: 0.146, 1.120: 0.134} ,
       90: { 1.030: 0.301, 1.04: 0.275, 1.05: 0.252, 1.06: 0.230, 1.07: 0.210, 1.08: 0.192, 1.09: 0.176, 1.10: 0.161, 1.11: 0.147, 1.120: 0.134} ,

    }
}

export default Ibu;
