import React from "react";

export default class SearchLensResultsBar extends React.Component{
    /*
    props:
        keywordData : A list of dictionaries containing the rows which are used
                      to generate the keyword table in the results panel
    */
    constructor(props){
        super(props);

        this.onTextifyClick = this.onTextifyClick.bind(this);
        this.onDownload = this.onDownload.bind(this);
    }

    onTextifyClick(){
        const postConnection = window.location.origin + "/SearchLens/convert_keywords_to_textify";
        let postBody = {
            keywordData : this.props.keywordData
        }

        fetch(postConnection,
            {
                method : "POST",
                headers : {
                    "Content-Type" : "application/json; charset=utf-8"
                },
                body : JSON.stringify(postBody)
            })
        .then(response => {return response.json()})
        .then(data => {
            if (data.status === "success"){
                window.location.assign(window.location.origin + data.connection_url);
            }
            else{
                console.log(data);
            }
        });
    }


    onDownload(){
        const apiConnection = window.location.origin + "/SearchLens/download_keyword_data";

        fetch(apiConnection, {
            method : 'POST',
            headers : {
                "Content-Type" : "application/json; charset=utf-8"
            },
            body : JSON.stringify(this.props.keywordData)            
        });
        //Passes to the DownloadButton Component
    }

    render(){
        return(
            <div className="table-toolbar">
                <button onClick={this.onTextifyClick}>Open Textify</button>
                <button onClick={this.onDownload}>Download</button>
            </div>
        );
    }
}