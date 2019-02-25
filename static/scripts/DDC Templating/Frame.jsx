import React from "react";

export default class Frame extends React.Component{
    /*
    props:
        frameID: string.
    */
    constructor(props){
        super(props);
    }

    render(){
        const frameID = "frame-" + this.props.frameID;

        return(
            <div id={frameID} className="frame">
                <img id={frameID + "-background"} className="frame-background" src="" />
                <img id={frameID + "-logo"} className="frame-logo" src="" />
                <img id={frameID + "-img"} className="frame-img" src="" />
                <h1 id={frameID + "-headline"} className="frame-headline"></h1>
                <h3 id={frameID + "-subheadline"} className="frame-subheadline"></h3>
                <p id={frameID + "-copy"} className="frame-copy"></p>
                <button id={frameID + "-cta"} className="frame-cta">Book Now</button>
            </div>
        );
    }
}