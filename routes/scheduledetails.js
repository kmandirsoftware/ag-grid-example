const ScheduleService = require('./scheduleService')

const scheduledetailRoutes = (app, mysql, fs) => {

    const con = mysql.createConnection({
        host: 'ec2-3-14-145-225.us-east-2.compute.amazonaws.com',
        user: 'webuser',
        password: 'webwordpw',
        database: 'ldmrk'
    });


    con.connect(function(err) {
        if (err) throw err;
        console.log("Connected!");
    });

    let sR = new ScheduleService();

    app.post('/campaignInfo', function (req, res) {
        sR.getData(con, req.body, (rows, lastRow, pivotFields) => {
            res.json({rows: rows, lastRow: lastRow, pivotFields: pivotFields});
        });
    });

    app.get('/ClockHourCounts', (req,res) => {
        var myquery = "select ClockHour,count(distinct campaign) as count FROM ldmrk.schedule  group by ClockHour";
         con.query(myquery, function(err,result){
            if(err){
                console.log('Error');
                console.log(err);
            }else{
                console.log('Success');
              var data=[];
              var i=0;
              for (var index in result){
                 delete result[index]['id'];
                 data[i] = result[index];
                 i++;
              }
                var json=JSON.stringify(data);
                res.send(json);
            }
        })
    });

    app.get('/ScheduleDetails', (req, res) => {
        if(req.query.hasOwnProperty('start')){
            console.log(req.query['start']);
            var selectallquery = "select * from schedule limit 100 offset  "+req.query['start'] ;
        }else{
            var selectallquery = "select * from schedule limit 1000";
        }
      con.query(selectallquery, function(err,result) {
        if(err) {
          console.log('Error');
          console.log(err);
        }
        else {
          console.log('Success');
          var data=[];
          var i=0;
          for (var index in result){
            delete result[index]['id'];
            data[i] = result[index];
            i++;
           }
            //console.log(header);
             var json = JSON.stringify(data);
           res.send(json); 
        }
      });            
    });

    app.get('/ScheduleDetailsColumnNames', (req, res) => {
        var myquery="show columns from ldmrk.schedule";
        con.query(myquery, function(err,result){
            if(err){
                console.log('Error');
                console.log(err);
            }else{
                console.log('Success');
                var data= [];
                var i=0;
                for (var index in result){
                    if( result[index]['Field'] === "id"){ continue };
                    if( result[index]['Field'] === 'created_at'){ continue };
                    data[i] = result[index]['Field'];
                    i++;
                }
                var json=JSON.stringify(data);
                res.send(json);
            }
        })
    });

};
module.exports = scheduledetailRoutes;