import React from "react";
import Dialog from "../../CommonComponents/Dialog/Dialog.jsx";

export default class AdwordsDialog extends React.Component{
    /*
        props:
            keywordData: Object. The Keywords data to send to the server.
            adwordsSettings: Object. The settings to send to the server.
            closeDialog: Function. What to do when this dialog is closed.
    */
    constructor(props){
        super(props);
        this.state = {
            capsuleName : "",
            searchSelection : "statistics"
        };

        this.updateCapsuleName = this.updateCapsuleName.bind(this);
        this.onRadioChange = this.onRadioChange.bind(this);
        this.sendAdwordsCall = this.sendAdwordsCall.bind(this);
    }

    buildDialogPanel(){
        const capsuleName = this.state.capsuleName;
        const searchSelection = this.state.searchSelection;

        return(
            <div id="adwords-dialog-panel">
                <label htmlFor="capsule-name-entry">Enter Capsule Name: </label>
                <input id="capsule-name-entry" type="text" value={capsuleName} name="capsule-name" autoComplete="off" onChange={this.updateCapsuleName} />

                <label htmlFor="search-choice-radio-holder">Choose Keywords Search Type: </label>
                <div id="search-choice-radio-holder" className="radio-holder">
                    <label className="radio-button-label">
                        <input type="radio" name="search-type" value="statistics" checked={searchSelection === "statistics"} onChange={this.onRadioChange} /> Statistics
                    </label>

                    <label className="radio-button-label">
                        <input type="radio" name="search-type" value="suggestions" checked={searchSelection === "suggestions"} onChange={this.onRadioChange} /> Suggestions
                    </label>
                </div>

                <div className="dialog-button-section">
                    <button id="send-adwords-call" onClick={this.sendAdwordsCall}>Submit Keywords</button>
                    <button className="cancel-button" onClick={this.props.closeDialog}>Cancel</button>
                </div>
            </div>
        );
    }

    updateCapsuleName(event){
        this.setState({
            capsuleName : event.target.value
        });
    }

    onRadioChange(event){
        this.setState({
            searchSelection : event.target.value
        });
    }

    sendAdwordsCall(){
        const capsuleName = this.state.capsuleName;
        const searchSelection = this.state.searchSelection;
        const callAdwords = window.location.origin + "/SearchLens/call_adwords";
        const CapsuleViewer = window.location.origin + "/CapsuleViewer";

        let postBody = {
            capsuleName : capsuleName,
            searchSelection : searchSelection,
            keywordData : this.props.keywordData,
            settings : this.props.settings
        };

        fetch(callAdwords,
            {
                method : "POST",
                headers : {
                    "Content-Type" : "application/json; charset=utf-8"
            },
            body : JSON.stringify(postBody)
        })
        .then((response) => { return response.json()})
        .then((data) => {
            if (data === "success"){
                this.props.closeDialog()
                window.location.assign(CapsuleViewer);
            }
            else{
                console.log(data);
            }
        });
    }

    render(){
        const dialogPanel = this.buildDialogPanel();

        return(
            <div id="adwords-dialog">
                <Dialog
                    closeDialog={this.props.closeDialog}
                    dialogPanel={dialogPanel}
                    dialogTitle="Call Adwords"
                />
            </div>
        );
    }
}