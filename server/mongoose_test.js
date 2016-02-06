var path = require("path");

// init db connections
var mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/test");
mongoose.connection.on("erro", (err) => console.error("mongodb connection error", err));

require('./BookModel');

var Book = mongoose.model('Book');

function addBaseData() {
	for (var i = 100; i < 200; i++) {
		var b = new Book({
			name: "book " + i,
			authors: [{
				name: 'author ' + i
			}]
		});
		b.save(function() {
			console.log("done ... ", i);
		});
	}
}

addBaseData();
