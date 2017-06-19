// React imports
import React, { Component } from 'react';
// material-ui
import Paper from 'material-ui/Paper';
import Divider from 'material-ui/Divider';
import RaisedButton from 'material-ui/RaisedButton';
// Flexbox
import { Grid, Row, Col } from 'react-flexbox-grid';
// Libraries
import staging from '../lib/staging';
import lookup from '../lib/staging_lookup';
// Styling
import './StagingForm.css';

class StagingForm extends Component {
  constructor(props) {
      super(props);

      this.state = {
        tumorSizes: lookup.getTsForEdition(7),
        nodes: lookup.getNsForEdition(7),
        metastases: [
            {name: 'M0', description: 'No clinical or radiographic evidence of distant metastases'},
            {name: 'M1', description: 'Distant detectable metastases as determined by classic clinical and radiographic means and/or histologically proven larger than 0.2 mm'}
        ]
      };
  }

  _currentlySelected(item, i) {
    return (item === i ? true : false);
  }

  _handleTumorSizeClick = (e, i) => {
    e.preventDefault();
    // console.log("StagingForm._handleTumorSizeClick T=" + i);
    this.props.onStagingTUpdate(this.state.tumorSizes[i].name);
  }

  _handleNodeClick = (e, i) => {
    e.preventDefault();
    // console.log("StagingForm._handleNodeClick N=" + i);
    this.props.onStagingNUpdate(this.state.nodes[i].name);
  }

  _handleMetastasisClick = (e, i) => {
    e.preventDefault();
    // console.log("StagingForm._handleMetastasisClick M=" + i);
    this.props.onStagingMUpdate(this.state.metastases[i].name);
  }

  render() {
    // console.log("in render. t: " + this.props.t);
    return (
        <Paper className="panel-content trio">
            <h1>Current Staging</h1>
            <Divider className="divider" />
            
            <h4>Tumor Size</h4>
            {this.state.tumorSizes.map((t, i) => {
                return (
                    <RaisedButton
                        className="btn tumor-size"
                        key={i}
                        label={t}
                        onClick={(e) => this._handleTumorSizeClick(e, i)}
                        disabled={this._currentlySelected(this.props.tumorSize, this.state.tumorSizes[i])}
                    />
                );
            })}

            <h4>Node</h4>
            {this.state.nodes.map((n, i) => {
                return (
                    <RaisedButton
                        className="btn node"
                        key={i}
                        label={n}
                        onClick={(e) => this._handleNodeClick(e, i)}
                        disabled={this._currentlySelected(this.props.nodeSize, this.state.nodes[i])}
                    />
                );
            })}

            <h4>Metastasis</h4>
            {this.state.metastases.map((m, i) => {
                return (
                    <RaisedButton
                        className="btn metastasis"
                        key={i}
                        label={m}
                        onClick={(e) => this._handleMetastasisClick(e, i)}
                        disabled={this._currentlySelected(this.props.metastasis, this.state.metastases[i])}
                    />);
            })}

            <h4>Prognostic Stage</h4>
            <div className="stage">{staging.breastCancerPrognosticStage(this.props.tumorSize, this.props.nodeSize, this.props.metastasis) || 'Undefined'}</div>
        </Paper>
    );
  }
}

export default StagingForm;
