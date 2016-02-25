import Vue from 'vue';

import SubMenuNews from 'pages/news/SubMenuNews';
import News1 from 'pages/news/News1';
import News2 from 'pages/news/News2';
import News3 from 'pages/news/News3';

import SubMenuDemos from 'pages/demos/SubMenuDemos';
import BookBox from 'pages/demos/BookBox';
import TodoList from 'pages/demos/TodoList';
import Transition from 'pages/demos/Transition';

import SubMenuBooks from 'pages/books/SubMenuBooks';
import BookAdd from 'pages/books/BookAdd';
import BookEdit from 'pages/books/BookEdit';
import BookList from 'pages/books/BookList';

import PageNotFound from 'pages/PageNotFound';

import common from 'common/common.js';


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
		common.showOverlay();
		if(transition.to.path == '/forbidden'){
			// 也许这里需要ajax后台进行判断
			setTimeout(function(){
				console.log("this page is forbidden !");
				transition.abort();
			}, 500);
		}else {
			transition.next();
		}
	});

	// 所有操作的“后”操作
	router.afterEach((transition) => {
		common.hideOverlay();
	})

	router.saveValue = {};
}