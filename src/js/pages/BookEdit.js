import Vue from 'vue';
import common from '../common';

var BookEdit = Vue.extend({
	template: `
		<form action="" class="form-horizontal marginTop20" @submit.prevent='updateHandler'>
			<div class="form-group">
				<label for="booklist2_name" class="col-md-1 control-label">书名</label>
				<div class="col-md-5" class='form-control'>
					<input type="text" class='form-control' v-model='name' id='booklist2_name' placeholder='请输入书名'/>
				</div>
			</div>
			<div class="form-group">
				<label for="booklist2_authorStr" class="col-md-1 control-label">作者</label>
				<div class="col-md-5" class='form-control'>
					<input type="text" class='form-control' v-model='authorStr' id='booklist2_authorStr' placeholder='作者名，逗号分隔'/>
				</div>
			</div>
			<div class="form-group">
			   <div class="col-sm-offset-1 col-sm-10">
			     <button type="submit" class="btn btn-default">更新</button>
			   </div>
		</form>
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