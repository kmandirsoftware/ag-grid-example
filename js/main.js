

    
// let the grid know which columns and what data to use
var gridOptions = {
  rowModelType: 'serverSide',
  
  getChildCount: function (data) {
    //console.log("Here");
    
    if (typeof data === 'undefined'){return undefined};
    if(data.ClockHour > 19) data.ClockHour = 20;
    return clockHourCounts[data.ClockHour].count;
  },

  animateRows: true,
  pivotMode: true,

};

function getrow(agGrid){
  agGrid.simpleHttpRequest({
    url: 'http://localhost:3013/ScheduleDetails'
  })
  .then(function (data) {
    gridOptions.api.setRowData(data);
  })
}
var clockHourCounts = {};
function getClockHourCounts(){
  agGrid.simpleHttpRequest({
    url: 'http://localhost:3013/ClockHourCounts'
  })
  .then(function (data) {
    clockHourCounts = data;
    console.log(data);
  })

}

function getcolumnheader(agGrid){
  agGrid.simpleHttpRequest({
    url: 'http://localhost:3013/ScheduleDetailsColumnNames'
  })
  .then(function (data) {
    console.log(data);
    var mycolumn = [];

    for (var index in data){
      mycolumn.push({headerName: data[index], field: data[index]})
    }
    gridOptions.api.setColumnDefs( mycolumn );

    gridOptions.columnApi.applyColumnState({
      state: [
        {colId: 'ClockHour', rowGroup: true  },
        {colId: 'Date', pivot: true },
        {colId: 'UniqueCampaigns', aggFunc: 'sum' },
      ],
      defaultState: {
        pivot: false,
        rowGroup: false,
      },
    });

  })
}
// setup the grid after the page has finished loading
document.addEventListener('DOMContentLoaded', function() {
    console.log("document has been loaded");
    var gridDiv = document.querySelector('#myGrid');
    
    new agGrid.Grid(gridDiv, gridOptions);
    getcolumnheader(agGrid);
    getClockHourCounts();
    gridOptions.api.sizeColumnsToFit();
    gridOptions.api.setServerSideDatasource(datasource);
});

function getSelectedRows() {
    var selectedNodes = gridOptions.api.getSelectedNodes()
    var selectedData = selectedNodes.map( function(node) { return node.data })
    var selectedDataStringPresentation = selectedData.map( function(node) { return node.make + ' ' + node.model }).join(', ')
    alert('Selected nodes: ' + selectedDataStringPresentation);
}
const datasource = {
    getRows(params) {
      console.log(JSON.stringify(params.request, null, 1));
      var xhttp = new XMLHttpRequest();
      xhttp.open("POST","http://localhost:3013/campaignInfo",true);
      xhttp.setRequestHeader("Content-Type","application/json; charset=utf-8");
      xhttp.send(JSON.stringify(params.request));
      xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
          myObj = JSON.parse(this.responseText);
          console.log(myObj.lastRow);
          addPivotColDefs( myObj, params.columnApi);
          var newObj = fixReturnObj(myObj.rows);
          params.successCallback(newObj, myObj.lastRow);  
        }
      };
    }
}

function fixReturnObj( myObj){
  var clockObj=[];
  var clockAr=[];
  var i=0;
  myObj.forEach(function (key,index) {
    var str1 = myObj[index].Date;
    var str2 = myObj[index].ClockHour;
    var str3 = str1.concat(str2);
    var n = clockAr.includes(str2);
    if(n === false){
      clockAr.push(str2);
      clockObj[i]={"ClockHour": str2};
      i++;
    }
  clockObj[clockAr.indexOf(str2)][str1] = myObj[index].UniqueCampaigns;
  });
  return clockObj;
}

function addPivotColDefs(response, columnApi) {
  // check if pivot colDefs already exist
  var existingPivotColDefs = columnApi.getSecondaryColumns();
  if (existingPivotColDefs && existingPivotColDefs.length > 0) {
    return;
  }

  // create colDefs
  var pivotColDefs = response.pivotFields.map(function (field) {
    var headerName = field.split('_')[0];
    return { headerName: headerName, field: field };
  });
  // supply secondary columns to the grid
  columnApi.setSecondaryColumns(pivotColDefs);
}
