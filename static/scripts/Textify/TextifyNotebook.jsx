import React from "react";
import Notebook from "../CommonComponents/Notebook/Notebook.jsx";
import TextAnalysis from "./TextAnalysis.jsx";

export default class TextifyNotebook extends React.Component{
    constructor(props){
        super(props);
    }

    buildTabs(){
        return ({
            "Text Analysis" : <TextAnalysis />,
            "Taxonomies" : <div>Taxonomies</div>

        });
    }

    render(){
        const tabs = this.buildTabs();
        return(
            <div id="textify">
                <h2 className="application-title">Textify</h2>
                <Notebook tabs={tabs} activeTab="Text Analysis" />
            </div>
        );
    }
}