import Vue from 'vue';
import common from '../common/common';
import Paging from '../components/Paging';

var PER_PAGE_COUNT = 5;

var BookForm = Vue.extend({
	template: `
		<form action="" class="form-horizontal marginTop20" @submit.prevent='searchHandler'>
			<div class="form-group">
				<label for="booklist_name" class="col-md-1 control-label">书名</label>
				<div class="col-md-5" class='form-control'>
					<input type="text" class='form-control' v-model='searchCondition.name' id='booklist_name' placeholder='请输入书名'/>
				</div>
			</div>
			<div class="form-group">
				<label for="booklist_authorStr" class="col-md-1 control-label">作者</label>
				<div class="col-md-5" class='form-control'>
					<input type="text" class='form-control' v-model='searchCondition.authorName' id='booklist_authorStr' placeholder='作者名，逗号分隔'/>
				</div>
			</div>
			<div class="form-group">
			   <div class="col-sm-offset-1 col-sm-10">
			     <button type="submit" class="btn btn-default">检索</button>
			   </div>
		</form>
	`,
	props:['searchCondition'],
	methods: {
		searchHandler: function(){
			this.$dispatch('do-search');
		}
	}
});

var StatusSel = Vue.extend({
	template: `
		<select v-model='status' @change='changeHandler($event)'>
			<option value="active">Active</option>
			<option value="deleted">Deleted</option>
		</select>
	`,
	data: function(){
		return {
			changingFlg: false,
			oldStatus: null
		}
	},

	props: ['status', 'bookId'],
	ready: function(){
		this.oldStatus = this.status;
	},
	methods: {
		changeHandler: function(e){

			/**
			* jQuery版本的bootstrap不能跟Vuejs完美结合
			* 所以使用到bootstrap js组件的地方可能无法通过数据绑定来控制，
			* 还需要传统的js来控制。
			*/

			// 防止this.statue变更引起onchange无限循环
			if(this.changingFlg == true){
				this.changeFlg = false;
				return;
			}

			// 取得active和deleted状态的件数，表示在modal中
			Promise.all([this.getStatusCount('active'), this.getStatusCount('deleted')]).then((results) => {
				var activeCount = results[0];
				var deletedCount = results[1];
				var modal = $("#confirmModal");
				$('.modal-body', modal).html(`已经有状态的数据<br> Active: ${activeCount} <br> Deleted: ${deletedCount}<br>继续变更？`);
				modal.modal('show');

				// 确认按钮按下
				$('button.ok', modal).off('click').on('click', () => {
					common.sendAjax(`/books/status/${this.bookId}/${this.status}`, {
						method: 'PUT'
					}).done(() => {
						modal.modal('hide');
					}).fail(() => {
						this.status = this.oldStatus;
					}).always(() => {
						this.changingFlg = false;
					})
				});

				// 关闭按钮按下
				$('button.closeModal', modal).off('click').on('click', () =>{
					this.status = this.oldStatus;
					this.changingFlg = false;
				});
			});
		},
		getStatusCount: function(status){
			return new Promise(function(resolve){
				common.sendAjax('/books/status/' + status, {
					method: 'GET'
				}).done((result) => {
					resolve(result.bookCount);
				})
			});
		}
	}
});

var BookDt = Vue.extend({
	template: `
		<table class="table table-hover">
			<thead>
				<tr>
					<th>书名</th>
					<th>作者</th>
					<th>状态</th>
					<th></th>
					<th></th>
				</tr>
			</thead>
			<tbody>
				<tr v-for='book in books'>
					<td>{{book.name}}</td>
					<td>{{formateAuthor(book.authors)}}</td>
					<td>
						<status-sel 
							:status='book.status'
							:book-id='book._id'>
						</status-sel>
					</td>
					<td><button class='btn' data-id="{{book._id}}" @click.prevent='updateHandler($event)'>更新</button></td>
					<td><button class='btn' data-id="{{book._id}}" @click.prevent='deleteHandler($event)'>删除</button></td>
				</tr>
			</tbody>
		</table>
	`,
	components: {
		StatusSel
	},
	props: ['books'],
	methods: {
		formateAuthor: function(authors){
			return authors.map(v => v.name).join(",");
		},
		deleteHandler: function(e){
			var id = $(e.target).attr('data-id');
			this.$dispatch('book-delete', id);
		},
		updateHandler: function(e){
			var id = $(e.target).attr('data-id');
			this.$dispatch('book-to-update', id);
		}
	}
});

var Page = Vue.extend({
	template: `
		<div class="container-fluid">
			<div class="row">
				<div class="col-md-12">
					<book-form 
						:search-condition='searchCondition'
						@do-search='searchHandler'>
					</book-form>
				</div>
			</div>
			<div class="row">
				<div class="col-md-12">
					<paging
						:paging-info='pagingInfo'
						@change-page='pagingHandler'
					></paging>
				</div>
			</div>
			<div class="row">
				<div class="col-md-12">
					<book-dt
						:books='resultData'
						@book-delete="deleteHandler",
						@book-to-update="toUpdateHandler">
					</book-dt>
				</div>
			</div>
		</div>
	`,
	components: {
		BookForm, Paging, BookDt
	},
	data: function() {
		return {
			pagingInfo: {
				perPageCount: PER_PAGE_COUNT,
				totalCount: 0,
				pageNo: 1
			},
			searchCondition: {
				name: "",
				authorName: ""
			},
			resultData: []
		}
	},
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
	methods: {
		search: function({pagingInfo, searchCondition}, callback){
			common.sendAjax("/books/search", {
				method: 'POST',
				data: JSON.stringify({
					searchCondition: searchCondition,
					pagingInfo: pagingInfo
				}),
			}).done((result) => {
				callback(result);
			});
		},
		searchHandler: function(){
			this.pagingInfo.pageNo = 1;
			this.search({
				pagingInfo: this.pagingInfo,
				searchCondition: this.searchCondition
			}, (result) => {
				this.pagingInfo = result.pagingInfo;
				this.resultData = result.results;
			});
		},
		pagingHandler: function(toPageNo){
			this.search({
				pagingInfo: {
					pageNo: toPageNo,
					perPageCount: PER_PAGE_COUNT
				},
				searchCondition: this.searchCondition
			}, (result) => {
				this.pagingInfo = result.pagingInfo;
				this.resultData = result.results;
			});
		},
		deleteHandler: function(deleteId){
			common.sendAjax('/books/' + deleteId, {
				method: 'DELETE'
			}).done(() => {
				this.search({
					pagingInfo: this.pagingInfo,
					searchCondition: this.searchCondition
				}, (result) => {
					this.pagingInfo = result.pagingInfo;
					this.resultData = result.results;
				});
			})
		},
		toUpdateHandler: function(id){
			// 保存检索条件和翻页信息到$router.saveValue中
			// $router.saveValue是自定义的变量
			var pageSv = {
				pagingInfo: this.pagingInfo,
				searchCondition: this.searchCondition
			}
			this.$router.saveValue.booklist = pageSv;

			this.$router.go({path: '/books/edit/' + id});
		}
	}
});


export default Page;