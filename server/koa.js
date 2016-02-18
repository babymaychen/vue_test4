var app = require("koa")();
var router = require("koa-router")();
var koaStatic = require("koa-static");


var path = require("path");

// extends js methods
require('./common')();

// init db connections
var mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/test");
mongoose.connection.on("erro", (err) => console.error("mongodb connection error", err));

// log
app.use(function* (next){
	var start = new Date().getTime();
	console.log(`-- begin ${this.method.toUpperCase()} ${this.path}`);
	yield next;
	var end = new Date().getTime();
	console.log(`end cost [${end-start}]ms`);

});

// static
var staticSubPath = process.env.NODE_ENV == 'product' ? '../build/' : '../'
var staticPath = path.join(__dirname, staticSubPath);
app.use(koaStatic(staticPath));

// Books
var BookController = require("./BookController");
BookController.route(router);


app.use(router.routes());
app.use(router.allowedMethods());

var port = 3000;
app.listen(port);
console.log(`server stared on port ${port}`);
