import Vue from 'vue';

var SubMenuDemos = Vue.extend({
	template: `
		<ul class="nav nav-tabs">
			<li role="presentation" v-link="{path: '/demos/bookbox'}">
				<a href="#">BookBox</a>
			</li>
			<li role="presentation" v-link="{path: '/demos/todolist'}">
				<a href="#">TodoList</a>
			</li>
		</ul>
		<router-view></router-view>
	`
});

export default SubMenuDemos;