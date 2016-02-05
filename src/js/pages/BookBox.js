import Vue from 'vue';
import common from '../common';

var BookList = Vue.extend({
	template: `
		<div class="bookList">
			<slot></slot>
		</div>
	`,
	props: ["books"]
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
			<book-list :books='books'>
				<book-item 
					:books="books" 
					@book-delete='bookDeletHandler'
					@book-update='bookUpdateHandler'
					v-for="bookItem in books" 
					:book-item="bookItem">
				</book-item>
			</book-list>
			<book-form
				@book-add='bookAddHandler'>
			</book-form>
		</div>
	`,

	data: function(){
		return {
			books: []
		}
	},

	ready: function(){
		this.initBookList();
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