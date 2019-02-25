import React from "react";
import ErrorPanel from "./ErrorPanel.jsx";
import SearchLensResults from "../SearchLens/ResultsPanel/SearchLensResults.jsx";

export default class JobResults extends React.Component{
    /*
    props:
        job. An Object containing details about the job.
        jobPanel. A react component which renders the panel.

    this.reference : An object containing string keys which contain the panel
    that should be rendered depending on the job type. The object has an app's origin
    as it's key and the function name within that nested object.
        e.g. 'Search Lens' : {'Adwords Keyword Suggestion' : <SearchLens props />}
    */
    constructor(props){
        super(props);
        this.reference = {
            'Search Lens' :  SearchLensResults
        }
    }

    render(){
        if (this.props.job.results.hasOwnProperty('Error Type')){
            return (
                <div className="error-panel">
                    <ErrorPanel job={this.props.job} />
                </div>
            );
        }
        let jobPanel = React.createElement(
                            this.reference[this.props.job.origin],
                            {
                                method : this.props.job.method_name,
                                job : this.props.job
                            },
                            null
                        );
        return(
            <div className="job-display-panel">
                {jobPanel}
            </div>
        );
    }
}