import React from 'react';
import { BrowserRouter as Router, Switch, Link } from 'react-router-dom';
import PrivateRoute from '../route/router';
import Schema from "../configuration/single/schema";
import Ingest from "../configuration/single/ingest";
import Granularity from "../configuration/single/granularity";
import BulkIngest from "../configuration/single/bulkIngest";
import SourceConnector from "../configuration/single/sourceConnector";
import Typography from '@material-ui/core/Typography';
import axios from 'axios';

class Pipeline extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            pipelineName:this.props.location.state.pipelineId,
            features: [],
            granularities: []
        }
    }

    retriveData = (id) => {
        var data = {
            pipeline_names: [id]
        }
        axios.post('http://localhost:8080/getPipelineInfo', data)
            .then(function (response) {
                if (response.data.success) {
                    return response.data.data[id];
                }
                else {
                    return null;
                }
            }).then(featureData => {
                if(featureData != null) {
                    console.log(featureData)
                    var featurelist = []
                    var granularitylist = []
                    var features = featureData['features']
                    var granularityConfigs = featureData['granularityConfigs']
                    var granularities = featureData['granularities']
                    Object.keys(features).forEach(function (key, index) {
                        let obj = {
                            'featureName': key,
                            'attributes': features[key],
                            'spatialGranularity': granularityConfigs[key]['spatialGranularity'],
                            'temporalGranularity': granularityConfigs[key]['temporalGranularity'],
                            'targetSpatialGranularity': granularityConfigs[key]['targetSpatialGranularity'],
                            'targetTemporalGranularity': granularityConfigs[key]['targetTemporalGranularity'],
                            'mappingMethod': granularityConfigs[key],
                            'conversionFrequency': '24hrs',
                            'externalSource': 'http://localhost/3000/weatherdata'

                        }
                        featurelist.push(obj)
                    })
                    this.setState(prevState => ({features: featurelist}))
                    Object.keys(granularities).forEach(function (key, index) {
                        let obj = {
                            'granularityName': key,
                            'attributes': granularities[key],
                        }
                        granularitylist.push(obj)
                    })
                    this.setState(prevState => ({granularities: granularitylist}))
                } else {
                    this.setState(prevState => ({granularities: []}))
                }
            })
    }

    componentDidMount() {
        var id = this.props.location.state.pipelineId
        // this.setState({pipelineName:id},()=>{
        //     console.log(this.state.pipelineName)
        // })
        this.retriveData(id)

    }

    handleSubmit = (e) => {
        e.preventDefault()
    }

    handleChange = (event) => {
        this.setState({ age: event.target.value })
    }

    render() {
        let { features, granularities, pipelineName } = this.state
        let featureList = features.length > 0
            && features.map((val, i) => {
                return (
                    <option key={i} value={val.pipelineName}>{val.pipelineName}</option>
                )
            }, this);

        let featureInfoList = features.length > 0 &&
            features.map((feature, i) => {
                console.log(feature)
                return (
                    <tr key={i} >
                        <td><Typography style={{
                            fontSize: 10,
                            fontFamily: 'Courier New',
                            color: 'grey',
                            fontWeight: 'bolder'
                        }}>{feature['featureName']}</Typography></td>
                        <td>
                            <ul style={{ "listStyleType": "none", marginLeft: 0, marginTop: 0, padding: 0 }}>
                                {feature['attributes'].map(function (d, idx) {
                                    return (
                                        <li key={idx}>
                                            <Typography style={{
                                                fontSize: 10,
                                                fontFamily: 'Courier New',
                                                color: 'grey',
                                                fontWeight: 'bolder'
                                            }}>
                                                {d['attribute_name'] + ":" + d['attribute_type']}
                                            </Typography>
                                        </li>
                                    )
                                })}
                            </ul>
                        </td>
                        <td><Typography style={{
                            fontSize: 10,
                            fontFamily: 'Courier New',
                            color: 'grey',
                            fontWeight: 'bolder'
                        }}>{feature['spatialGranularity']}</Typography></td>
                        <td><Typography style={{
                            fontSize: 10,
                            fontFamily: 'Courier New',
                            color: 'grey',
                            fontWeight: 'bolder'
                        }}>{feature['temporalGranularity']}</Typography></td>
                        <td><Typography style={{
                            fontSize: 10,
                            fontFamily: 'Courier New',
                            color: 'grey',
                            fontWeight: 'bolder'
                        }}>{feature['targetSpatialGranularity']}</Typography></td>

                        <td><Typography style={{
                            fontSize: 10,
                            fontFamily: 'Courier New',
                            color: 'grey',
                            fontWeight: 'bolder'
                        }}>{feature['targetTemporalGranularity']}</Typography></td>
                        <td>
                            {feature['mappingMethod']['spatialRelationMappingMethod'] != null ? <div> <Typography style={{
                                fontSize: 10,
                                fontFamily: 'Courier New',
                                color: 'grey',
                                fontWeight: 'bolder'
                            }}> MethodName:{feature['mappingMethod']['spatialRelationMappingMethod']} </Typography>
                                {feature['mappingMethod']['spatialMappingArguments'] != null ?
                                    <div>
                                        <Typography style={{
                                            fontSize: 10,
                                            fontFamily: 'Courier New',
                                            color: 'grey',
                                            fontWeight: 'bolder',
                                            marginTop: 2
                                        }}>
                                            Mapping Arguments
                                        </Typography>
                                        <ul style={{ "listStyleType": "none", marginLeft: 0, padding: 0, marginTop: 0 }}>
                                            {Object.keys(feature['mappingMethod']['spatialMappingArguments']).map(function (arg, idx) {
                                                return (
                                                    <li key={idx}>
                                                        <Typography style={{
                                                            fontSize: 10,
                                                            fontFamily: 'Courier New',
                                                            color: 'grey',
                                                            fontWeight: 'bolder',
                                                            marginLeft: 4
                                                        }}>
                                                            {arg + ":" + feature['mappingMethod']['spatialMappingArguments'][arg]}
                                                        </Typography>
                                                    </li>
                                                )
                                            })} </ul> </div> : ""}
                            </div>
                                : ""}
                        </td>
                        <td> <Typography style={{
                            fontSize: 10,
                            fontFamily: 'Courier New',
                            color: 'grey',
                            fontWeight: 'bolder'
                        }}>{feature['mappingMethod']['temporalRelationMappingMethod']}</Typography></td>
                        <td><Typography style={{
                            fontSize: 10,
                            fontFamily: 'Courier New',
                            color: 'grey',
                            fontWeight: 'bolder'
                        }}>{feature['conversionFrequency']}</Typography></td>
                        <td><Typography style={{
                            fontSize: 10,
                            fontFamily: 'Courier New',
                            color: 'grey',
                            fontWeight: 'bolder'
                        }}>{feature['externalSource']}</Typography></td>
                    </tr>
                )
            }, this);

        let granularityInfoList = granularities.length > 0 &&
            granularities.map((granularity, i) => {
                return (
                    <tr key={i} >
                        <td><Typography style={{
                            fontSize: 10,
                            fontFamily: 'Courier New',
                            color: 'grey',
                            fontWeight: 'bolder'
                        }}>{granularity['granularityName']}</Typography></td>
                        <td>
                            <ul style={{ "listStyleType": "none", marginLeft: 0, marginTop: 0, padding: 0 }}>
                                {granularity['attributes'].map(function (d, idx) {
                                    return (
                                        <li key={idx}>
                                            <Typography style={{
                                                fontSize: 10,
                                                fontFamily: 'Courier New',
                                                color: 'grey',
                                                fontWeight: 'bolder'
                                            }}>
                                                {d['attribute_name'] + ":" + d['attribute_type']}
                                            </Typography>
                                        </li>
                                    )
                                })}
                            </ul>
                        </td>
                    </tr>
                )
            }, this);

        return (
            <div>
                <Typography style={{
                    fontSize: 12.5,
                    fontFamily: 'Courier New',
                    color: 'grey',
                    fontWeight: 'bolder',
                    marginBottom: 5
                }}> Feature Table</Typography>
                <table className="w3-table-all w3-col-50" style={{ marginBottom: 10 }}>
                    <thead>
                        <tr>
                            <th><Typography style={{
                                fontSize: 10,
                                fontFamily: 'Courier New',
                                color: 'grey',
                                fontWeight: 'bolder'
                            }}>Feature Name</Typography></th>
                            <th><Typography style={{
                                fontSize: 10,
                                fontFamily: 'Courier New',
                                color: 'grey',
                                fontWeight: 'bolder'
                            }}>Attributes</Typography></th>
                            <th><Typography style={{
                                fontSize: 10,
                                fontFamily: 'Courier New',
                                color: 'grey',
                                fontWeight: 'bolder'
                            }}>Spatial granularity</Typography></th>
                            <th><Typography style={{
                                fontSize: 10,
                                fontFamily: 'Courier New',
                                color: 'grey',
                                fontWeight: 'bolder'
                            }}>Temporal granularity</Typography></th>
                            <th><Typography style={{
                                fontSize: 10,
                                fontFamily: 'Courier New',
                                color: 'grey',
                                fontWeight: 'bolder'
                            }}>Target spatial granularity</Typography></th>
                            <th><Typography style={{
                                fontSize: 10,
                                fontFamily: 'Courier New',
                                color: 'grey',
                                fontWeight: 'bolder'
                            }}>Target temporal granularity</Typography></th>
                            <th><Typography style={{
                                fontSize: 10,
                                fontFamily: 'Courier New',
                                color: 'grey',
                                fontWeight: 'bolder'
                            }}>Spatial conversion</Typography></th>
                            <th><Typography style={{
                                fontSize: 10,
                                fontFamily: 'Courier New',
                                color: 'grey',
                                fontWeight: 'bolder'
                            }}>Temporal conversion</Typography></th>
                            <th><Typography style={{
                                fontSize: 10,
                                fontFamily: 'Courier New',
                                color: 'grey',
                                fontWeight: 'bolder'
                            }}>Conversion job frequency</Typography></th>
                            <th><Typography style={{
                                fontSize: 10,
                                fontFamily: 'Courier New',
                                color: 'grey',
                                fontWeight: 'bolder'
                            }}>External source confguration</Typography></th>
                        </tr>
                    </thead>
                    <tbody>
                        {featureInfoList}
                    </tbody>
                </table>
                <Typography style={{
                    fontSize: 12.5,
                    fontFamily: 'Courier New',
                    color: 'grey',
                    fontWeight: 'bolder',
                    marginBottom: 5
                }}> Granularity Table</Typography>
                <table className="w3-table-all w3-col-50">
                    <thead>
                        <tr>
                            <th><Typography style={{
                                fontSize: 10,
                                fontFamily: 'Courier New',
                                color: 'grey',
                                fontWeight: 'bolder'
                            }}>Granularity Name</Typography></th>
                            <th><Typography style={{
                                fontSize: 10,
                                fontFamily: 'Courier New',
                                color: 'grey',
                                fontWeight: 'bolder'
                            }}>Attributes</Typography></th>
                        </tr>
                    </thead>
                    <tbody>
                        {granularityInfoList}
                    </tbody>
                </table>
                <div style={{ marginTop: 20 }} className="w3-container w3-center">
                    <Router>
                        <Link to='/addGranular' ><button style={{ 'height': 30, 'padding': 8, 'marginRight': 5 }} className="w3-btn w3-blue w3-border  w3-round" >
                            <Typography style={{
                                fontSize: 12,
                                fontFamily: 'Courier New',
                                color: 'white',
                                fontWeight: 'bolder'
                            }}>Add New Granularity</Typography></button></Link>
                        <Link to="/addFeature"><button style={{ 'height': 30, 'padding': 8, 'marginRight': 5 }} className="w3-btn w3-blue w3-border  w3-round"> <Typography style={{
                            fontSize: 12,
                            fontFamily: 'Courier New',
                            color: 'white',
                            fontWeight: 'bolder'
                        }}>Add New Feature</Typography></button></Link>
                        <Link to="/addSource"><button style={{ 'height': 30, 'padding': 8, 'marginRight': 5 }} className="w3-btn w3-blue w3-border  w3-round"><Typography style={{
                            fontSize: 12,
                            fontFamily: 'Courier New',
                            color: 'white',
                            fontWeight: 'bolder'
                        }}>Add New Source</Typography></button></Link>
                        <Link to="/addGranConfig"><button style={{ 'height': 30, 'padding': 8, 'marginRight': 5 }} className="w3-btn w3-blue w3-border  w3-round"><Typography style={{
                            fontSize: 12,
                            fontFamily: 'Courier New',
                            color: 'white',
                            fontWeight: 'bolder'
                        }}>Add New Granularity</Typography></button></Link>

                        <Link to="/addAggreConfig"><button style={{ 'height': 30, 'padding': 8, 'marginRight': 5 }} className="w3-btn w3-blue w3-border w3-round"> <Typography style={{
                            fontSize: 12,
                            fontFamily: 'Courier New',
                            color: 'white',
                            fontWeight: 'bolder'
                        }}>Bulk ingest</Typography></button></Link>
                        <Switch>
                            <PrivateRoute exact path="/addGranular"><Schema pipelineName={pipelineName}/></PrivateRoute>
                            <PrivateRoute exact path="/addFeature"><Ingest /></PrivateRoute>
                            <PrivateRoute exact path="/addSource"><SourceConnector /></PrivateRoute>
                            <PrivateRoute exact path="/addGranConfig"><Granularity /></PrivateRoute>
                            <PrivateRoute exact path="/addAggreConfig"><BulkIngest /></PrivateRoute>
                        </Switch>
                    </Router>
                </div>
            </div>
        )
    }
}

export default Pipeline;