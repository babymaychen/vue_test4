import Vue from 'vue';

export default Vue.extend({
	template: `
		<div>page not found, will redirect to index.html in 
			<span style='color:red'>{{seconds}}</span> seconds
		</div>
	`,
	data: function(){
		return {
			seconds: 3
		}
	},
	ready: function(){
		var timer = setInterval(() => {
			this.seconds--;
			if(this.seconds === 0){
				clearInterval(timer);
				this.$router.go('/news');
			}
		}, 1000);
	}
});