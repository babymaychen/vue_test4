import Vue from 'vue';
import common from '../common';

var BookAdd = Vue.extend({
	template: `
		<div class="bookAdd">
			<form action="" class="bookForm" @submit.prevent='addHandler'>
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
				<button type='submit'>登陆</button>
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
		addHandler: function(){
			common.sendAjax("/books", {
				method: "POST",
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

export default BookAdd;