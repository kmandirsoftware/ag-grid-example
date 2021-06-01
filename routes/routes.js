const scheduledetailRoutes = require('./scheduledetails')

const appRouter = (app, mysql) => {

    // default route
    app.get('/', (req, res) => {
        res.render('index.html');
	    console.log("main entry");
    });

    scheduledetailRoutes(app, mysql);
};

module.exports = appRouter;
