import React from "react";

export default class AppHolder extends React.Component{
    /*---
    props:
        appList: A list of Objects containing the App's name, image link and url to link to
            e.g. [{image : "x.jpg", name : 'example', url : '/linktonewpage'}]

    ---------------------TODO: ADD DISPLAY BOX WHICH DESCRIBES THE APP, PERHAPS INCLUDES IMAGES-------------------
    ---*/
    constructor(props){
        super(props);
        this.state = {
            appList : []
        };

        this.onClick = this.onClick.bind(this);
    }

    componentDidMount(){
        const getAppList = window.location.origin + "/get_app_list";
        
        fetch(getAppList)
        .then((response) => {
            return response.json()
        })
        .then((data) => {
            this.setState({
                appList : data
            })
        });
    }

    onClick(url){
        const urlLink = window.location.origin + url;
        window.location.assign(urlLink);
    }

    render(){
        const appList = this.state.appList;
        return(
            <div className="app-panel">
                <h2 className="application-title">Apps</h2>
                <div className="app-holder">
                    {appList.map((app) => {
                        return <App
                                image={app.image}
                                name={app.name}
                                url={app.url}
                                key={app.name}
                                onClick={this.onClick}
                                />;
                    })}
                </div>
            </div>
        );
    }
}

class App extends React.Component{
    /*---
    props:
        image: The url of the image to display.
        name: The name of the App which will be displayed underneath the label
        onClick: Passed by AppHolder, the url to get when button is clicked
        url: String which provides the url to link to (not attached to the window's origin)
    ---*/
    constructor(props){
        super(props);

        this.onAppClick = this.onAppClick.bind(this);
    }

    onAppClick(){
        this.props.onClick(this.props.url);
    }

    render(){
        return(
            <div className="app" onClick={this.onAppClick}>
                <img src={this.props.image} alt={this.props.name} className="app-image"></img>
                <h5 className="app-name" id={this.props.name}>{this.props.name}</h5>
            </div>
        );
    }

}