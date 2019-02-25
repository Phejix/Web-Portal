import React from "react";
import AdwordsDialog from "./AdwordsDialog.jsx";
import UploadKeywordsDialog from "./UploadKeywordsDialog.jsx"

export default class KeywordToolbar extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            adwordsDialog : false,
            uploadsDialog : false
        };

        this.openAdwordsDialog = this.openAdwordsDialog.bind(this);
        this.closeAdwordsDialog = this.closeAdwordsDialog.bind(this);
        this.openUploadsDialog = this.openUploadsDialog.bind(this);
        this.closeUploadsDialog = this.closeUploadsDialog.bind(this);
    }

    openAdwordsDialog(){
        this.setState({
            adwordsDialog : true
        });
    }

    closeAdwordsDialog(){
        this.setState({
            adwordsDialog : false
        });
    }

    closeUploadsDialog(){
        this.setState({
            uploadsDialog : false
        });
    }

    openUploadsDialog(){
        this.setState({
            uploadsDialog : true
        });
    }

    render(){
        const adwordsDialog = this.state.adwordsDialog;
        const uploadsDialog = this.state.uploadsDialog;

        return(
            <div className="table-toolbar">
                <button onClick={this.openUploadsDialog}>Upload Keywords</button>
                {uploadsDialog && <UploadKeywordsDialog
                                    closeDialog={this.closeUploadsDialog}
                                    keywordData={this.props.keywordData}
                                    updateKeywords={this.props.updateKeywords}
                                    />
                }
                <button onClick={this.openAdwordsDialog}>Call Adwords</button>
                {adwordsDialog && <AdwordsDialog
                                    closeDialog={this.closeAdwordsDialog}
                                    keywordData={this.props.keywordData}
                                    settings={this.props.settings}
                                    />
                }
            </div>
        );
    }
}