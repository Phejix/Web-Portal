import React from "react";
import DataTable from "../CommonComponents/DataTable/DataTable.jsx";

export default class TextAnalysis extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            textData : []
        };
    }

    componentDidMount(){
        window.addEventListener("beforeunload", () => {this.saveState()});
        const uploadsUrl = window.location.origin + "/get_state" + window.location.pathname;

        fetch(uploadsUrl)
        .then(response => {return response.json()})
        .then(data => {
            this.setState({
                textData : data.TextAnalysis.textData
            })
        });
    }

    componentWillUnmount(){
        this.saveState();
        window.removeEventListener("beforeunload", () => {this.saveState()});
    }

    saveState(){
        const state = this.state;
        const serverStateConnection = window.location.origin + "/save_state";

        const postBody = {
            "appName" : "Textify",
            "data" : {
                'TextAnalysis' : state
            }
        };

        fetch(serverStateConnection, {
            method : "POST",
            headers : {
                "Content-Type" : "application/json; charset=utf-8"
            },
            body : JSON.stringify(postBody)            
        })
        .then(response => {return response.json()})
        .then(data => {
            if (data !== "success"){
                console.log(data);
            }
        });
    }

    buildTextTable(){
        const textData = this.state.textData;

        const cellRules = {
            all : {
                editable : true,
                tabbable : true,
                cellType : 'regular'
            },
            rows : {
                "0" : {
                    cellType : 'header'
                }
            },
            cell : {
                'A0' : {
                    editable : false,
                    tabbable : false
                }
            }
        };

        let headers = {
            "Text" : "Text"
        };

        let data = [headers];

        textData.map((textValue) => {
            data.push({
                "Text" : textValue
            })
        });

        const options = {
            autoGrid : true
        };

        return <DataTable data={data} cellRules={cellRules} tableID="text-table" options={options} />
    }

    render(){
        const textTable = this.buildTextTable();
        return(
            <div id="text-analysis-panel">
                <h4>Text Analysis</h4>
                {textTable}
            </div>
        );
    }
}