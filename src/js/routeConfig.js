import Vue from 'vue';

import SubMenuNews from './SubMenuNews';
import SubMenuDemos from './SubMenuDemos';
import SubMenuBooks from './SubMenuBooks';
import SubMenuBooks2 from './SubMenuBooks2';

import News1 from './pages/News1';
import News2 from './pages/News2';
import News3 from './pages/News3';

import BookBox from './pages/BookBox';
import TodoList from './pages/TodoList';

import BookAdd from './pages/BookAdd';
import BookEdit from './pages/BookEdit';
import BookList from './pages/BookList';

import BookAdd2 from './pages/BookAdd2';
import BookEdit2 from './pages/BookEdit2';
import BookList2 from './pages/BookList2';

import PageNotFound from './pages/PageNotFound';


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
		'/books2': {
			component: SubMenuBooks2,
			subRoutes: {
				'/': {
					component: Vue.extend({
						ready: function(){
							this.$router.go({path: '/books2/list'})
						}
					})
				},
				'/list': {
					component: BookList2
				},
				'/add': {
					component: BookAdd2
				},
				'edit/:bookId': {
					component: BookEdit2
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
			transition.next();
		}
	});

	router.saveValue = {};
}