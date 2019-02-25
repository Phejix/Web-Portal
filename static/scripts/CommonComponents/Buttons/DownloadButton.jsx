import React from "react";

export default class DownloadButton extends React.Component{
    /*
    props:
        apiLink: String for the url to send the data to,
        getPostBody: Function which returns an Object containing the post's body data,
        filename: The name of the file to be sent,
        buttonName: String.
    */
    constructor(props){
        super(props);
        this.state = {
            filename : ""
        }

        this.removeFileApi = window.location.origin + "/clear_pathway";
        this.downloadFileApi = window.location.origin + "/download_file";

        this.downloadForm = React.createRef();

        this.downloadData = this.downloadData.bind(this);
    }


    downloadData(){
        //Sends the data to provided link to be prepared for download
        const filename = this.getFileName();
        const postBody = this.props.getPostBody();

        postBody.filename = filename;

        fetch(this.props.apiLink, {
            method : 'POST',
            headers : {
                "Content-Type" : "application/json; charset=utf-8"
            },
            body : JSON.stringify(postBody)
        })
        .then(response => {
            this.setState({
                filename : filename
            }, () => {
                this.downloadForm.current.submit();
                let result = deleteFile(filename);

                if (result === false){
                    //do something cool
                }
            });
        });
    }


    checkFileDeletion(response){
        if (response["status"] === "Permission Denied"){
            return false
        }
        else {
            return true
        }
    }


    deleteFile(filename){
        let result = false;

        fetch(this.removeFileApi, {
            method : 'POST',
            headers : {
                "Content-Type" : "application/json; charset=utf-8"
            },
            body : JSON.stringify({
                folder : 'downloads',
                filename : filename
            })
        })
        .then((response) => {
            let result = checkFileDeletion(response);
        });
    }

    getCurrentDate(){
        let d = new Date();

        return (
            d.getDate() + 
            "-" + 
            (d.getMonth() + 1) +
            "-" +
            d.getFullYear() +
            " " +
            d.getHours() +
            "-" +
            d.getMinutes() +
            "-" +
            d.getSeconds()
        );
    }


    getFileName(){
        return this.props.file.name + " " + this.getCurrentDate() + this.props.file.extension
    }


    render() {
        return (
            <div id="download-wrapper">
                <button 
                    className='download-button'
                    onClick={this.downloadData}
                    download
                >
                    {this.props.buttonName}
                </button>
                <form
                    action={this.downloadFileApi}
                    style={{display : "none"}}
                    method="POST"
                    ref={this.downloadForm}
                >
                    <input
                        name="filename"
                        value={this.state.filename}
                        type="hidden"
                    />
                </form>
            </div>
        );
    }
}