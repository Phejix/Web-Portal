import React from "react";
import AccordionPanel from "./AccordionPanel.jsx"

export default class Accordion extends React.Component{
    /*
    An Accordion is a drop down item of text which can contain div elements.

    props:
        title: String. Text displayed on the accordion's label.
        animate: Whether the accordion should animate when opened
        panel: React Component which holds what is displayed
        hiddenPanel : Bool. Whether the panel is currently displayed.
    */
    constructor(props){
        super(props);
        this.state = {
            panelHidden : this.props.panelHidden
        };
        this.handleAccordionClick = this.handleAccordionClick.bind(this);
    }

    checkAnimate(){
        return (this.props.animate ? 'animated' : 'stationary')
    }

    handleAccordionClick(){
        const panelHidden = this.state.panelHidden;
        this.setState({
            panelHidden : !panelHidden
        });
    }

    render(){
        const accordionClass = this.checkAnimate() + "-accordion";
        const accordionButtonClass = accordionClass + "-button";
        const accordionPanelClass = accordionClass + "-panel";
        const panelHidden = this.state.panelHidden;

        return(
            <div className={accordionClass}>
                <button className={accordionButtonClass} onClick={this.handleAccordionClick}>{this.props.title}</button>
                <AccordionPanel hidden={panelHidden} panel={this.props.panel} accordionPanelClass={accordionPanelClass} />
            </div>
        );
    }
}