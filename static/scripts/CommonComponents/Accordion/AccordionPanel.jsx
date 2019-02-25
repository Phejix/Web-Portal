import React from "react";

export default class AccordionPanel extends React.Component{
    /*
    props:
        panel : React Component of what goes into the Panel.
        hidden : Bool. Whether the panel is displayed.
        accordionPanelClass : String. className of the panel
    */
    constructor(props){
        super(props);
    }

    handleToggle(){
        return (this.props.hidden ? "none" : "block")
    }

    render(){
        let panelStyle = {display : this.handleToggle()};
        return(
            <div className={this.props.accordionPanelClass} style={panelStyle}>{this.props.panel}</div>
        );
    }
}