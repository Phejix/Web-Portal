import React from "react";

export default class Message extends React.Component{
    /*
    props:
        onClick: Method to run when the message is clicked.
        onHover: Method to run when the message is hovered over.
        messageObject: {
                id: String id,
                url_link: String of the link for when the message is clicked,
                message: String of the message,
                status: "unread" or "read"
        }
    */
    constructor(props){
        super(props);
        this.onClick = this.onClick.bind(this);
    }

    onClick(){
        this.props.onClick(this.props.messageObject.url_link);
    }

    render(){
        const messageClass = "notification-message";
        return (
            <div 
                className={messageClass}
                onClick={this.onClick}
            >
                {this.props.messageObject.message}
            </div>
        );
    }
}