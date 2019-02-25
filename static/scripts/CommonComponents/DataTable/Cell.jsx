import React from "react";
import CellContent from "./CellContent.jsx"

export default class Cell extends React.Component{
    /*
    props:
        cellProperties which contains:
            editable: Boolean. Whether or not to allow the user to edit the cell
            tabbable: Boolean. If cells have a tab index (if editable, should be tabbable)
            cellType: String. Used in the cell's className
            handleEdit: function. State change for when a user edits a cell
            cellData: The data to appear in the cell's position
            columnID: String representing the columnID e.g. "A"
            columnName: String. The column name in the original data
            rowNumber: Integer. (Row Arrays start at 0)
            cellID: String. Combination of the row and column ID e.g. "A0"
    */
    constructor(props){
        super(props);
        this.state = {
            editing : false,
            editValue : this.props.cellProperties.cellData
        };

        this.handleDoubleClick = this.handleDoubleClick.bind(this);
        this.handleConfirmedEdit = this.handleConfirmedEdit.bind(this);
        this.updateEditValue = this.updateEditValue.bind(this);
        this.onEnterDown = this.onEnterDown.bind(this);
    }

    //-----When a cell div is double clicked this updates it to an editable cell, then focuses that cell after state is updated-----//
    handleDoubleClick(){
        if (this.props.cellProperties.editable){
            this.setState({
                editing : true
            },
                () => {
                    document.getElementById('data-table-editing-cell').focus()
                }
            );
        }
    }

    handleConfirmedEdit(value){
        this.setState({
            editing : false
            },
            () => { return this.props.cellProperties.handleEdit(
                this.props.cellProperties.rowNumber,
                this.props.cellProperties.columnName,
                value
            )}
        );
    }

    updateEditValue(value){
        this.setState({
            editValue : value
        });
    }

    onEnterDown(event){
        if (event.key === 'Enter'){
            this.handleDoubleClick(event);
        }
    }
    
    render(){
        const cellClass = "data-table-cell" + " " + this.props.cellProperties.cellType + "-cell";
        const editing = this.state.editing;
        const tabbable = this.props.cellProperties.tabbable ? "0" : undefined;
        const editValue = this.props.cellProperties.editable ? this.state.editValue : null;
        const editData = this.props.cellProperties.editable ? this.updateEditValue : null;
        const onEnterPress = editing ? null : this.onEnterDown;
        const onDoubleClick = this.props.cellProperties.editable ? this.handleDoubleClick : undefined;

        return(
            <div id={this.props.cellProperties.cellID} className={cellClass} onDoubleClick={this.handleDoubleClick} tabIndex={tabbable} onKeyUp={onEnterPress} >
                <CellContent
                    editing={editing}
                    onConfirmEdit={this.handleConfirmedEdit}
                    cellData={this.props.cellProperties.cellData}
                    editValue={editValue}
                    editData={editData}
                    cellID={this.props.cellProperties.cellID}
                    />
            </div>
        );
    }
}