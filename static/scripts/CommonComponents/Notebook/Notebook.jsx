import React from "react";

export default class Notebook extends React.Component{
    /*
    props:
        tabs : Object. Example Below.
            {
                tabName : tabPanel - The React/HTML object to be rendered.
            }  

    */
    constructor(props){
        super(props);
        this.state = {
            activeTab : this.props.activeTab
        };

        this.changeTab = this.changeTab.bind(this);
    }

    changeTab(event){
        this.setState({
            activeTab : event.target.value
        });
    }

    buildNotebook(){
        const activeTab = this.state.activeTab;
        const tabs = Object.keys(this.props.tabs).map((tabName) => {

            let activeID = (tabName === activeTab) ? "active-notebook-tab" : "unactive-notebook-tab";
            return(
                <div id={activeID} className="notebook-tab" key={tabName}>
                    <button id={tabName + "-tab-button"} className="notebook-tab-button" onClick={this.changeTab} name={tabName} value={tabName}>{tabName}</button>
                </div>
            );
        });

        return (
            <div className="notebook-wrapper">
                <div className="notebook-tab-section">
                    {tabs}
                </div>
                <div className="notebook-panel">
                    {this.props.tabs[activeTab]}
                </div>
            </div>
        );
    }

    render(){
        const notebook = this.buildNotebook();
        return (
            <div className="notebook">{notebook}</div>
        );
    }
}