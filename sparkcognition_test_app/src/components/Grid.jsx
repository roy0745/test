import React from 'react';
import {AgGridReact} from 'ag-grid-react';

import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-material.css';
import 'ag-grid-enterprise';
import moment from 'moment';


export default function Grid(props) {
  const { deviceMap, rowData } = props;

  function durationFormatter(params) {
    var totalSeconds = params.value;
    var hours = Math.floor(totalSeconds / 3600);
    totalSeconds %= 3600;
    var minutes = Math.floor(totalSeconds / 60);
    var seconds = (totalSeconds % 60).toFixed(1);
    var res = ''
    if (hours !== 0) {
      res += hours + ' hrs, '
    }
    if (minutes !== 0) {
      res += minutes + ' min, '
    }
    if (seconds !== 0) {
      res += seconds + ' sec'
    }
    return res
  }

  function deviceFormatter(params) {
    return deviceMap[params.value];
  }

  function dateFormatter(params) {
    return moment(params.value).format('MM/DD/YYYY h:mm a');
  }
  function onGridReady(params) {
        this.gridApi = params.api;
        this.columnApi = params.columnApi;
        this.gridApi.sizeColumnsToFit();
        window.onresize = () => {
            this.gridApi.sizeColumnsToFit();
        }
}
  const colDefs = [
    {headerName: 'Turbine', field: 'device_id', valueFormatter: deviceFormatter, filterParams:{valueFormatter:deviceFormatter}, filter: 'agSetColumnFilter', sortable: true, resizable:true},
    {headerName: 'Date and Time', field: 'time_stamp', valueFormatter: dateFormatter, sortable: true, filter: 'agDateColumnFilter', resizable:true},
    {headerName: 'Duration of Alarm', field: 'duration_seconds', valueFormatter: durationFormatter, filterParams:{valueFormatter:durationFormatter}, filter: 'agNumberColumnFilter', sortable: true, resizable:true},
    {headerName: 'Category', field: 'category', sortable: true, filter: true, resizable:true},
    {headerName: 'Alarm Code', field: 'code', sortable: true, filter: true, resizable:true},
    {headerName: 'Description', field: 'description', sortable:true, filter:true, resizable:true},

  ];


   return (

       <div className="ag-theme-material">
           <AgGridReact
             rowData= {rowData}
             pagination= {true}
             columnDefs= {colDefs}
             domLayout='autoHeight'
             onGridReady={onGridReady}
              />
       </div>

   );
};
