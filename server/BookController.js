var BookModel = require("./BookModel");
var parser = require("co-body");

var mongoose = require("mongoose");
var Book = mongoose.model("Book");

function route(router) {
	router.get("/books", function*(next) {

		var books = yield Book.find({
			status: "active"
		});
		this.body = books;
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
		var params = yield parser(this);
		var searchCondition = params.searchCondition;
		var pagingInfo = params.pagingInfo;

		var totalResults = yield Book.findByCondition(searchCondition.name, searchCondition.authorName);

		var totalCount = totalResults.length;
		var perPageCount = pagingInfo.perPageCount;
		var pageNo = pagingInfo.pageNo;
		if(pageNo * perPageCount + 1 > totalCount){
			pageNo = pageNo - 1;
		}
		var results = totalResults.splice(pageNo * perPageCount + 1, perPageCount);

		this.body = {
			pagingInfo: {
				perPageCount: perPageCount,
				pageNo: pageNo,
				totalCount: totalCount
			},
			results: results
		}

	});
}

module.exports.route = route;