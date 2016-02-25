import Vue from 'vue';
import common from '../../common/common';

var BookList = Vue.extend({
	template: `
		<div class="bookList marginTop20">
			<slot></slot>
		</div>
	`
})

var BookItem = Vue.extend({
	template: `
		<div class="bookItem">
			<template v-if='status === "display"'>
				<div title='{{bookItem.name}}'>{{bookItem.name}}</div>
				<div title='{{formatAuthors}}'>{{formatAuthors}}</div>
				<div>
					<a href="" @click.prevent='updateLinkHandler'>update</a>
				</div>
				<div>
					<a href="" @click.prevent='deleteLinkHandler($event)' data-bookid='{{bookItem._id}}'>delete</a>
				</div>
			</template>
			<template v-else>
				<div>
					<input type="text" name="" id="" v-model='bookName' placeholder='book name here'/>
				</div>
				<div>
					<input type="text" name="" id="" v-model='authorStr' placeholder='use comma to seperate authors'/>
				</div>
				<div>
					<button @click='updateBtnHandler'>Update</button>
				</div>
				<div></div>
			</template>
		</div>
	`,
	props: ["bookItem", "books"],
	data: function(){
		return {
			bookName: '',
			authorStr: '',
			status: 'display'
		}
	},
	methods: {
		deleteLinkHandler: function(e){
			var id = $(e.target).attr('data-bookid');
			this.$dispatch('book-delete', id);
		},
		updateLinkHandler: function(){
			this.bookName = this.bookItem.name;
			this.authorStr = this.bookItem.authors.map(v => v.name).join(",");
			this.status = 'edit';

			// 每次只允许一行更新
			var children = this.$parent.$children;
			children.forEach(child => {
				if(child === this){
					return;
				}
				child.status = 'display';
			})
		},
		updateBtnHandler: function(){
			this.status = 'display';
			this.$dispatch('book-update', {
				id: this.bookItem._id,
				name: this.bookName,
				authorStr: this.authorStr
			})
		}
	},
	computed: {
		formatAuthors: function(){
			var authorArr = this.bookItem.authors;
			return authorArr.map(author => `[${author.name}]`).join(" & ");
		}
	}
})

var BookForm = Vue.extend({
	template: `
		<div class="bookForm">
			<form action="" @submit.prevent='addClickHandler'>
				<div class="inlineBlock">
					<input type="text" name="" id="" v-model='name'/>
				</div>
				<div class="inlineBlock">
					<input type="text" name="" id="" v-model='authorStr'/>
				</div>
				<div>
					<button type='submit'>Add</button>
				</div>
			</form>
		</div>
	`,
	data: function(){
		return {
			name: "",
			authorStr: ""
		}
	},
	methods: {
		addClickHandler: function(){
			this.$dispatch('book-add', {
				name: this.name,
				authorStr: this.authorStr
			});
			this.name = "";
			this.authorStr = "";
		}
	}
})

// 注意： 由于html属性不区分大小写，所以
// 错误： :bookItem
// 正确： :book-item
var BookBox = Vue.extend({
	template: `
		<div class="bookBox">
			检索： <input type="text" v-model='query' class='marginTop20'/>
			<book-list>
				<book-item 
					@book-delete='bookDeletHandler'
					@book-update='bookUpdateHandler'
					v-for="bookItem in books | bookfilter query" 
					:book-item="bookItem"
					transition='shorter'>
				</book-item>
			</book-list>
			<book-form
				@book-add='bookAddHandler'>
			</book-form>
		</div>
	`,

	data: function(){
		return {
			books: [],
			query: ""
		}
	},

	ready: function(){
		this.initBookList();
	},

	computed: {
		bb: function() {
			var query = this.query;
			var filteredData = $(this.books).filter((_, item) => {
				return new RegExp(query).test(item.name);
			}).get();
		}
	},

	methods: {
		initBookList: function(){
			common.sendAjax("/books", {
				method: "GET"
			}).done(books => this.books = books);
		},
		bookAddHandler: function({name, authorStr}){
			var bookInfo = {
				name: name,
				authors: authorStr.split(",")
			}
			common.sendAjax("/books", {
				method: "POST",
				data: bookInfo
			}).done(() => this.initBookList());
		},
		bookDeletHandler: function(id){
			common.sendAjax("/books/" + id, {
				method: 'delete'
			}).done(() => {
				this.initBookList();
			})
		},
		bookUpdateHandler: function({id, name, authorStr}){
			var bookInfo = {
				name: name,
				authors: authorStr.split(",")
			}
			common.sendAjax("/books/" + id, {
				method: "PUT",
				data: bookInfo
			}).done(() => this.initBookList());
		}
	},

	components: {
		BookList, BookForm, BookItem
	}
});

export default BookBox;