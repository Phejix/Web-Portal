import React from "react";
import DataTable from "../CommonComponents/DataTable/DataTable.jsx";
import SurveyBuilder from "./Surveys/SurveyBuilder.jsx";

export default class Surveysaur extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            surveyList : [],
            //This is actually a Survey (true is here only for testing purposes)
            editSurvey : true
        };
    }

    buildSurveyTable(surveyList){
        const headers = {
            "Name" : "Name",
            "Creation Date" : "Creation Date",
            "Check Responses" : "Check Responses",
            "Host" : "Host"
        };

        let data = [headers];

        for (let i = 0; i < surveyList.length; i++){
            data.push(surveyList[i]);
        }

        const options = {
            autoGrid : true
        };

        return <DataTable data={data} tableID="survey-table" options={options} />
    }

    render(){
        const surveyList = this.state.surveyList;
        const editSurvey = this.state.editSurvey;
        const surveyTable = this.buildSurveyTable(surveyList);
        return(
            <div id="surveysaur-panel">
                <h2 className="application-title">Surveysaur</h2>
                <div id="survey-table">
                    <span className="data-table-name">Surveys</span>
                    {surveyTable}
                    {editSurvey && <SurveyBuilder survey={editSurvey} displayOnly={false} questions={{}}/>}
                </div>
            </div>
        );
    }
}