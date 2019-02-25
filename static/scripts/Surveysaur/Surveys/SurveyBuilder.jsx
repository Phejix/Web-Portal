import React from "react";
import QuestionPanel from "./QuestionPanel.jsx";

export default class SurveyBuilder extends React.Component{
    /*
    questions should be in order. SurveyBuilder will need a top wrap when hosting to also grab
    the appropriate questions to be rendered.
    props:
        displayOnly : Used to prevent editing ablilities when hosting surveys
        questions: Used to initalise the questions found in the given Survey.
    */
    constructor(props){
        super(props);
        this.state = {
            questions : this.props.questions
        }

        this.editQuestion = this.editQuestion.bind(this);
    }

    componentDidMount(){
        //API Call to update questions
        this.setState({
            questions : {
                "6" : {
                    title : "Test Question",
                    responseOptions : {
                        alignment : 'vertical',
                        type : 'checkbox',
                        commentBox : {
                            include : true,
                            mandatory : false,
                            value : "",
                            title : "Comments: "
                        },
                        options : {
                            option1 :
                                {
                                    name : 'TextApp',
                                    value : "dinosaur",
                                    imageDetails : {
                                        source : '/static/images/Apps/Surveysaur.png',
                                        alternative : 'TextApp',
                                    },
                                    checked : false,
                                    label : {
                                        name : "",
                                        value : ""
                                    }
                                },
                                option2 : {
                                    name : 'TextApp',
                                    value : "Hi",
                                    label : {
                                        name : "This",
                                        value : "Hi"
                                    },
                                    checked : false
                                }
                        }
                    }
                }
            }
        });
    }

    editQuestion(questionID, updateItem, updateObject){
        let questionsCopy = Object.assign({}, this.state.questions);
        questionsCopy[questionID][updateItem] = updateObject;

        this.setState({
            questions : questionsCopy
        });
    }

    buildQuestions(questions){
        return (Object.keys(questions).map((questionID) => {
                return <QuestionPanel
                            key={questionID}
                            question={questions[questionID]}
                            questionID={questionID}
                            displayOnly={this.props.displayOnly}
                            editQuestion={this.editQuestion}
                        />
            })
        )
    }

    render(){
        const questions = this.state.questions;
        const questionsPanel = this.buildQuestions(questions);
        return(
            <div className="surveysaur-survey-builder">
                {questions && questionsPanel}
                <button>Submit</button>
            </div>
        );
    }
}