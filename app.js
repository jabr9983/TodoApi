/**
 * Module dependencies.
 */
 
var express = require('express'),
	cors = require('cors'),
	routes = require('./routes'),
	http = require('http'),
	tasks = require('./routes/tasks'),
	mongoose = require('mongoose'),
    search = require('./routes/search');
var Task = require('./models/task').Task; 

  


// MongoDB Connection 
mongoose.connect('mongodb://localhost/task_tracker');
var app = express();



		app.configure(function() {
			app.set('port', 3000);
			app.set('views', __dirname + '/views');
			app.set('view engine', 'jade');
			app.use(express.favicon());
			app.use(express.logger('dev'));
			app.use(express.bodyParser());
			app.use(express.methodOverride());
			app.use(app.router);
			app.use(express.urlencoded());
			app.use(express.json());
			app.use(cors());

		});
		app.use(function(req, res, next) {
		  res.header("Access-Control-Allow-Origin", "*");
		  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
		  next();
		});
		
		var corsOptions = {
		  origin: 'http://localhost:3000'
	  };
		

		app.get('/', routes.index);
		app.get('/tasks', tasks.index);
		//app.get('/search', tasks.FindByQuery);
		//app.get('/tasks/:task.:name?', task.FindByQuery); 
		app.get('/search', function(req, res, next) {
  			var query = req.query
  			//res.send(query['name']);
  			Task.findOne({name: query['name']}, function(err, doc) {
    			if(!err && doc) {
      				res.json(200, doc);
    			} else if(err) {
      				res.json(500, { message: "Error loading task." + err});
    			} else {
      				res.json(404, { message: "Task not found."});
    			}
    		});
  			//res.end(JSON.stringify(query));
  		});
		app.get('/tasks/:id', tasks.show);
		app.post('/tasks', tasks.create);
		app.put('/tasks', tasks.update);
		app.del('/tasks', tasks.delete);

		http.createServer(app).listen(app.get('port'), function() {
			console.log("Express server listening on port 3000");
		
	});