import React from "react";

export default class CellContent extends React.Component{
    constructor(props){
        super(props);

        this.onEnterDown = this.onEnterDown.bind(this);
        this.onConfirmEdit = this.onConfirmEdit.bind(this);
        this.updateEditValue = this.updateEditValue.bind(this);
    }

    //onChange needing to be added, state should take this into account
    //and update the whole data after focus is lost
    checkEditing(){
        const cellData = this.props.cellData;
        if(this.props.editing){
            return <input 
                    id='data-table-editing-cell'
                    name='editing-cell'
                    value={this.props.editValue}
                    onKeyUp={this.onEnterDown}
                    onChange={this.updateEditValue}
                    onBlur={this.onConfirmEdit}
                    />
        }
        else{
            return <div>{cellData}</div>
        }
    }
    
    onEnterDown(event){
        if(event.key === 'Enter'){
            document.activeElement.blur();
        }
    }

    onConfirmEdit(event){
        this.props.onConfirmEdit(event.target.value);
    }

    updateEditValue(event){
        this.props.editData(event.target.value);
    }

    render(){
        const cellData = this.checkEditing();
        return(
                <span className="cell-data">{cellData}</span>
        );
    }
}