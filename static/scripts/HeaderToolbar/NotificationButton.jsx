import React from "react";
import Message from "./Message.jsx";

/*
E-mail Icon made by 
<a href="https://www.flaticon.com/authors/sebastien-gabriel" title="Sebastien Gabriel">
    Sebastien Gabriel
</a> 
from 
<a href="https://www.flaticon.com/" title="Flaticon">
    www.flaticon.com
</a> 
is licensed by 
<a href="http://creativecommons.org/licenses/by/3.0/" title="Creative Commons BY 3.0" target="_blank">
    CC 3.0 BY
</a>
*/

export default class NotificationButton extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            showMessages : false,
            unreadMessages : 0,
            recentMessages : [],
            messageID : ""
        };

        this.onNotificationClick = this.onNotificationClick.bind(this);
        this.onMessageClick = this.onMessageClick.bind(this);
        this.changeMessageIcon = this.changeMessageIcon.bind(this);
    }

    componentDidMount(){
        this.checkMessageUpdates()

        //Checks every 15 seconds if any new messages have been added to the server
        this.messageTimer = setInterval(
            () => {this.checkMessageUpdates()}, 15000);
    }

    componentWillUnmount(){
        clearInterval(this.messageTimer);
    }

    onNotificationClick(){
        const showMessages = this.state.showMessages;
        const recentMessages = this.state.recentMessages;
        const setMessageRead = window.location.origin + "/MessageCentre/update_read_messages";

        this.setState({
            showMessages : !showMessages,
            unreadMessages : 0
            },
            () => {
                fetch("./MessageCentre/update_read_messages",{
                    method : "POST",
                    headers : {
                        "Content-Type" : "application/json; charset=utf-8"
                    },
                    body : JSON.stringify(recentMessages)
                })
            }
        );
    }

    onMessageClick(url_link){
        //API call which Sets the active capsule id if applicable
        //This should be a connection build to CapsuleViewer sending the "openCapsule" requirement
        const link = window.location.origin + url_link;
        window.location.assign(link);
    }

    checkMessageUpdates(){
        let apiMessageLocation = window.location.origin + "/MessageCentre/check_message_updates";
        fetch(apiMessageLocation)
        .then((response) => {
            return response.json()
        })
        .then((data) => {
            this.setState({
                unreadMessages : data.unread,
                recentMessages : data.recentMessages
            })
        });
    }

    changeMessageIcon(){
        this.setState({
            messageID : (this.state.messageID === "") ? "message-button-hover" : ""
        });
    }

    render(){
        const unreadMessages = this.state.unreadMessages;
        const showMessages = this.state.showMessages;
        const recentMessages = this.state.recentMessages.map((message) => {
                return <Message
                            messageObject={message}
                            key={message.id}
                            onClick={this.onMessageClick}
                        />
        });

        return (
            <div className="notification-button">
                <img
                    id="messages-button"
                    src="/static/images/Icons/mail-icon.svg"
                    alt="Messages"
                    onMouseEnter={this.changeMessageIcon}
                    onMouseLeave={this.changeMessageIcon}
                    onClick={this.onNotificationClick}
                />
                <div className="message-button-color-block" id={this.state.messageID}></div>
                {unreadMessages > 0 && 
                    <div id="unread-message-icon">
                        {unreadMessages}
                    </div>
                }
                {showMessages &&
                    <div className="notification-messages-panel">
                        <h3 className="message-panel-title">Messages</h3>
                        {recentMessages}
                    </div>
                }
            </div>
        );
    }
}