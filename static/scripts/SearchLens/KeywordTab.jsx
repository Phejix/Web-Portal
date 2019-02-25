import React from "react";
import DataTable from "../CommonComponents/DataTable/DataTable.jsx";
import Accordion from "../CommonComponents/Accordion/Accordion.jsx";
import KeywordSettings from "./KeywordSettings.jsx";
import KeywordToolbar from "./KeywordToolbar/KeywordToolbar.jsx";

export default class KeywordTab extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            keywordData : [],
            settings : undefined
        };

        this.settingsOptions = {};

        this.handleCellEdit = this.handleCellEdit.bind(this);
        this.onSettingsChange = this.onSettingsChange.bind(this);
        this.updateKeywords = this.updateKeywords.bind(this);
    }

    componentDidMount(){
        window.addEventListener("beforeunload", () => {this.saveState()})
        const apiConnection = window.location.origin + "/get_state" + window.location.pathname;
        fetch(apiConnection)
        .then(response => {return response.json()})
        .then(data => {
            this.settingsOptions = data.settingsOptions;
            this.setState({
                keywordData : data.keywordData,
                settings : data.settings
            });
        })
    }

    saveState(){
        const state = this.state;
        const serverStateConnection = window.location.origin + "/save_state";

        const postBody = {
            "appName" : 'SearchLens',
            'data' : state
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

    componentWillUnmount(){
        this.saveState();
        window.removeEventListener("beforeunload", () => {this.saveState()});
    }

    buildKeywordDataTable(keywordData){
        let dataRows = [];

        let cellRules = {
            all : {
                editable : true,
                tabbable : true,
                cellType : 'regular',
                handleEdit : this.handleCellEdit
            },
            cell : {
                'A0' : {
                    editable : false
                }
            }
        };

        let data = [];
        let headerData = {"Keywords" : "Keywords"}

        data.push(headerData);

        if (keywordData){
            for (let i = 0; i < keywordData.length; i++){
                let columnData = keywordData[i];

                data.push(columnData);
            }
        }

        let options = {
            autoGrid : true
        };

        return <DataTable data={data} cellRules={cellRules} options={options} tableID="keywords-table" />
    }

    handleCellEdit(cellRow, column, value){
        let keywordDataCopy = this.state.keywordData.slice();

        //Header row is 0 in the table so the rows will all be 1 greater than where they are in data list
        if (cellRow > 0){
            keywordDataCopy[cellRow - 1][column] = value;
            this.setState({
                keywordData : keywordDataCopy
            });
        }
        else{
            //Replace all keys (which are columns) in the data list
            let freshData = [];

            keywordDataCopy.map((row) => {
                let rowCopy = Object.assign({}, row);;
                rowCopy[value] = row[column];
                delete rowCopy[column];
                freshData.push(rowCopy);
            });

            this.setState({
                keywordData : freshData
            });
        }
    }

    //Creates a copy of the current state of settings, updates the copy with the new settings and then setsState with the copy
    onSettingsChange(key, value){
        let settingsCopy = Object.assign({}, this.state.settings);
        settingsCopy[key] = value;

        this.setState({
            settings : settingsCopy
        });
    }

    updateKeywords(uploadData){
        this.setState({
            keywordData : uploadData.keywordData
        });
    }

    render(){
        const settings = this.state.settings;
        const keywordData = this.state.keywordData;
        const dataTable = this.buildKeywordDataTable(keywordData);
        const settingsPanel = settings ? <KeywordSettings 
                                settings={settings} 
                                settingsOptions={this.settingsOptions}
                                onChange={this.onSettingsChange} 
                                /> : <div></div>;

        return(
            <div id='search-lens-keyword-tab'>
                <h2 className="application-title">Search Lens</h2>
                <div id="keywords-table">
                    <div id="keywords-toolbar">
                        <KeywordToolbar
                            keywordData={keywordData}
                            settings={settings}
                            updateKeywords={this.updateKeywords}
                        />
                    </div>
                    {dataTable}
                </div>

                <div className='settings-accordion'>
                    <Accordion title="Settings" panelHidden={true} animate={true} panel={settingsPanel} />
                </div>
            </div>
        );
    }
}