import Vue from 'vue';

import News1 from 'pages/news/News1';
import News2 from 'pages/news/News2';
import News3 from 'pages/news/News3';

import BookBox from 'pages/demos/BookBox';
import TodoList from 'pages/demos/TodoList';
import Transition from 'pages/demos/Transition';
import Life from 'pages/demos/Life';

import BookAdd from 'pages/books/BookAdd';
import BookEdit from 'pages/books/BookEdit';
import BookList from 'pages/books/BookList';

import PageNotFound from 'pages/PageNotFound';

import common from 'common/common.js';

/* sub menu for books */
var SubMenuBooks = Vue.extend({
	template: `
		<ul class="nav nav-tabs">
			<li role="presentation" v-link="{path: '/books/list'}">
				<a href="#">书籍一览</a>
			</li>
			<li role="presentation" v-link="{path: '/books/add'}">
				<a href="#">书籍录入</a>
			</li>
		</ul>
		<router-view></router-view>
	`
});

/* sub menu for Demos */
var SubMenuDemos = Vue.extend({
	template: `
		<ul class="nav nav-tabs">
			<li role="presentation" v-link="{path: '/demos/bookbox'}">
				<a href="#">BookBox</a>
			</li>
			<li role="presentation" v-link="{path: '/demos/todolist'}">
				<a href="#">TodoList</a>
			</li>
			<li role="presentation" v-link="{path: '/demos/transition'}">
				<a href="#">过渡</a>
			</li>
			<li role="presentation" v-link="{path: '/demos/life'}">
				<a href="#">生命周期</a>
			</li>
		</ul>
		<router-view></router-view>
	`
});

/* sub menu for news */
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

/*
$router 和 $route 会绑定到每一个router设定的组件上
this.$router.go
this.$route.params
*/
export default function(router){
	router.map({
		'/news': {
			component: SubMenuNews,
			subRoutes: {
				'/news1': {
					component: News1
				},
				'/news2': {
					component: News2
				},
				'/news3': {
					component: News3
				}
			}
		},
		'/demos': {
			component: SubMenuDemos,
			subRoutes: {
				'/bookbox': {
					component: BookBox
				},
				'/todolist': {
					component: TodoList
				},
				'/transition': {
					component: Transition	
				},
				'/life': {
					component: Life	
				}
			}
		},
		'/books': {
			component: SubMenuBooks,
			subRoutes: {
				'/': {
					component: Vue.extend({
						ready: function(){
							this.$router.go({path: '/books/list'})
						}
					})
				},
				'/list': {
					component: BookList
				},
				'/add': {
					component: BookAdd
				},
				'edit/:bookId': {
					component: BookEdit
				}
			}
		},

		// 所有找不到的路径会fallback到这里
		'*': {
			component: PageNotFound
		}

	});

	// 增加路径的快捷方式
	// 默认的 / 路径匹配
	router.redirect({
		'/': '/news',
		'/b': '/books/list'
	});

	// 所有路径的“前”操作
	router.beforeEach((transition) => {
		if(transition.to.path == '/forbidden'){
			// 也许这里需要ajax后台进行判断
			setTimeout(function(){
				console.log("this page is forbidden !");
				transition.abort();
			}, 500);
		}else {
			console.log("-- before each ", transition.to);
			transition.next();
		}
	});

	router.saveValue = {};
}