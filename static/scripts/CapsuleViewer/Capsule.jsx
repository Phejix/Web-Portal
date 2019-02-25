import React from "react";
import JobResults from "./JobResults.jsx";

export default class Capsule extends React.Component{
    /*
    props:
        jobDisplayjobDisplayLimit: How many job objects to display in the jobs scrollbar,
        capsule: Capsule Object.
        .   {jobs : []}
    */
    constructor(props){
        super(props);
        this.state = {
            currentJob : this.props.capsule.jobs[this.props.capsule.jobs.length - 1]
        };
    }

    buildJobButtonPanel(){
        const jobDisplayLimit = this.props.jobDisplayLimit;
        const jobs = this.props.capsule.jobs;
        const currentJob = this.state.currentJob;
        const currentIndex = jobs.findIndex((job) => {
            return job.id === currentJob.id
        });

        let max = Math.ceil((currentIndex + 1)/jobDisplayLimit)*jobDisplayLimit;
        let min = max - jobDisplayLimit;

        let jobScrollBar = [];

        if (min !== 0){
            //Include Double and single left arrow
            jobScrollBar.push(
                <button className="capsule-arrow-button">DBL Left</button>,
                <button className="capsule-arrow-button">Sgl Left</button>
            );
        }

        if (max >= jobs.length){
            max = jobs.length;
        }

        //Includes the main job display buttons
        for (let i = min; i < max; i++){
            jobScrollBar.push(
                <button key={jobs[i].id} name={i + 1} value={jobs[i].id} className="capsule-job-selector">
                    {i + 1}
                </button>
            );
        }

        //Includes Right single and double arrow.
        if (max < jobs.length){
            jobScrollBar.push(
                <button className="capsule-arrow-button">Sgl Right</button>,
                <button className="capsule-arrow-button">DBL Right</button>
            );
        }

        return jobScrollBar
    }

    render(){
        const currentJob = this.state.currentJob;
        const jobBar = this.buildJobButtonPanel();

        return(
            <div className="capsule-display">
                <h5 id="job-selector-title">Job Selector</h5>
                <div className="job-selector-bar">
                    {jobBar}
                </div>
                <JobResults job={currentJob} />
            </div>
        );
    }
}