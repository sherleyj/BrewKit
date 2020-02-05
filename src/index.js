import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Ibu from './ibu.js';
import Abv from './abv.js';
import Gravity from './gravity.js';
import PrimingSugar from './priming-sugar.js';


class Calc extends React.Component {
    render() {
        return (
            <div className="flexContainer">
                <Abv />
                <Ibu />
                <Gravity />
                <PrimingSugar />
            </div>
        );
    }

}

ReactDOM.render(<Calc />, document.getElementById('calc'));