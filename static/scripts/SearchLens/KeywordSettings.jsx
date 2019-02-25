import React from "react";

export default class KeywordSettings extends React.Component{
    /*
    props:
        settings: Object consisting of the user's default settings.
            {language : 'x', location : 'y', networkSettings : 'z'}

        settingsOptions: Object containing all possible options to choose from
        onChange: Function which runs when a change event occurs (and state needs updating)
    */
    constructor(props){
        super(props);
        this.onLanguageChange = this.onLanguageChange.bind(this);
        this.onLocationChange = this.onLocationChange.bind(this);
        this.onNetworkChange = this.onNetworkChange.bind(this);
    }

    onLanguageChange(event){
        this.props.onChange(
            "language", 
            {
                "Name" : event.target.value,
                "ID" : event.target.name
            }
        );
    }

    onLocationChange(event){
        this.props.onChange(
            "location",
            {
                "Name" : event.target.value,
                "ID" : event.target.name
            }
        );
    }

    //Creates a copy of the network settings and then sends them to be updated
    onNetworkChange(event){
        let networkCopy = Object.assign({}, this.props.settings.networkSettings);
        let network = event.target.name;
        networkCopy[network] = !networkCopy[network];
        this.props.onChange("networkSettings", networkCopy);
    }

    orderNetworkSettings(){
        const networkOrder = ["Google Search", "Search Network", "Content Network", "Partner Search Network"];
        let networkCopy = {};

        for (let i = 0; i < networkOrder.length; i++){
            networkCopy[networkOrder[i]] = this.props.settings.networkSettings[networkOrder[i]];
        }

        return networkCopy
    }

    render(){
        const networkSettings = this.orderNetworkSettings();
        return(
            <div id='keyword-settings'>
                <div className='settings-block' id="location-settings">
                    <label>
                        Location: 
                        <DropDown
                            currentValue={this.props.settings.location}
                            options={this.props.settingsOptions.location}
                            onChange={this.onLocationChange}
                        />
                    </label>
                </div>

                <div className='settings-block' id="language-settings">
                    <label>
                        Language: 
                        <DropDown 
                            currentValue={this.props.settings.language}
                            options={this.props.settingsOptions.language}
                            onChange={this.onLanguageChange} 
                        />
                    </label>
                </div>
                
                <div className='settings-block' id="network-settings">
                    <label>
                        Network Settings: 
                        <NetworkSettings
                            networks={networkSettings}
                            onChange={this.onNetworkChange}
                        />
                    </label>
                </div>
            </div>
        );
    }
}

//This function needs to identify checked icons better
function NetworkSettings(props){
    return (
        Object.keys(props.networks).map((network) => {
            return(
                <label key={network}>
                    {network} 
                      <input 
                        type="checkbox"
                        name={network}
                        value={props.networks[network]}
                        checked={props.networks[network]}
                        onChange={props.onChange}
                    />
                </label>
            );
        })
    );
}

function DropDown(props){
    return(
        <select value={props.currentValue.Name} onChange={props.onChange}>
            {props.options.map((choice) => {
                    return (<option
                                key={choice.ID}
                                name={choice.ID}
                                value={choice.Name}>{choice.Name}
                            </option>)
                })
            }
        </select>
    );
}
