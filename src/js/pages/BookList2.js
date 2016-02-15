import Vue from 'vue';
import common from '../common/common';
import Paging from '../components/Paging';
import Datatable from '../components/Datatable';

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
					<datatable
						:data-source="resultData",
						:columns="dtColumns">
					</datatable>
				</div>
			</div>
		</div>
	`,
	components: {
		BookForm, Paging, Datatable
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
			resultData: [],
			dtColumns: [{
				id: "name",
				text: "书名"
			},{
				id: "authors",
				text: "作者"
			},{
				id: "status",
				text: "状态"
			}]
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