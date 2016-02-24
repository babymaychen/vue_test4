### 安装 & 启动

- `npm install` 安装依赖


- `mongod` 启动数据库

- `cd server & node mongoose_test.js` 做成基本数据

- 开发模式启动

	- `npm run dev` 启动webpack-dev-server, 9090端口

	- `cd server & node koa` 启动后台服务器，3000端口

	- 访问[http://localhost:3000/index_dev.html](http://localhost:3000/index_dev.html)


- 产品模式启动

	- `npm run product` 打包资源

	- `cd server & NODE_ENV=product node koa` 启动后台服务器，3000端口

	- 访问[http://localhost:3000/index.html](http://localhost:3000/index.html)


- 从局域网其他设备访问  

	修正，webpack.config.js中的localhost为本机ip  
	修正，index_dev.html中的localhost为本机ip

### 用了什么

- 使用了webpack，没有使用vue-loader

- 使用了vue_router控制路径

- 使用了jquery 

- 使用了bootstrap组件和bootstrap的样式

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
使用jquery-validation做校验

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

### BookList重构 2016/02/16 

- 翻页功能做成了通用组件

	```js
		<paging
			:paging-info='pagingInfo'
			@change-page='pagingHandler'>
		</paging>
	```
	`:pingingInfo`包含`{perPageCount, pageNo, totalCount}`  
	`change-page`是每次翻页触发的事件，传递页码

- datatable做成了通用组件

	```js
		<datatable
			:data-source="resultData",
			:columns="dtColumns"
			:sort-info.sync='sortInfo'
			@dt-sort='sortHandler'
			@record-update='toUpdateHandler'
			@record-delete='deleteHandler'
			@record-status-change='statusChangeHandler'>
		</datatable>
	```
	`:data-source` 数据源  
	`:columns` 每列的定义  
	`:sort-info.sync` 排序的情报，包括`{name: 'userId', scending: 'asc'}`  
	`@dt-sort` 表头排序发出的事件，传递`pagingInfo`  
	`@record-update``@record-delete``@record-status-change`这3个是datatable内容部组件（按钮，选择框等）发出的事件

- datatable中的组件只负责发出事件和提供必要的参数，具体的逻辑都在父组件中进行

### BookList重构 2016/02/24

- html从各个画面的js组件的template中分离出来单独加载

	- html视图和js逻辑的分离（对于vuejs来说是好是坏难说）

	- 分离后的html中的`<img src="" alt="">`可以使用webpack的`url-loader`进行载入和优化了




