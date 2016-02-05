import Vue from 'vue';

var SubMenuOthers = Vue.extend({
	template: `
		<ul class="nav nav-tabs">
			<li role="presentation" v-link="{path: '/books2/list'}">
				<a href="#">书籍一览</a>
			</li>
			<li role="presentation" v-link="{path: '/books2/add'}">
				<a href="#">书籍录入</a>
			</li>
		</ul>
		<router-view></router-view>
	`
});

export default SubMenuOthers;