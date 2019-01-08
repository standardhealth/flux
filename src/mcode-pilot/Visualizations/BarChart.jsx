import React, { Component } from 'react';
import PropTypes from 'prop-types';

import './BarChart.css';

export default class BarChart extends Component {
    // the bar is really just four divs placed next to each other
    // with varying widths and colors
    constructor(props) {
        super(props);

        this.state = {
            placeholder: {}
        };
    }

    getPercentage(data) {
        let total = 0;
        for (var key of Object.keys(data)) {
            total += data[key];
        }
        return total;
    }

    render() {
        const data = this.props.values;
        const total = this.getPercentage(data);
        const survived = data.survived/total*100;
        const cancerDead = data.cancerDeath/total*100;
        const otherDead = data.otherDeath/total*100;
        const oldPercent = this.props.compareTo.survived/this.getPercentage(this.props.compareTo)*100;
        const percentIncrease = survived - oldPercent;
        // avoid displaying ugly decimals 
        const roundedPercent = Math.round(survived)-Math.round(oldPercent);

        let mainStyle,changeStyle,deadStyle,textStyle,otherDeadStyle;
        if(percentIncrease<0){
            // style for when survival decreases (red)
            // dark grey part
            mainStyle={"width":`${survived}%`, "backgroundColor":"#9e9e9e"};
            // red or green part
            changeStyle = {"width":`${Math.abs(percentIncrease)}%`, "backgroundColor":"#d9534f"};
            // deal with edge case where %decrease greater than %cancer deaths
            // only really possible with a large amount of non-cancer related deaths
            const deathDecrease = cancerDead + percentIncrease;
            if(deathDecrease < 0) {
                // if the width goes negative it defaults, pushing
                // the other components down off the same line,
                // so we take space from "other_death" to make up the difference
                deadStyle = {"width":`${0}%`, "backgroundColor":"white"}
                otherDeadStyle = {"width":`${otherDead+deathDecrease}%`, "backgroundColor":"#d1d1d1"}
            }else{
                deadStyle = {"width":`${cancerDead+percentIncrease}%`, "backgroundColor":"white"}
                otherDeadStyle = {"width":`${otherDead}%`, "backgroundColor":"#d1d1d1"}
            }
            // color of text on the right
            textStyle = {"color":"#d9534f"};

        }else{
            // styles for when survival increases (green)
            mainStyle={"width":`${oldPercent}%`, "backgroundColor":"#9e9e9e"};
            changeStyle = {"width":`${percentIncrease}%`, "backgroundColor":"#5cb85c"}
            deadStyle = {"width":`${cancerDead}%`, "backgroundColor":"white"}
            otherDeadStyle = {"width":`${otherDead}%`, "backgroundColor":"#d1d1d1"}

            textStyle = {"color":"#5cb85c"}; // t-shirt
        }
        return (
            <div className="bar-chart">
                <div>
                    <p className="bar-chart-text">{Math.round(survived)}%</p>
                    {!this.props.active?
                        <p className="bar-chart-text right-text" style={roundedPercent!==0?textStyle:null}>
                        {/* makes the tiny arrow */}
                        <span className={roundedPercent!==0?(roundedPercent>0?"arrow-up":"arrow-down"):null}></span>
                        {Math.abs(roundedPercent)}%
                        </p>:null}
                    
                </div>
                <div className="prog-fill" style={mainStyle}></div>
                <div className="prog-fill" style={changeStyle}></div>
                <div className="prog-border" style={deadStyle}></div>
                <div className="prog-fill" style={otherDeadStyle}></div>
            </div>
        );
    }
}

BarChart.propTypes = {
    values: PropTypes.object.isRequired,
    compareTo: PropTypes.object
};
