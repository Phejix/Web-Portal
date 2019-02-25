import React from "react";

export default class ResponsePanel extends React.Component{
    /*
    props:
        displayOnly: Boolean.
        questionID: "", used to update the specific question when editing.
        editQuestion: Function. Used in SurveyBuilder to amend any changes made to a question.
        responseOptions : {
            type: 'horizontal' or 'vertical' (for displaying the options)
            commentBox: {
                include: Boolean. Whether a commentBox accompanies the question.
                mandatory: Boolean. Whether the commentBox is required to have some entries.
                           (Could add some minimal limit if desired to reduce spam replies)
                value : ""
            }
            options: {
                "optionID" : {
                    type: "",
                    name: "",
                    value: "",
                    checked: T/F,
                    *(optional) label: {
                        name: "",
                        value: ""
                    }
                    *(optional) imageDetails: {
                        source: "",
                        alternative: ""
                    }
                }
            }
        }
    */
    constructor(props){
        super(props);
        this.state = {
            comments : this.props.responseOptions.commentBox.value,
            commentsTitle : this.props.responseOptions.commentBox.title,
            editingCommentsTitle : false
        };

        this.editComments = this.editComments.bind(this);
        this.confirmCommentEdit = this.confirmCommentEdit.bind(this);
        this.editCommentsTitle = this.editCommentsTitle.bind(this);
        this.onEnterConfirm = this.onEnterConfirm.bind(this);
        this.setCommentsTitleEdit = this.setCommentsTitleEdit.bind(this);
    }

    buildCommentBox(comments, commentsTitle, editingCommentsTitle){
        return (
            <div className="comment-box">
                {this.buildCommentsTitle(commentsTitle, editingCommentsTitle)}
                <textarea
                    rows="4"
                    cols="50"
                    name="comments"
                    value={comments}
                    onChange={this.editComments}
                    onBlur={this.confirmCommentEdit}
                    onKeyDown={this.onEnterConfirm}
                />
            </div>
        );
    }

    setCommentsTitleEdit(){
        this.setState({
            editingCommentsTitle : true
        }, () => {
            document.getElementById("editable-comment-title-" + this.props.questionID).focus();
        });
    }

    editCommentsTitle(event){
        this.setState({
            commentsTitle : event.target.value
        });
    }

    onEnterConfirm(event){
        if (event.key === "Enter"){
            this.confirmCommentEdit();
        }
    }

    buildCommentsTitle(commentsTitle, editingCommentsTitle){
        return (editingCommentsTitle ? <input
                                        type="text"
                                        id={"editable-comment-title-" + this.props.questionID}
                                        className="editable-comment-title"
                                        value={commentsTitle}
                                        onChange={this.editCommentsTitle}
                                        onBlur={this.confirmCommentEdit}
                                        onKeyDown={this.onEnterConfirm}
                                    />
                                    : 
                                    <div
                                        className="comment-title"
                                        value={commentsTitle}
                                        onDoubleClick={this.props.displayOnly ? undefined : this.setCommentsTitleEdit}
                                    >
                                        {commentsTitle}
                                    </div>
                )
    }

    editComments(event){
        this.setState({
            comments : event.target.value
        });
    }

    confirmCommentEdit(){
        const state = this.state;
        let responseOptionsCopy = Object.assign({}, this.props.responseOptions);
        responseOptionsCopy.commentBox.value = state.comments;
        responseOptionsCopy.commentBox.title = state.commentsTitle;

        this.props.editQuestion(this.props.questionID, "responseOptions", responseOptionsCopy);

        this.setState({
            editingCommentsTitle : false
        });
    }

    buildresponseOptions(){
        const options = this.props.responseOptions.options;
        return (
            Object.keys(options).map((optionID) => {
                return <Option
                            option={options[optionID]}
                            editQuestion={this.props.editQuestion}
                            key={optionID}
                            questionID={this.props.questionID}
                            responseOptions={this.props.responseOptions}
                            optionID={optionID}
                        />
            })
        )
    }

    render(){
        const state = this.state;
        return (
            <div className="question-response">
                <div className={"response-display-" + this.props.responseOptions.alignment}>
                    {this.buildresponseOptions()}
                </div>
                {this.props.responseOptions.commentBox.include && this.buildCommentBox(
                                                                        state.comments,
                                                                        state.commentsTitle,
                                                                        state.editingCommentsTitle
                                                                        )
                }
            </div>
        );
    }
}

class Option extends React.Component{
    constructor(props){
        super(props);

        this.onChangeCheckboxOption = this.onChangeCheckboxOption.bind(this);
        this.onChangeRadioOption = this.onChangeRadioOption.bind(this);
    }

    onChangeRadioOption(event){
        let responseOptionsCopy = Object.assign({}, this.props.responseOptions);

        for (let optionID in responseOptionsCopy.options){
            if (this.props.responseOptions.options[optionID].value === event.target.value){
                responseOptionsCopy.options[optionID].checked = true;
            }
            else {
                responseOptionsCopy.options[optionID].checked = false;
            }
        }

        this.props.editQuestion(
            this.props.questionID,
            "responseOptions",
            responseOptionsCopy
        );
    }

    onChangeCheckboxOption(){
        let responseOptionsCopy = Object.assign({}, this.props.responseOptions);
        responseOptionsCopy.options[this.props.optionID].checked = !this.props.responseOptions.options[this.props.optionID].checked;

        this.props.editQuestion(
            this.props.questionID,
            "responseOptions",
            responseOptionsCopy
        );
    }

    buildOption(){
        const optionReference = {
            "checkbox" : <input
                            type="checkbox"
                            name={this.props.option.name}
                            value={this.props.option.value}
                            onChange={this.onChangeCheckboxOption}
                            checked={this.props.option.checked}
                        />,
            "radio" : <input
                        type="radio"
                        name={this.props.option.name}
                        value={this.props.option.value}
                        onChange={this.onChangeRadioOption}
                        checked={this.props.option.checked}
                        />
        };
        return optionReference[this.props.responseOptions.type]
    }

    render(){
        const option = this.buildOption();
        return (
            //This should alter based on whether the display was horizontal or vertical (if horizontal the box is below the pic/text)
            <div className="question-option">
                <label name={this.props.option.label.name} value={this.props.option.label.value}>
                    {option}
                    {this.props.option.imageDetails &&
                        <img 
                            src={this.props.option.imageDetails.source}
                            alt={this.props.option.imageDetails.alternative}
                        />
                    }
                    {this.props.option.label.value}
                </label>
            </div>
        );
    }
}