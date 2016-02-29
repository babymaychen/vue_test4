import Vue from 'vue';

var html = require('./Life.html');

var Page = Vue.extend({
	template: html,
	data: function(){
		return {
			msg: "hello"
		}
	},
	created: function(){
		console.log("created ~");
	},
	beforeCompile: function(){
		console.log("beforeCompile ~");
	},
	compiled: function(){
		console.log("compiled ~");	
	},
	ready: function(){
		console.log("ready ~");
	},
	route: {
		canReuse: function(transition) {
			console.log("[route] canReuse");
			transition.next();
		},
		canDeactivate: function(transition) {
			console.log("[route] canDeactivate");
			transition.next();
		},
		canActivate: function(transition) {
			console.log("[route] canActivate");
			transition.next();
		},
		activate: function(transition) {
			console.log("[route] activate");
			transition.next();
		},
		data: function(transition) {
			setTimeout(() => {
				console.log("[route] data");
				transition.next({
					msg: "gogogo"
				});
			}, 1000);

			// console.log("[route] data");
			// transition.next();
		},
	}
});

export default Page;