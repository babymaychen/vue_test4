import Vue from 'vue';
import common from 'common/common';

var html = require("./BookAdd.html");

var BookAdd = Vue.extend({
	template: html,
	data: function(){
		return {
			name: "",
			authorStr: ""
		}
	},
	ready: function(){
		$(this.$el).validate({
			rules: {
				bookName: {
					required: true
				},
				authorName: {
					required: true
				}
			}
		})
	},
	methods: {
		addHandler: function(){
			var form = $(this.$el);
			if(!form.valid()){
				// 为了focus到第一个错误的元素上
				form.validate();
				return;
			}

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