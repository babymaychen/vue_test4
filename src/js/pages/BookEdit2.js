import Vue from 'vue';
import common from '../common';

var BookEdit = Vue.extend({
	template: `
		<div class="bookEdit">
			<form action="" class="bookForm" @submit.prevent='updateHandler'>
				<div class="formgroup">
					<span class="title">书籍名称</span>
					<span class="content">
						<input type="text" name="" id="" v-model='name'/>
					</span>
				</div>
				<div class="formgroup">
					<span class="title">书籍作者</span>
					<span class="content">
						<input type="text" name="" id="" v-model='authorStr'/>
					</span>
				</div>
				<button type='submit'>更新</button>
			</form>
		</div>
	`,
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