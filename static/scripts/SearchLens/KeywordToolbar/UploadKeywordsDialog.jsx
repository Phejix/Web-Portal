import React from "react";
import Dialog from "../../CommonComponents/Dialog/Dialog.jsx";
import FileButton from "../../CommonComponents/Buttons/FileButton.jsx";

export default class UploadKeywordsDialog extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            fileUpload : {
                uploadSelection : "append",
                clearDuplicates : true,
                filename : "",
                folder : "uploads",
                shortName : ""
            },
            uploadsErrorMessage : "",
            successfulUpload : false,
            validFile : false
        };

        this.checkKeywords = this.checkKeywords.bind(this);
        this.onRadioChange = this.onRadioChange.bind(this);
        this.uploadKeywords = this.uploadKeywords.bind(this);
        this.onDuplicateChange = this.onDuplicateChange.bind(this);
    }

    //If a file was checked but the dialog was closed early the file will still exist on the server so this clears it
    componentWillUnmount(){
        const fileUpload = this.state.fileUpload;
        const successfulUpload = this.state.successfulUpload;
        const clearPathway = window.location.origin + "/clear_pathway";

        if (!successfulUpload){
            fetch(clearPathway,
                {
                    method : "POST",
                    headers : {
                        "Content-Type" : "application/json; charset=utf-8"
                    },
                    body : JSON.stringify({
                        folder : fileUpload.folder,
                        filename : fileUpload.filename
                    })
                })
            .then(
                this.setState({
                    fileUpload : this.resetFileUpload(),
                    uploadsErrorMessage : "",
                })
            );
        }
        else{
            this.setState({
                fileUpload : this.resetFileUpload(),
                uploadsErrorMessage : "",
                successfulUpload : false
            });
        }
    }

    buildUploadsPanel(){
        const errorMessage = this.state.errorMessage;
        const fileUpload = this.state.fileUpload;
        const fileInput = {id : 'upload-keywords-invisible', name : 'Upload CSV', accept : '.csv'};
        const fileButton = {id : 'upload-keywords-visible', name : 'Upload CSV'};

        return (
            <div id="upload-keywords-panel">
                {errorMessage && <div id="keywords-toolbar-error" className="upload-error">{errorMessage}</div>}
                
                <div id="upload-button-section">
                    <FileButton
                        onFileChange={this.checkKeywords}
                        fileInput={fileInput}
                        fileButton={fileButton}
                    />
                    {fileUpload.shortName && <p>{fileUpload.shortName}</p>}
                </div>

                <label htmlFor="upload-keywords-radio-holder">Choose How To Upload Keywords To Table: </label>
                <div id="upload-keywords-radio-holder" className="radio-holder">
                    <label className="radio-button-label">
                        <input type="radio" name="upload-type" value="append" checked={fileUpload.uploadSelection === "append"} onChange={this.onRadioChange} /> Append
                    </label>

                    <label className="radio-button-label">
                        <input type="radio" name="upload-type" value="overwrite" checked={fileUpload.uploadSelection === "overwrite"} onChange={this.onRadioChange} /> Overwrite
                    </label>
                </div>

                <label>
                    <input type="checkbox" name="clearDuplicates" value={fileUpload.clearDuplicates} checked={fileUpload.clearDuplicates} onChange={this.onDuplicateChange} />
                     Clear Upload Duplicates
                </label>

                <div className="dialog-button-selection">
                    <button id="submit-upload-keywords" onClick={this.uploadKeywords}>Submit</button>
                    <button className="cancel-button" onClick={this.props.closeDialog}>Cancel</button>
                </div>
            </div>
        );
    }

    checkKeywords(fileHolder){
        const formData = new FormData();
        formData.append('file', fileHolder.files[0]);
        const fileUpload = this.state.fileUpload;

        let fileCheckParameters = {
            allowed_extensions : ['csv'],
            required_headers : ['Keywords']
        };
        
        formData.append('file_check', JSON.stringify(fileCheckParameters));

        fetch("./smart_loader",
            {
                method : "POST",
                body : formData
            }
        ).then(
            response => { return response.json() }
        ).then(
            data => {
                if (data.responseType === "error"){
                    let uploadCopy = Object.assign({}, fileUpload);
                    uploadCopy.filename = data.data.filename;
                    uploadCopy.shortName = fileHolder.files[0].name;
                    this.setState({
                        uploadsErrorMessage : data.data.errorMessage,
                        fileUpload : uploadCopy,
                        validFile : false
                    });
                }
                else if (data.responseType === "ok"){
                    let uploadCopy = Object.assign({}, fileUpload);
                    uploadCopy.filename = data.data.filename;
                    uploadCopy.shortName = fileHolder.files[0].name;
                    this.setState({
                        uploadsErrorMessage : "",
                        fileUpload : uploadCopy,
                        validFile : true
                    });
                }
            }
        );
    }

    uploadKeywords(){
        const fileUpload = this.state.fileUpload;

        if (!this.state.validFile){
            this.setState({
                uploadsErrorMessage : "Invalid File Present, Cannot Upload"
            });
            return
        }
        if (!fileUpload.folder){
            this.setState({
                uploadsErrorMessage : "No File Present"
            });
            return
        }

        let postBody = {
            fileUpload : fileUpload,
            keywordData : this.props.keywordData
        };

        fetch("./SearchLens/upload_keywords", {
            method : "POST",
            headers : {
                "Content-Type" : "application/json; charset=utf-8"
            },
            body : JSON.stringify(postBody)
        }).then(
            response => { return response.json() }
        ).then(
            data => {
                this.props.updateKeywords(data);
                this.setState({
                    fileUpload : this.resetFileUpload(),
                    successfulUpload : true,
                }, 
                this.props.closeDialog);
            }
        );
    }

    onRadioChange(event){
        let uploadCopy = Object.assign({}, this.state.fileUpload);
        uploadCopy.uploadSelection = event.target.value;

        this.setState({
            fileUpload : uploadCopy
        });
    }

    onDuplicateChange(event){
        const fileUpload = this.state.fileUpload;
        let uploadCopy = Object.assign({}, fileUpload);
        uploadCopy.clearDuplicates = !fileUpload.clearDuplicates;

        this.setState({
            fileUpload : uploadCopy
        });
    }

    resetFileUpload(){
        return {
            uploadSelection : this.state.fileUpload.uploadSelection,
            filename : "",
            folder : "uploads",
            clearDuplicates : true,
            shortName : ""
        }
    }

    render(){
        const uploadsPanel = this.buildUploadsPanel();
        return(
            <div id="upload-keywords-dialog">
                <Dialog 
                    closeDialog={this.props.closeDialog}
                    dialogPanel={uploadsPanel}
                    dialogTitle="Upload Keywords"
                />
            </div>
        );
    }
}