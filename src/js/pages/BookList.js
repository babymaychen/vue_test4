import Vue from 'vue';
import common from '../common';

var BookList = Vue.extend({
	template: `
		<div class="bookList">
			<div class="bookItem" v-for='bookItem in books'>
				<div title={{bookItem.name}}>{{bookItem.name}}</div>
				<div title="{{formateAuthor(bookItem.authors)}}">{{formateAuthor(bookItem.authors)}}</div>
				<div>
					<button @click='goEdit($event)' data-bookid={{bookItem._id}}>编辑</button>
				</div>
			</div>
		</div>
	`,
	data: function(){
		return {
			books: []
		}
	},
	methods: {
		formateAuthor: function(authors){
			return authors.map(v => v.name).join(",");
		},
		goEdit: function(e){
			var id = $(e.target).attr("data-bookid");
			this.$router.go({path: '/books/edit/' + id});
		}
	},
	ready: function(){
		common.sendAjax("/books", {
			method: "GET"
		}).done((books) => {
			this.books = books
		});
	}
});

export default BookList;