import Vue from 'vue';

var html = require("./Transition.html");

var Transition = Vue.extend({
	template: html,
	data: function(){
		return {
			textShow: true,
			filterValue: "",
			fruits: ["apple", "banana", "watermelon", "pare", "orange"]
		}
	},
	methods: {
		clickHandler:function(e){
			let v = e.target.value;
			this.textShow = v == 'show' ? true : false
		}
	}
});

export default Transition;