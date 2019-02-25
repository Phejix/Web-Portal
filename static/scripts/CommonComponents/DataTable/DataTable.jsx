import React from "react";
import Cell from "./Cell.jsx";

export default class DataTable extends React.Component{
    /*
    props:
        headers : String List. The names of all the columns that have data,
        dataTable : Object.
        Example dataTable = {
            data : [
                {col1 : cellDataX, col2 : cellDataY}
            ],
            cellRules : {
                //Build all cells using all settings and then overwrite based on all > column > row > cell
                //Could set an optional cell rule for the order?
                all : {
                    editable : true,
                    tabbable : true,
                    cellType : regular,
                    handleEdit : handleCellEdit
                },
                column: {
                    'B' : {columnMethod : func}
                },

                row : {
                    //Pass rows as stringed row numbers, row array begins at 0
                    '0' : {cellType : header}
                },
                cell :{
                    'A1' : {editable : false}
                }
            },
            tableID: string. Name of the table (optional),
            options : {
                autoGrid: boolean. If true, sets data-table style to a grid and auto assigns
                columns as the number of headers. Useful for dynamic tables.
                includeOverflowWrapper: boolean. If true, wraps the data-table div with another
                div with the class "data-table-overflow-wrapper".
            },
            headersOrder: Ordered List of headers that are required - NOT WORKING
        }
        -------------DataTable creates the cells with the row, column IDs and cellData-----------------------------------------------
        -------------DataTable builds the cell from the data then assigns the rules to the cells based of off cellRules--------------
    */

    buildCellGrid(data, headers){
        const cellRules = this.checkCellRules(this.props.cellRules);
        let cells = [];

        for (let i = 0; i < data.length; i++){            
            let columnID = 'A';

            headers.map((column) => {
                let cellData = '';

                if (data[i][column] != undefined){
                    cellData = data[i][column];
                }

                let cellID = columnID + i;

                //Appending rules, data and metadata to the cellObject
                let cellObject = {};
                
                //Needs to create a copy else gets overwritten
                Object.keys(cellRules.all).map((rule) => {
                    cellObject[rule] = cellRules.all[rule];
                });

                cellObject.cellData = cellData;
                cellObject.rowNumber = i;
                cellObject.columnID = columnID;
                cellObject.columnName = column;
                cellObject.cellID = cellID;

                if ('column' in cellRules && columnID in cellRules.column){
                    cellObject = Object.assign(cellObject, cellRules.column[columnID]);
                }
                if ('row' in cellRules && i.toString() in cellRules.row){
                    cellObject = Object.assign(cellObject, cellRules.row[i.toString()]);
                }
                if ('cell' in cellRules && cellID in cellRules.cell){
                    cellObject = Object.assign(cellObject, cellRules.cell[cellID]);
                }

                cells.push(<Cell cellProperties={cellObject} key={cellObject.cellID} />);
                columnID = this.getNextColumnID(columnID);
            });
        }

        return cells
    }

    getNextColumnID(columnID){
        //Doesn't allow for columns longer than "Z" i.e. AA though the starting thoughts are here with splitting and joining the string
        let splitName = columnID.split("");
        let chosenLetter = splitName[(splitName.length - 1)];

        splitName[(splitName.length - 1)] = String.fromCharCode(chosenLetter.charCodeAt(0) + 1);
        return splitName.join("")
    }

    checkCellRules(cellRules){
        let initialRules = {
            all : {
                tabbable : false,
                editable : false,
                cellType : 'regular',
                handleEdit : undefined
            },
            column : {

            },
            row : {
                "0" : {
                    cellType : 'header'
                }
            },
            cell : {

            }
        };

        if (cellRules === undefined){
            cellRules = {};
        }

        /*
            Loops through the properties in cellRules and makes sure all default
            values are present
        */
        for (let cellProperty in initialRules){
            if (!cellRules.hasOwnProperty(cellProperty)){
                cellRules[cellProperty] = initialRules[cellProperty];
            }
            else{
                for (let rule in initialRules[cellProperty]){
                    if (!cellRules[cellProperty].hasOwnProperty(rule)){
                        cellRules[cellProperty][rule] = initialRules[cellProperty][rule];
                    }
                }
            }
        }

        return cellRules
    }

    checkOptions(){
        let defaultOptions = {
            autoGrid : false,
            includeOverflowWrapper : true
        }

        if (this.props.options === undefined){
            return defaultOptions
        }

        for (let option in defaultOptions){
            if (!this.props.options.hasOwnProperty(option)){
                this.props.options[option] = defaultOptions[option];
            }
        }

        return this.props.options
    }

    getAllHeaders(data, ordered_headers){
        let headers = [];

        if (ordered_headers){
            headers = headers.concat(ordered_headers);
            console.log(headers)
        }

        for (let row in data){
            for (let column in data[row]){
                if (!headers.includes(column)){
                    headers.push(column);
                }
            }
        }

        return headers
    }

    render(){
        const data = this.props.data;
        const options = this.checkOptions();
        //--------------------------TODO: headersOrder doesn't currently work correctly and adds extra columns-----------------------
        const headers = this.getAllHeaders(data);

        const tableStyle = options.autoGrid ? {'display' : 'grid', 'gridTemplateColumns' : 'repeat(' + headers.length + ', auto)'} : undefined;
        const cellGrid = this.buildCellGrid(data, headers);

        const dataTable = <div id={this.props.tableID} className="data-table" style={tableStyle}>{cellGrid}</div>;

        return(
                options.includeOverflowWrapper ? 
                <div id={this.props.tableID + "-wrapper"} className="data-table-overflow-wrapper">{dataTable}</div>
                :
                dataTable
        );
    }
}