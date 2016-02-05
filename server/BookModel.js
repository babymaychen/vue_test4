var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var AuthorSchema = new Schema({
	name: String
});

var BookSchema = new Schema({
	name: {type: String, required: true},
	status: {type: String, match: /deleted|active/, default: "active"},
	authors: [AuthorSchema],
	createtime: {type: Date, default: Date.now},
	updatetime: {type: Date, default: Date.now}
});

BookSchema.path("createtime").get(function(v){
	return formatDateTime(v);
});
BookSchema.path("updatetime").get(function(v){
	return formatDateTime(v);
});
BookSchema.pre("save", function(next){
	this.updatetime = Date.now;
	next();
});


BookSchema.statics.add = function* (bookInfo){
	console.log("in  book save ....");
	var BookModel = this;
	var book = new BookModel();
	book.name = bookInfo.name;
	book.authors = bookInfo.authors.map(authorName => ({name: authorName}));
	return book.save();
};

BookSchema.statics.updateById = function* (id, bookInfo){
	console.log("in book update ...");
	console.log(id, bookInfo);
	var BookModel = this;
	var updateBookModel = yield BookModel.findOne({_id: id});
	updateBookModel.name = bookInfo.name;
	updateBookModel.authors = bookInfo.authors.map(v => ({name: v}));
	return updateBookModel.save();
}

BookSchema.statics.removeById = function*(id){
	var Book = this;
	return Book.remove({_id: id});
};

BookSchema.statics.findByCondition = function* (name, authorName){
	var Book = this;
	return Book.find({name: new RegExp(name)}).populate({
		path: 'authors',
		match: {name: new RegExp(authorName)}
	});
}

function formatDateTime(date){
	return date.toISOString().replace(/T/, ' ').replace(/\..+/, '');
}

mongoose.model("Book", BookSchema);