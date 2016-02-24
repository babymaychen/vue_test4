import Vue from 'vue';
import common from 'common/common';

var html = require("./BookEdit.html")

var BookEdit = Vue.extend({
	template: html,
	data: function(){
		return {
			id: "",
			name: "",
			authorStr: ""
		}
	},
	ready: function(){
		var bookId = this.$route.params.bookId;
		common.sendAjax("books/" + bookId, {
			method: "GET", 
		}).done((bookInfo) =>{
			this.id = bookInfo._id;
			this.name = bookInfo.name;
			this.authorStr = bookInfo.authors.map(v => v.name).join(",");
		});
	},
	methods: {
		updateHandler: function(){
			common.sendAjax("/books/" + this.id, {
				method: "PUT", 
				data: {
					name: this.name,
					authors: this.authorStr.split(",")
				}
			}).done(() => {
				this.$router.go({path: '/books/list'});
			});
		}
	}
});

export default BookEdit;