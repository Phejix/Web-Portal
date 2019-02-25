import React from "react";

export default class FileButton extends React.Component{
    /*
    Creates an invisible file input so that the FileButton can be styled to the user's choice

        props:
            onFileChange: Function to run when a file is selected.
            fileInput: Object regarding the properties of the hidden input.
                {
                    name: String. The invisible file input's name.
                    multiple: Boolean. Whether the multiple part of file input is selected.
                    accept: String. Comman-separated representing accepted file types
                }

            fileButton: Object regarding the properties of the displayed button.
                {
                    id: String. The visible file button id.
                    name: String. The name of the button
                }
    */
    constructor(props){
        super(props);
        this.onClick = this.onClick.bind(this);
        this.onFileChange = this.onFileChange.bind(this);

        this.FileInputRef = React.createRef();
    }

    onClick(){
        this.FileInputRef.current.click();
    }

    onFileChange(){
        this.props.onFileChange(this.FileInputRef.current);
    }

    render(){
        const accept = this.props.fileInput.accept ? this.props.fileInput.accept : undefined;

        return(
            <div className="file-button-wrapper">
                <input
                    type="file"
                    style={{display : 'none'}}
                    ref={this.FileInputRef}
                    name={this.props.fileInput.name}
                    onChange={this.onFileChange}
                    accept={accept}
                />
                <button
                    id={this.props.fileButton.ID}
                    name={this.props.fileButton.name}
                    className="file-button"
                    onClick={this.onClick}>
                    {this.props.fileButton.name}
                </button>
            </div>
        );
    }
}