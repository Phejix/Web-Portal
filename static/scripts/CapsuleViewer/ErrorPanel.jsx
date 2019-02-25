import React from "react";

export default class ErrorPanel extends React.Component{
    constructor(props){
        super(props)
    }

    render(){
        return(
            <div className="error-holder">
                <div className="error-type">
                    {this.props.job.results['Error Type']}
                </div>
                <div className="error-trace">
                    {this.props.job.results["Full Trace"]}
                </div>
            </div>
        );
    }
}