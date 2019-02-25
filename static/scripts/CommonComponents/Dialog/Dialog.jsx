import React from "react";

export default class Dialog extends React.Component{
    /*
        props:
            closeDialog: What to do when the dialog is closed.
            dialogPanel: React Component/HTML Elements which contain the main bulk of what the dialog does.
            dialogTitle: The title of the dialog

    */
    constructor(props){
        super(props);
    }

    render(){
        return(
            <div className="dialog-box">
                <div className="dialog-background" onClick={this.props.closeDialog}></div>
                <div className="dialog-contents">
                    <div className="dialog-title-box">
                        <p className="dialog-title">
                            {this.props.dialogTitle}
                        </p>
                    </div>
                    {this.props.dialogPanel}
                </div>
            </div>
        );
    }
}