### 安装 & 启动

- `npm install` 安装依赖

- `npm run dev` 启动webpack-dev-server, 9090端口

- `mongod` 启动数据库

- `cd server & node koa` 启动后台服务器，3000端口

- `cd server & node mongoose_test.js` 做成基本数据

- 访问[http://localhost:3000/index.html](http://localhost:3000/index.html)

- 产品环境build `npm run product` (TODO)

### Vue Demo

- 使用了webpack，没有使用vue-loader

- 使用了jquery 

- 使用了bootstrap表现样式

- 后台使用mongodb(mongoose)

### Demo说明

- 较完整例子  
请看【书籍管理】部分  

	- url [http://localhost:3000/index_dev.html#/books/list](http://localhost:3000/index_dev.html#/books/list)

	- code `src/js/pages/BookList.js`

- 列表画面，有检索和翻页功能  
翻页组件做成了通用组件

- 书籍登陆画面  
录入图书信息
使用jquery-validation做校验(TODO)

- 书籍更新画面  
 更新图书信息

- 画面保值的处理

	- 使用了[vue-router的data钩子函数](http://vuejs.github.io/vue-router/zh-cn/pipeline/data.html)方法  
 	根据迁移元画面的不同，取得画面保持的值，  
 	画面初期值的取得也从ready方法中移动到了data方法中  
 	目前全局的保值对象设定在了`this.$router`上，不知道有没有副作用。
 	```js
	route: {
		data: function(transition) {

			var pagingInfo = this.pagingInfo;
			var searchCondition = this.searchCondition;

			// 如果是从图书编辑画面迁移回来的，需要保存画面的检索条件和翻页信息
			// 从saveValue中取得保存的值
			var prePage = transition.from.path;
			if (new RegExp("/books/edit/.*").test(prePage)) {
				var pageSv = this.$router.saveValue.booklist;
				pagingInfo = pageSv.pagingInfo;
				searchCondition = pageSv.searchCondition;
			}

			// 检索画面初期用数据
			this.search({
				pagingInfo: pagingInfo,
				searchCondition: searchCondition
			}, (result) => {
				transition.next({
					pagingInfo: result.pagingInfo,
					searchCondition: searchCondition,
					resultData: result.results
				})
			});
		}
	},
 	```





