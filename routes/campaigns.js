const campaignRoutes = (app, mysql) => {

    const con = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '347Grace',
        database: 'landmark'
    });


    con.connect(function(err) {
        if (err) throw err;
        console.log("Connected!");
    });

    app.get('/campaignColumnNames', (req, res) => {
        var myquery="show columns from campaigns";
        con.query(myquery, function(err,result){
            if(err){
                console.log('Error');
                console.log(err);
            }else{
                console.log('Success');
                var data= new Array();
                for (var index in result){
                    if( result[index]['Field'] === "id"){ continue };
                    if( result[index]['Field'] === 'created_at'){ continue };
                    data.push(result[index]['Field']);
                }
                var json=JSON.stringify(data);
                res.send(json);
            }
        })
    });
