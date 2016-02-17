import Vue from 'vue';
import common from '../common/common';
import Paging from '../components/Paging';
import Datatable from '../components/Datatable';
import collections from '../common/collections';

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
		<div class="container-fluid booklist">
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
						:columns="dtColumns"
						:sort-info.sync='sortInfo'
						@dt-sort='sortHandler'
						@record-update='toUpdateHandler'
						@record-delete='deleteHandler'
						@record-status-change='statusChangeHandler'>
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
			dtColumns: getColumnDefs(),
			sortInfo: {
				name: "name",
				scending: "asc"
			}
		}
	},
	route: {
		data: function(transition) {

			var pagingInfo = this.pagingInfo;
			var searchCondition = this.searchCondition;
			var sortInfo = this.sortInfo;

			// 如果是从图书编辑画面迁移回来的，需要保存画面的检索条件和翻页信息
			// 从saveValue中取得保存的值
			var prePage = transition.from.path;
			if (new RegExp("/books/edit/.*").test(prePage)) {
				var pageSv = this.$router.saveValue.booklist;
				pagingInfo = pageSv.pagingInfo;
				searchCondition = pageSv.searchCondition;
				sortInfo = pageSv.sortInfo;
			}

			// 检索画面初期用数据
			this.search({
				pagingInfo: pagingInfo,
				searchCondition: searchCondition,
				sortInfo: sortInfo
			}, (result) => {
				transition.next({
					pagingInfo: result.pagingInfo,
					searchCondition: searchCondition,
					resultData: result.results,
					sortInfo: sortInfo
				})
			});
		}
	},
	methods: {
		search: search,
		searchHandler: searchHandler ,
		pagingHandler: pagingHandler,
		sortHandler: sortHandler,
		deleteHandler: deleteHandler,
		toUpdateHandler: toUpdateHandler,
		statusChangeHandler: statusChangeHandler,

	}
});

function getColumnDefs() {
	return [{
			id: "name",
			text: "书名",
			sortable: true
		}, {
			id: "authors",
			text: "作者",
			formatter: authorsFormatter,
			sortable: true
		},

		// status select box
		{
			id: "status",
			text: "状态",
			type: "select",
			selectDatasource: collections.STATUS,
			eventName: "record-status-change"
		},

		// update button
		{
			id: "btnUpdate",
			text: "",
			type: "button",
			buttonText: "更新",
			eventName: "record-update"
		},

		// delete button
		{
			id: "btnDelete",
			text: "",
			type: "button",
			buttonText: "删除",
			eventName: "record-delete"
		}
	];
}

function search({pagingInfo, searchCondition, sortInfo}, callback) {
	common.sendAjax("/books/search", {
		method: 'POST',
		data: JSON.stringify({
			searchCondition: searchCondition,
			pagingInfo: pagingInfo,
			sortInfo: sortInfo
		}),
	}).done((result) => {
		callback(result);
	});
}

function searchHandler() {
	this.pagingInfo.pageNo = 1;
	search({
		pagingInfo: this.pagingInfo,
		searchCondition: this.searchCondition,
		sortInfo: this.sortInfo
	}, (result) => {
		this.pagingInfo = result.pagingInfo;
		this.resultData = result.results;
	});
}

function pagingHandler(toPageNo) {
	search({
		pagingInfo: {
			pageNo: toPageNo,
			perPageCount: PER_PAGE_COUNT
		},
		searchCondition: this.searchCondition,
		sortInfo: this.sortInfo
	}, (result) => {
		this.pagingInfo = result.pagingInfo;
		this.resultData = result.results;
	});
}

function sortHandler(sortInfo) {
	this.pagingInfo.pageNo = 1;
	search({
		pagingInfo: this.pagingInfo,
		searchCondition: this.searchCondition,
		sortInfo: sortInfo
	}, (result) => {
		this.pagingInfo = result.pagingInfo;
		this.resultData = result.results;
	});
}

function deleteHandler(deleteId) {
	common.sendAjax('/books/' + deleteId, {
		method: 'DELETE'
	}).done(() => {
		search({
			pagingInfo: this.pagingInfo,
			searchCondition: this.searchCondition,
			sortInfo: this.sortInfo
		}, (result) => {
			this.pagingInfo = result.pagingInfo;
			this.resultData = result.results;
		});
	})
}

function toUpdateHandler(id) {
	// 保存检索条件和翻页信息到$router.saveValue中
	// $router.saveValue是自定义的变量
	var pageSv = {
		pagingInfo: this.pagingInfo,
		searchCondition: this.searchCondition,
		sortInfo: this.sortInfo
	}
	this.$router.saveValue.booklist = pageSv;

	this.$router.go({
		path: '/books/edit/' + id
	});
}

function statusChangeHandler(id, status, target) {
	// 取得active和deleted状态的件数，表示在modal中
	Promise.all([getStatusCount('active'), getStatusCount('deleted')]).then((results) => {
		var activeCount = results[0];
		var deletedCount = results[1];
		var modal = $("#confirmModal");
		$('.modal-body', modal).html(`已经有状态的数据<br> Active: ${activeCount} <br> Deleted: ${deletedCount}<br>继续变更？`);
		modal.modal('show');

		// 确认按钮按下
		$('button.ok', modal).off('click').on('click', () => {
			common.sendAjax(`/books/status/${id}/${status}`, {
				method: 'PUT'
			}).done(() => {
				modal.modal('hide');
				search({
					pagingInfo: this.pagingInfo,
					searchCondition: this.searchCondition,
					sortInfo: this.sortInfo
				}, (result) => {
					this.pagingInfo = result.pagingInfo;
					this.resultData = result.results;
				});
			});
		});

		// 关闭按钮按下
		$('button.closeModal', modal).off('click').on('click', () => {
			var oldStatus = this.resultData.filter(v => v._id == id)[0].status;
			target.val(oldStatus);
			modal.modal("hide");
		});
	});
}

function getStatusCount(status) {
	return new Promise(function(resolve) {
		common.sendAjax('/books/status/' + status, {
			method: 'GET'
		}).done((result) => {
			resolve(result.bookCount);
		})
	});
}

function authorsFormatter(authors) {
	if (!authors) {
		return "";
	}
	if (typeof authors === 'string') {
		return authors;
	}
	return authors.map(v => v.name).join(",");
}

export default Page;