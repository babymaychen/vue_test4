import Vue from 'vue';

var SubMenuNews = Vue.extend({
	template: `
		<ul class="nav nav-tabs">
			<li role="presentation" v-link="{path: '/news/news1'}"><a href="#">新闻1</a></li>
			<li role="presentation" v-link="{path: '/news/news2'}"><a href="#">新闻2</a></li>
			<li role="presentation" v-link="{path: '/news/news3'}"><a href="#">新闻3</a></li>
		</ul>
		<router-view></router-view>
	`
});

export default SubMenuNews;