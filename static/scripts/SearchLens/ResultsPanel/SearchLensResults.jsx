import React from "react";
import DataTable from "../../CommonComponents/DataTable/DataTable.jsx";
import SearchLensResultsBar from "./SearchLensResultsBar.jsx";

export default class SearchLens extends React.Component{
    /*
    props:
        method: String representing which of the App's methods were called.
                Can be ['Adwords Keyword Suggestions']
        job: The Job object which contains information about the job as well as the
        results.

    Results are in the form of an ordered dictionary list. The columns correspond to the order of the
    object key names.
    */
    constructor(props){
        super(props);

        this.state = {
            previewTable : {
                position : 0,
                direction : 'right' //can be 'left' or 'right' depending what was clicked
            }
        }
    }

    buildResultsTable(){
        let results = this.props.job.results;
        const maxRows = 10;
        const dataHeaders = Object.keys(results[0]);

        results = this.getResultsPreview(results, maxRows);

        let headers = {
            "Keywords" : "Keywords",
            "Google Categories" : "Google Categories",
            "Search Volume" : "Search Volume",
            "CPC" : "CPC",
            "Competition" : "Competition",
            "Parent Keyword" : "Parent Keyword"
        };

        let dateKeys = [];

        //Searches for date keys which are likely to be out of order
        for (let i = 0; i < dataHeaders.length; i++){
            if(!headers.hasOwnProperty(dataHeaders[i])){
                if (dataHeaders[i].includes("/")){
                    dateKeys.push(dataHeaders[i]);
                }
                else{
                    headers[dataHeaders[i]] = dataHeaders[i]
                }
            }
        }

        let dates = this.orderDateKeys(dateKeys);

        //Adds the now ordered dates to the headers
        for (let i = 0; i < dates.length; i++){
            headers[dates[i]] = dates[i];
        }

        //Adds the headers and results to the data list
        let data = [headers];
        for (let i = 0; i < results.length; i++){
            data.push(results[i]);
        }

        const options = {
            autoGrid : true
        };

        return <DataTable data={data} tableID="search-lens-results-table" options={options} />
    }

    //dateKeys come as strings in the format "mm/yyyy"
    orderDateKeys(dateKeys){
        return (dateKeys.sort((a, b) => {
                a = a.split("/");
                b = b.split("/");
                return new Date(b[1], b[0], 1) - new Date(a[1], a[0], 1)
            })
        );
    }

    getResultsPreview(results, maxRows){
        let position = this.state.previewTable.position;
        const direction = this.state.previewTable.direction;

        if (direction === "left"){
            position -= maxRows;
        }

        if (direction === "right"){
            position += maxRows;
        }

        if (position < 0){
            position = 0;
        }

        if (position >= results.length){
            position -= maxRows; 
        }

        return results.slice(position, position + maxRows)
    }

    render(){
        const resultsTable = this.buildResultsTable();
        return(
            <div id="search-lens-results-panel" className="results-panel">
                <h4>Search Lens</h4>
                <SearchLensResultsBar keywordData={this.props.job.results} />
                {resultsTable}
            </div>
        );
    }
}