import React from "react";
import NotificationButton from "./NotificationButton.jsx";

export default class HeaderToolbar extends React.Component{

    render(){
        return (
            <div className="notification-buttons"><NotificationButton /></div>
        );
    }
}