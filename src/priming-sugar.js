/* Residual Carbonation Level + Priming Carbonation Levels = Target Carbonation Level
Dissolved CO2 already present in beer from fermentation:
CO2 In Beer = 3.0378 - (0.050062 * temp) + (0.00026555 * temp^2)

For table sugar (no water in it, 100% sugar) use:

CF + .5 x S/VB = CB
    - CF is the level of CO2 in your flat brew (in grams/litre), known as volumes or “vols” in the Imperial system.
    - S is the amount of table sugar (in grams).
    - VB is the volume of your brew (in litres).
    - CB is the carbonation level of your finished beer (in litres), known as volumes or “vols” in the Imperial system. 

For sugar that is some percent water, multiple S * % that is not water. 
source: https://www.brewcabin.com/priming-sugar/

http://braukaiser.com/wiki/index.php/Accurately_Calculating_Sugar_Additions_for_Carbonation
Liters = Gal * 3.78541
(32°F − 32) × 5/9 = 0°C

Cbeer = Cflat-beer + 0.5 * 0.91 * mcorn-sugar / Vbeer
Cbeer - the final carbonation of the beer (g/l)
Cflat-beer - the CO2 content of the beer before bottling (g/l)
mcorn-sugar - the weight of the corn sugar (glucose monohydrate) (g)
Vbeer - beer volume (l)
.91 - the % sugar of the sugar used. in this case corn sugar which is 9% water.

*/

import React from 'react';

class PrimingSugar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            batchSizeLiters: 18.927,
            batchSizeGAL : 5.0,
            fermentationTempF : 75.0,
            fermentationTempC : 23.889,
            dissolvedCO2 : .777,
            desiredCO2 : 2.1,
            primingSugarTableSugarGrams : 100.515,
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleFermenationTempChange = this.handleFermenationTempChange.bind(this);
    };

    handleChange(event) {
        console.log("handle change on " + event.target.name);
       
        this.setState ({
            [event.target.name] : [event.target.value],
        }, this.calcAndSetPrimingSugar);
        
        console.log("desiredCO2: " + this.state.desiredCO2 + ", dissolvedCO2: " + this.state.dissolvedCO2 + ", batchSizeGal: " + this.state.batchSizeGAL + ", FermentationTemp: " + this.state.fermentationTemp);
    }

    handleFermenationTempChange(event) {
        var newTempF = event.target.value;
        var newTempC = (5/9) * (newTempF - 32);
        this.setState ({
            fermentationTempF : newTempF,
            fermentationTempC : newTempC,
            dissolvedCO2 : Math.round((3.0378 - (0.050062 * newTempF) + (0.00026555 * newTempF**2)) * 1000) / 1000,
        }, this.calcAndSetPrimingSugar);
    }

    calcAndSetPrimingSugar() {
        console.log("* In calcAndSetPrimingSugar... desiredCO2: " + this.state.desiredCO2 + ", dissolvedCO2: " + this.state.dissolvedCO2 + ", batchSizeGal: " + this.state.batchSizeGAL + ", FermentationTemp: " + this.state.fermentationTemp);
        // https://straighttothepint.com/priming-sugar-calculator/
        var primingSugarTableSugarGrams = Math.round(15.195 * (this.state.desiredCO2 - this.state.dissolvedCO2) * this.state.batchSizeGAL * 1000) / 1000;
        // var primingSugarTableSugarGrams = 2 * (this.state.desiredCO2 - this.state.dissolvedCO2) * (this.state.batchSizeGAL * 3.785);
        
        this.setState ({
            primingSugarTableSugarGrams : primingSugarTableSugarGrams,
        });

        console.log("primingSugarTableSugarGrams: " + ((this.state.desiredCO2 + this.state.dissolvedCO2)/0.5) * this.state.batchSizeGAL * 3.78541 );
// 5.754
    }

    render () {
        return (
            <div className="flexItem abv">
            <div className="flexItemInner">
                <h2>Priming Sugar Calculator</h2>
                <form id="primingSugarForm" onSubmit={this.handleSubmit}>
                    <div className="input-wrapper">
                        <div className="inputLabel">Fermentation Temperature (F):</div>
                        <input 
                            type="text"
                            name="fermentationTempF" 
                            defaultValue={this.state.fermentationTempF}
                            onChange={this.handleFermenationTempChange}
                        />
                    </div>
                    <div className="input-wrapper">
                        <div className="inputLabel">Batch Size in Gallons:</div>
                        <input 
                            type="text"
                            name="batchSizeGAL" 
                            defaultValue={this.state.batchSizeGAL}
                            onChange={this.handleChange}
                        />
                    </div>
                    <div className="input-wrapper">
                        <div className="inputLabel">Desired Volumes of CO2:</div>
                        <input 
                            type="text"
                            name="desiredCO2" 
                            defaultValue={this.state.desiredCO2}
                            onChange={this.handleChange}
                        />
                    </div>

                    <div className="total-ibu red">
                        <span>Dissolved CO2:  </span>
                        {this.state.dissolvedCO2}
                    </div>
                    <div className="total-ibu red">
                        <span>Table Sugar in Grams:  </span>
                        {this.state.primingSugarTableSugarGrams}
                    </div>
                </form>

            </div>
            </div>
        );
    }
}

export default PrimingSugar;