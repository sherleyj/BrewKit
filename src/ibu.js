import React from 'react';
// import { thisTypeAnnotation } from '@babel/types';

// http://howtobrew.com/book/section-1/hops/hop-bittering-calculations
// IBU = AAU * U * 75 / Vrecipe


class Ibu extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            boilSizeGAL : 6.5,
            batchSizeGAL : 5,
            target_og : null,
            boil_gravity : null,
            totalIbu : 0,
            hops : [
                {
                    ounces: null,
                    alphaAcid: null,
                    boilTime: null,
                    utilization: 0,
                    ibus: 0,
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
        // const boil_gravity = this.state.boil_gravity;
        let utl = 0;
        // calculate and set state the boil_gravity
        console.log("boilSizeGAL: ", Math.floor(this.state.boilSizeGAL) + " ,batchSizeGAL: ", Math.floor(this.state.batchSizeGAL) + " ,target_og: ", this.state.target_og + " ,boil_gravity: ", this.state.boil_gravity + " ,hops[0]: ", this.state.hops[0].aau);
        
        // this.gravityAdjustByVolume(this.state.target_og, this.state.batchSizeGAL, this.state.boilSizeGAL);
        // this.setState({
        //     boil_gravity: boil_gravity,
        // });

        console.log("boil gravity: " + this.state.boil_gravity);
        const fG_starting = 1.65 * 0.000125**(this.state.boil_gravity - 1);
        const fG_target = 1.65 * 0.000125**(this.state.target_og - 1);
        const fG = (fG_target + fG_starting) / 2;

        const fT = (1 - Math.E**(-0.04 * hop.boilTime)) / 4.15;

        utl = Math.round(fG * fT * 1000)/1000;
        console.log("fG: " + fG + ", fT: " + fT + ", utilization: " + utl );

        return utl;
    }

    // calculates current gravity based on a known target gravity, target volume, and current volume.
    // https://www.wildabouthops.nz/how_to_adjust_specific_gravity.html
    gravityAdjustByVolume(target_gravity, target_vol, current_vol) {
        const tg_points = this.gravityPoints(target_gravity)
        const total_target_points = tg_points * target_vol
        const curr_gravity_points = Math.round(total_target_points / current_vol)
        console.log("<<In GRavityAdjust>>. target_og: ", this.state.target_og);

        console.log("new boil gravity points: " + curr_gravity_points)
        return (curr_gravity_points / 1000) + 1;
    }

    gravityPoints(gravity) {
        return (gravity * 1000) % 1000
    }

    calcIbu() {
        const hops = this.state.hops;
        
        let totalIbu = 0;
        for (let hop of hops) {
            totalIbu += hop.ibus;
        }
        
        this.setState({
            totalIbu : Math.round(totalIbu * 1000) / 1000,
        });
        console.log("totalIbu: ", this.state.totalIbu);
    }

    // In Javascript, when you create an object literal {} and you wrap the object’s key 
    // in array brackets [key] you can dynamically set that key.
    // https://medium.com/@bretdoucette/understanding-this-setstate-name-value-a5ef7b4ea2b4
    // TODO: Calculate and update boil_gravity
    handleIBUChange(event) {
        console.log("*************handleIBUChange*************");
        console.log("event target name: ", event.target.name);
        console.log("event target value: ", event.target.value);
        let boil_gravity = 0;
        if (event.target.name == 'batchSizeGAL') {
            boil_gravity = this.gravityAdjustByVolume(this.state.target_og, event.target.value, this.state.boilSizeGAL);
        } else if (event.target.name == 'boilSizeGal') {
            boil_gravity = this.gravityAdjustByVolume(this.state.target_og, this.state.batchSizeGAL, event.target.value);
        } else {
            boil_gravity = this.gravityAdjustByVolume(event.target.value, this.state.batchSizeGAL, this.state.boilSizeGAL);
        }

        this.setState({
            [event.target.name] : event.target.value,
            boil_gravity : boil_gravity,
        }, this.updateAllHops);

        // this.gravityAdjustByVolume(this.state.target_og, this.state.batchSizeGAL, this.state.boilSizeGAL);
        console.log("boilSizeGAL: ", Math.floor(this.state.boilSizeGAL) + " ,batchSizeGAL: ", Math.floor(this.state.batchSizeGAL) + " ,target_og: ", this.state.target_og + " ,boil_gravity: ", this.state.boil_gravity + " ,hops[0]: ", this.state.hops[0].aau);
    }

    updateHop(hop, i) {
        console.log("*** update hop ***");
        console.log("i: " + i + ". hop.ounces: " + hop.ounces + ", hop.alphaAcid: " + hop.alphaAcid
        + ", target_og: " + this.state.target_og);
        console.log(typeof(this) == 'undefined');
        if (hop.ounces && hop.alphaAcid && this.state.target_og && this.state.boil_gravity) {
            hop.aau = Math.round(hop.ounces * hop.alphaAcid * 1000) / 1000;
            hop.utilization = this.calc_utilization(hop);  
            hop.ibus = Math.round((hop.utilization * hop.aau * 75 * 1000)/this.state.batchSizeGAL) / 1000;
        }
        console.log("i: " + i + ". hop.aau: " + hop.aau + ", hop.utilization: " + hop.utilization);
    }

    handleSubmit(event) {
        let hops = this.state.hops;
        hops.forEach(this.updateHop);

        this.setState({
            hops: hops,
        });

        this.calcIbu();

        // passing in event when calling handleSubmit caused React
        // to queue up the setState in handleIBUChange.  Values were one step behind.
        event.preventDefault();
    }

    updateAllHops() {
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

        if (hop.ounces && hop.alphaAcid && this.state.target_og) {
            hop.aau = Math.round(hop.ounces * hop.alphaAcid * 1000) / 1000;
            hop.utilization = this.calc_utilization(hop);
            hop.ibus = Math.round((hop.utilization * hop.aau * 75 * 1000)/this.state.batchSizeGAL) / 1000;
        }
        hops[i] = hop;

        console.log('AFTER::: ');
        this.setState({
            hops : hops,
        });

        console.log("i: " + i + ", ounces: " + this.state.hops[i].ounces + ", alphaAcid: " + this.state.hops[i].alphaAcid + ", aau: " + this.state.hops[i].aau + ", utilization: " + this.state.hops[i].utilization + ", target og: " + this.state.target_og);
        // event.preventDefault();
    }

    handleAddHopClick(event) {
        console.log('hopEvent');
        const newHop = 
        {
            ounces: null,
            alphaAcid: null,
            boilTime: null,
            utilization: 0,
            ibus: 0,
            aau: null,
        }
        this.setState({
            hops : this.state.hops.concat(newHop),
        });
        event.preventDefault();
    }


    render() {
        const hops = this.state.hops;
        const hopsToRender = hops.map((hop, i) => {
            return ( 
            <div key={i} className="hop">
            {/* <div className="hop-title">{i + 1}</div> */}
            <div className="input-wrapper hop-ounces">
                <div className="inputLabel">Ounces:</div>
                    <input 
                        type="text"
                        name="ounces" 
                        defaultValue={hop.ounces}
                        onChange={(event) => this.handleHopChange(event, i)}
                    />
            </div>
            <div className="input-wrapper hop-alpha-acid">
                <div className="inputLabel">% Alpha Acid:</div>
                    <input 
                        type="text"
                        name="alphaAcid" 
                        defaultValue={hop.alphaAcid}
                        onChange={(event) => this.handleHopChange(event, i)}
                    />
            </div>
            <div className="input-wrapper hop-boil-time">
                <div className="inputLabel">Boil Time in Minutes:</div>
                    <input 
                        type="text"
                        name="boilTime" 
                        defaultValue={hop.boilTime}
                        onChange={(event) => this.handleHopChange(event, i)}
                    />
                </div>
            <div className="input-wrapper hop-utilization">
                <div className="inputLabel">Utilization:</div>
                <span>{this.state.hops[i].utilization}</span>
            </div>
            <div className="input-wrapper hop-ibu">
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
                    <div className="inputLabel">Target OG:</div>
                    <input 
                        type="text"
                        name="target_og" 
                        defaultValue={this.state.fg}
                        onChange={this.handleIBUChange}
                    />
                </div>
                <div className="total-ibu red">
                    <span>TOTAL IBUs:  </span>
                    {this.state.totalIbu}
                </div>
                <div className="red">
                    <span>Boil Gravity:  </span>
                    {this.state.boil_gravity}
                </div>
                {/* Removing Submit button.  I want to upate all values with onChange event. */}
                {/* <input type="submit" value="submit"/> */}
                

                <h5 className="hops-header">HOPS:</h5>
                <div className="hops-wrapper">
                    {hopsToRender}
                    <input type="submit" className="add-hop-btn" onClick={this.handleAddHopClick} value="Add Hop"/>
                    <input type="submit" value="Update Total IBUs" className="submit-btn"/> 
                </div>
                
            </form>
            </div>
            </div>
        );
    }
} 



export default Ibu;