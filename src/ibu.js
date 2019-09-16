import React from 'react';

// http://howtobrew.com/book/section-1/hops/hop-bittering-calculations
// IBU = AAU * U * 75 / Vrecipe


class Ibu extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            boilSizeGAL : 6.5,
            batchSizeGAL : 5,
            og : 5.25,
            totalIbu : 0,
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
    this.updateHop = this.updateHop.bind(this);

    }

    // Utilization = f(G) x f(T) where: 
    // f(G) = 1.65 x 0.000125^(Gb - 1) 
    // f(T) = [1 - e^(-0.04 x T)] / 4.15
    calc_utilization(hop) {
        console.log("***Utilization***");
        const og = this.state.og;
        let utl = 0;
        const fG = 1.65 * 0.000125**(og - 1);
        const fT = (1 - Math.E**(-0.04 * hop.boilTime)) / 4.15;
 
        utl = Math.round(fG * fT * 1000)/1000;
        console.log("fG: " + fG + ", fT: " + fT + ", utilization: " + utl );

        return utl;
    }

    calcIbu() {
        const hops = this.state.hops;
        
        let totalIbu = 0;
        for (let hop of hops) {
            totalIbu += hop.ibus;
        }

        this.setState({
            totalIbu : totalIbu,
        });
        console.log("totalIbu: ", this.state.totalIbu);
    }

    handleChange(event) {
        console.log("event target name: ", event.target.name);
        console.log("event target value: ", event.target.value);

        let hops = this.state.hops;
        hops.forEach(this.updateHop);
        this.setState({
            [event.target.name] : event.target.value,
            hops : hops,
        });
        event.preventDefault();
        console.log("boilSizeGAL: ", Math.floor(this.state.boilSizeGAL));
        console.log("batchSizeGAL: ", Math.floor(this.state.batchSizeGAL));
        console.log("og: ", this.state.og);
        console.log("hops[0]: ", this.state.hops[0].aau);
    }

    updateHop(hop, i) {
        console.log("*** update hop ***");
        console.log("i: " + i + ". hop.ounces: " + hop.ounces + ", hop.alphaAcid: " + hop.alphaAcid);
        console.log(typeof(this) == 'undefined');
        if (hop.ounces && hop.alphaAcid) {
            hop.aau = Math.round(hop.ounces * hop.alphaAcid * 1000) / 1000;
            hop.utilization = this.calc_utilization(hop);  
            hop.ibus = Math.round((hop.utilization * hop.aau * 75 * 1000)/this.state.batchSizeGAL) / 1000;
        }
    }

    handleSubmit(event) {
        this.calcIbu();
        event.preventDefault();

    }

    handleHopChange(event, i) {
        let hops = this.state.hops;
        let hop = hops[i];
        console.log('*****handleHopChange******');
        hop[event.target.name] = event.target.value;
        console.log("ounces " + hop.ounces + ". Alpha Acid: " +  hop.alphaAcid);

        if (hop.ounces && hop.alphaAcid) {
            hop.aau = Math.round(hop.ounces * hop.alphaAcid * 1000) / 1000;
            hop.utilization = this.calc_utilization(hop);
            hop.ibus = Math.round((hop.utilization * hop.aau * 75 * 1000)/this.state.batchSizeGAL) / 1000;
        }
        hops[i] = hop;

        console.log('AFTER::: ');
        this.setState({
            hops : hops,
        });
        console.log("i: ", i);
        console.log("ounces: ", this.state.hops[i].ounces);
        console.log("alphaAcid: ", this.state.hops[i].alphaAcid);
        console.log("aau: ", this.state.hops[i].aau);
        console.log("utilization: ", this.state.hops[i].utilization);
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
            <div key={i} className="hop">
            <div>Hop {i + 1}</div>
            <div>
                <div className="inputLabel">Ounces:</div>
                    <input 
                        type="text"
                        name="ounces" 
                        defaultValue={hop.ounces}
                        onChange={(event) => this.handleHopChange(event, i)}
                    />
            </div>
            <div>
                <div className="inputLabel">% Alpha Acid:</div>
                    <input 
                        type="text"
                        name="alphaAcid" 
                        defaultValue={hop.alphaAcid}
                        onChange={(event) => this.handleHopChange(event, i)}
                    />
            </div>
            <div>
                <div className="inputLabel">Boil Time in Minutes:</div>
                    <input 
                        type="text"
                        name="boilTime" 
                        defaultValue={hop.boilTime}
                        onChange={(event) => this.handleHopChange(event, i)}
                    />
                </div>
            <div>
                <div className="inputLabel">Utilization:</div>
                <span>{this.state.hops[i].utilization}</span>
            </div>
            <div>
                <div className="inputLabel">ibus:</div>
                <span>{this.state.hops[i].ibus}</span>
            </div>
            </div>
            );
        });

        return (
            <div className="flexItem ibu">
            <div className="flexItemInner">
            <h2>IBU Calculator</h2>
            <form id="ibuForm" onSubmit={this.handleSubmit}>
                <div>
                    <div className="inputLabel">Boil Size in Gallons:</div>
                    <input 
                        type="text"
                        name="boilSizeGAL" 
                        defaultValue={this.state.boilSizeGAL}
                        onChange={this.handleChange}
                    />
                </div>
                <div>
                    <div className="inputLabel">Batch Size in Gallons:</div>
                    <input 
                        type="text"
                        name="batchSizeGAL" 
                        defaultValue={this.state.batchSizeGAL}
                        onChange={this.handleChange}
                    />
                </div>
                <div>
                    <div className="inputLabel">OG:</div>
                    <input 
                        type="text"
                        name="og" 
                        defaultValue={this.state.fg}
                        onChange={this.handleChange}
                    />
                </div>
                <input type="submit" value="submit"/>
                <br></br>

                <h5>HOPS:</h5>
                <div>{hopsToRender}</div>
                <input type="submit" form_id="hopsForm" onClick={this.handleAddHopClick} value="Add Hop"/>

            </form>
            <div className="totalIbu">{this.state.totalIbu}</div>
            </div>
            </div>
        );
    }
} 



export default Ibu;
