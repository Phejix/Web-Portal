import React from "react";
import ResponsePanel from "./ResponsePanel.jsx";

export default class QuestionPanel extends React.Component{
    /*
    The QuestionPanel can't make the commit (as there are several). SurveyHost will need to wrap the panels
    and make the API connection.

    userEntry needs to be in SurveyBuilder 'questions' object. Everything can update the state there.

    props:
        displayOnly: Boolean.
        question. The question object to be viewed/edited.
            {
                title : ""
                responseOptions : {
                    See ResponsePanel for details on the responseOptions object
                }
            }
    */
    constructor(props){
        super(props);
        this.state = {
            editingTitle : false,
            editQuestionTitle : "",
        };

        this.onQuestionTitleClick = this.onQuestionTitleClick.bind(this);
        this.onEditQuestionTitle = this.onEditQuestionTitle.bind(this);
        this.submitQuestionEdit = this.submitQuestionEdit.bind(this);
        this.onEnterConfirm = this.onEnterConfirm.bind(this);
    }

    onQuestionTitleClick(event){
        this.setState({
            editingTitle : true,
            editQuestionTitle : this.props.question.title
        }, () => {
            document.getElementById("editing-question-title-" + this.props.questionID).focus();
        });
    }

    onEditQuestionTitle(event){
        this.setState({
            editQuestionTitle : event.target.value
        });
    }

    submitQuestionEdit(){
        this.props.editQuestion(
            this.props.questionID,
            "title",
            this.state.editQuestionTitle
        );
        this.setState({
            editingTitle : false
        });
    }

    onEnterConfirm(event){
        if (event.key === "Enter"){
            this.submitQuestionEdit()
        }
    }

    buildQuestionTitle(editingTitle){
        return (editingTitle ? <input
                            type="text"
                            id={"editing-question-title-" + this.props.questionID} 
                            className="editable-question-title"
                            value={this.state.editQuestionTitle}
                            onChange={this.onEditQuestionTitle}
                            onBlur={this.submitQuestionEdit}
                            onKeyDown={this.onEnterConfirm}
                        />
                            : 
                        <div
                            className="question-title"
                            onDoubleClick={this.props.displayOnly ? undefined : this.onQuestionTitleClick}
                        >
                            {this.props.question.title}
                        </div>
                )
    }

    render(){
        const editingTitle = this.state.editingTitle;
        const questionTitle = this.buildQuestionTitle(editingTitle);
        return (
            <div className="question-panel">
                {questionTitle}
                <div className="response-options-panel">
                    <ResponsePanel
                        questionID={this.props.questionID}
                        responseOptions={this.props.question.responseOptions}
                        editQuestion={this.props.editQuestion}
                        displayOnly={this.props.displayOnly}
                    />
                </div>
            </div>
        );
    }
}