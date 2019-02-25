import React from "react";
import ReactDOMServer from "react-dom/server";

import Frame from "./Frame.jsx";
import DownloadButton from "../CommonComponents/Buttons/DownloadButton.jsx";

export default class DDCFrontpage extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            frames : 1,
            errorMessage : ""
        };

        this.getPostBody = this.getPostBody.bind(this);
        this.alterFrames = this.alterFrames.bind(this);
    }

    getPostBody(){
        const htmlObj = ReactDOMServer.renderToString(this.getFrames(this.state.frames));
        return {
            data :{
                body : {
                    html : htmlObj,
                    operation : 'overwrite'
                }
            }
        }
    }

    getFrames(framesNumber){
        let frames = [];

        for (let i = 0; i < framesNumber; i++){
            frames.push(<Frame key={i+1} frameID={i+1} />);
        }

        return frames
    }

    alterFrames(event){
        const number = event.target.value;

        if (!isNaN(number)){
            this.setState({
                frames : number
            });
        }
        else {
            this.setState({
                errorMessage : "Frames needs to be a positive number"
            });
        }
    }

    render(){
        const state = this.state;
        const apiLink = window.location.origin + "/ddc_templating/get_html";
        const file = {
            name : 'template',
            extension : ".html"
        };

        return (
            <div id="DDC-Templating">
                <h2 className="application-title">DDC Templating</h2>
                {state.errorMessage && <div className="error">{state.errorMessage}</div>}
                <label>Frames Required:</label>
                <input 
                    value={state.frames}
                    name="frame-count"
                    onChange={this.alterFrames}
                    type="number"
                    min="1"
                />

                <DownloadButton 
                    buttonName='Download'
                    apiLink={apiLink}
                    getPostBody={this.getPostBody}
                    file={file}
                    download
                >
                </DownloadButton>
            </div>
        );
    }
}

function TestComponent(props){
    return (
        <div>
            <p>Line1</p>
            <button>Test</button>
            <div><div>Hi</div></div>
        </div>
    );
}