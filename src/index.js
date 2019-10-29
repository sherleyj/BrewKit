import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Ibu from './ibu.js';
import Abv from './abv.js';


class Calc extends React.Component {
    render() {
        return (
            <div className="flexContainer">
                <Abv />
                <Ibu />
            </div>
        );
    }

}

ReactDOM.render(<Calc />, document.getElementById('calc'));