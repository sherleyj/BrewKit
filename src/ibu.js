import React from 'react';

// http://howtobrew.com/book/section-1/hops/hop-bittering-calculations
// IBU = AAU * U * 75 / Vrecipe


class Ibu extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            boilSizeGAL : 6.5,
            batchSizeGAL : 5,
            og : null,
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
    this.handleIBUChange = this.handleIBUChange.bind(this);
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

    // In Javascript, when you create an object literal {} and you wrap the object’s key 
    // in array brackets [key] you can dynamically set that key.
    // https://medium.com/@bretdoucette/understanding-this-setstate-name-value-a5ef7b4ea2b4
    handleIBUChange(event) {
        event.preventDefault();
        console.log("*************handleIBUChange*************");
        console.log("event target name: ", event.target.name);
        console.log("event target value: ", event.target.value);

        this.setState({
            [event.target.name] : event.target.value,
        }, this.handleSubmit);

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
        console.log("i: " + i + ". hop.aau: " + hop.aau + ", hop.utilization: " + hop.utilization);
    }

    handleSubmit(event) {
        // event.preventDefault();

        let hops = this.state.hops;
        hops.forEach(this.updateHop);

        this.setState({
            hops: hops,
        });

        this.calcIbu();
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
        console.log("og: ", this.state.og);
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
            <div className="input-wrapper">
                <div className="inputLabel">Ounces:</div>
                    <input 
                        type="text"
                        name="ounces" 
                        defaultValue={hop.ounces}
                        onChange={(event) => this.handleHopChange(event, i)}
                    />
            </div>
            <div className="input-wrapper">
                <div className="inputLabel">% Alpha Acid:</div>
                    <input 
                        type="text"
                        name="alphaAcid" 
                        defaultValue={hop.alphaAcid}
                        onChange={(event) => this.handleHopChange(event, i)}
                    />
            </div>
            <div className="input-wrapper">
                <div className="inputLabel">Boil Time in Minutes:</div>
                    <input 
                        type="text"
                        name="boilTime" 
                        defaultValue={hop.boilTime}
                        onChange={(event) => this.handleHopChange(event, i)}
                    />
                </div>
            <div className="input-wrapper">
                <div className="inputLabel">Utilization:</div>
                <span>{this.state.hops[i].utilization}</span>
            </div>
            <div className="input-wrapper">
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
                <div className="input-wrapper">
                    <div className="inputLabel">Boil Size in Gallons:</div>
                    <input 
                        type="text"
                        name="boilSizeGAL" 
                        defaultValue={this.state.boilSizeGAL}
                        onChange={this.handleIBUChange}
                    />
                </div>
                <div className="input-wrapper">
                    <div className="inputLabel">Batch Size in Gallons:</div>
                    <input 
                        type="text"
                        name="batchSizeGAL" 
                        defaultValue={this.state.batchSizeGAL}
                        onChange={this.handleIBUChange}
                    />
                </div>
                <div className="input-wrapper">
                    <div className="inputLabel">OG:</div>
                    <input 
                        type="text"
                        name="og" 
                        defaultValue={this.state.fg}
                        onChange={this.handleIBUChange}
                    />
                </div>
                <input type="submit" value="submit"/>
                <br></br>

                <h5>HOPS:</h5>
                <div className="hops-wrapper">
                    {hopsToRender}
                    <div className="btn_total_container">
                        <input type="submit" className="add-hop-btn" onClick={this.handleAddHopClick} value="Add Hop"/>
                        <div className="total-ibu">
                            <div>Total Ibu</div>
                        {this.state.totalIbu}
                        </div>
                    </div>
                </div>

            </form>
            </div>
            </div>
        );
    }
} 



export default Ibu;
