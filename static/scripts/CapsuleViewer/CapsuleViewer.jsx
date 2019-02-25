import React from "react";
import DataTable from "../CommonComponents/DataTable/DataTable.jsx";
import Capsule from "./Capsule.jsx";

export default class CapsuleViewer extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            capsules : {},
            openCapsule : undefined
        };

        this.clickCapsule = this.clickCapsule.bind(this);
    }

    componentDidMount(){
        this.getCapsules();

        this.capsuleTimer = setInterval(
            () => {this.getCapsules()}, 15000);
    }

    componentWillUnmount(){
        clearInteval(this.capsuleTimer);
    }

    getCapsules(){
        /*
        ----------------TODO: ADD IN OPEN CAPSULE LOADING FOR WHEN CAPSULES ARE AUTO-OPENED (e.g. uploading data/clicking a Message)-------------------
        */
        const getCapsules = window.location.origin + "/CapsuleViewer/get_capsules";

        fetch(getCapsules)
        .then((response) => {
            return response.json()
        })
        .then((capsule_list) => {
            this.setState({
                capsules : capsule_list
            });
        });        
    }

    clickCapsule(event){
        const capsules = this.state.capsules;
        const capsuleID = event.target.value;
        this.setState({
            openCapsule : capsules[capsuleID]
        });
    }

    buildCapsuleTable(){
        const capsules = this.state.capsules;

        let header = {
            name : 'Name',
            status : 'Status',
            origin : 'Origin',
            recentJob : 'Most Recent Job',
            timeStarted : 'Time Started',
            totalJobs : 'Total Jobs',
            openCapsule : "Open Capsule"
        };
        
        let data = [header];
        let capsuleIDs = Object.keys(capsules);

        for (let i = 0; i < capsuleIDs.length; i++){
            let capsule = capsules[capsuleIDs[i]];

            let origin = capsule.most_recent_job.origin;
            let jobTime = new Date(0);
            jobTime.setUTCSeconds(capsule.most_recent_job.creation_date);

            let rowData = {
                name : capsule.name,
                status : capsule.status,
                origin : origin,
                recentJob : capsule.most_recent_job.method_name,
                timeStarted : jobTime.toString(),
                totalJobs : capsule.jobs.length.toString(),
                openCapsule : (capsule.status === "Ready") ? <button value={capsule.id} onClick={this.clickCapsule}>Open Capsule</button> : "In Transit"
            };

            data.push(rowData);
        }

        let options = {
            autoGrid : true
        }

        return <DataTable data={data} options={options} tableID="capsule-table" />
    }

    render(){
        const CapsuleTable = this.buildCapsuleTable();
        const openCapsule = this.state.openCapsule;

        return (
            <div className="capsule-viewer">
                <h2 className="application-title">Capsule Viewer</h2>
                {CapsuleTable}
                {openCapsule && <Capsule capsule={openCapsule} jobDisplayLimit={5} />}
            </div>
        );
    }
}