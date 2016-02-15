var BookModel = require("./BookModel");
var parser = require("co-body");

var mongoose = require("mongoose");
var Book = mongoose.model("Book");

function route(router) {
	router.get("/books", function*(next) {
		var books = yield Book.find({});
		this.body = books;
	});

	router.get('/books/status/:status', function* (next){
		var status = this.params.status;
		var bookCount = yield Book.find({
			status: status
		}).count();
		this.body = {
			bookCount: bookCount
		}
	});


	router.get("/books/:id", function*(next) {
		var id = this.params.id;
		var bookInfo = yield Book.findById(id);
		this.body = bookInfo;
	});


	router.put("/books/:id", function*(next){
		var id = this.params.id;
		var bookInfo = yield parser(this);
		var updatedBookInfo = yield Book.updateById(id, bookInfo);
		this.body = updatedBookInfo;
	});

	router.put('/books/status/:id/:status', function *(next){
		var id = this.params.id;
		var status = this.params.status;
		var book = yield Book.findOne({_id:id});
		book.status = status;
		yield book.save();
		this.body = book;
	});

	router.del("/books/:id", function*(next){
		var id = this.params.id;
		var deletedBook = yield Book.removeById(id);
		this.body = deletedBook;
	});

	router.post("/books", function*(next) {
		var bookInfo = yield parser(this);
		var addedBook = yield Book.add(bookInfo);
		this.body = addedBook;
	});

	router.post("/books/search", function* (next){
		var params = yield parser.json(this);
		var searchCondition = params.searchCondition;
		var pagingInfo = params.pagingInfo;
		var sortInfo = params.sortInfo;

		var totalResults = yield Book.findByCondition(searchCondition.name, searchCondition.authorName);
		totalResults.sortArr(sortInfo.name, sortInfo.scending);

		var totalCount = totalResults.length;
		var perPageCount = pagingInfo.perPageCount;
		var pageNo = pagingInfo.pageNo;
		var startNo = (pageNo - 1) * perPageCount + 1;
		if(startNo > totalCount){
			startNo = startNo - perPageCount;
			pageNo = pageNo - 1;
		}
		var results = totalResults.splice(startNo - 1, perPageCount);

		this.body = {
			pagingInfo: {
				perPageCount: parseInt(perPageCount, 10),
				pageNo: parseInt(pageNo, 10),
				totalCount: parseInt(totalCount, 10)
			},
			results: results
		}

	});
}

module.exports.route = route;