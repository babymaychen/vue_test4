import Vue from 'vue';
import common from '../common';

var PER_PAGE_COUNT = 2;

var BookForm = Vue.extend({
	template: `
		<form action="" class="form-horizontal marginTop20" @submit.prevent='searchHandler'>
			<div class="form-group">
				<label for="booklist2_name" class="col-md-1 control-label">书名</label>
				<div class="col-md-5" class='form-control'>
					<input type="text" class='form-control' v-model='searchCondition.name' id='booklist2_name' placeholder='请输入书名'/>
				</div>
			</div>
			<div class="form-group">
				<label for="booklist2_authorStr" class="col-md-1 control-label">作者</label>
				<div class="col-md-5" class='form-control'>
					<input type="text" class='form-control' v-model='searchCondition.authorName' id='booklist2_authorStr' placeholder='作者名，逗号分隔'/>
				</div>
			</div>
			<div class="form-group">
			   <div class="col-sm-offset-1 col-sm-10">
			     <button type="submit" class="btn btn-default">检索</button>
			   </div>
		</form>
		</div>
	`,
	props:['searchCondition'],
	methods: {
		searchHandler: function(){
			this.$dispatch('do-search');
		}
	}
});

var Paging = Vue.extend({
	template: `
		<nav v-if='pagingInfo.totalCount > pagingInfo.perPageCount'>
		  <ul class="pagination">
		    <li :class="firstDisabled ? 'disabled' : '' " >
		      <a href="#" aria-label="Previous" 
		      	:data-link='pagingInfo.pageNo -1'
		      	@click.prevent='pagingHandler($event)'>
			        <span aria-hidden="true">&laquo;</span>
		      </a>
		    </li>
		    <li><a href="#" v-for='link in linkArr' @click.prevent='pagingHandler($event)' :data-link='link'>{{link}}</a></li>
		    <li :class="lastDisabled ? 'disabled': ''">
		      <a href="#" aria-label="Next" 
			      :data-link='pagingInfo.pageNo + 1'
			      @click.prevent='pagingHandler($event)'>
			        <span aria-hidden="true">&raquo;</span>
		      </a>
		    </li>
		  </ul>
		</nav>
	`,
	props: ['pagingInfo'],
	computed: {
		linkArr: function(){
			return this.calcLinkArr();
		},
		firstDisabled: function(){
			var linkArr = this.calcLinkArr();
			return linkArr[0] == this.pagingInfo.pageNo;
		},
		lastDisabled: function(){
			var linkArr = this.calcLinkArr();
			return linkArr[linkArr.length - 1] == this.pagingInfo.pageNo;
		}
	},
	methods: {
		pagingHandler: function(e){
			var targetDom = $(e.currentTarget);
			if(targetDom.closest('li').hasClass('disabled')){
				return;
			}
			var pageNo = targetDom.attr('data-link');
			this.$dispatch('change-page', pageNo);
		},
		calcLinkArr: function(){
			let {totalCount, perPageCount, pageNo} = this.pagingInfo;
			var maxPageNo = totalCount % perPageCount == 0 ? totalCount / perPageCount : parseInt(totalCount/ perPageCount,10);
			var pageLinkArr = [];
			pageLinkArr.push(pageNo);

			// find before page numbers
			while(pageLinkArr.length < 5){

				pageNo = pageNo - 1;
				if(pageNo > 0){
					pageLinkArr.push(pageNo);
					continue;
				}else {
					break;
				}
			}
			// find after page numbers
			pageNo = pageLinkArr[0];
			while(pageLinkArr.length < 5){
				pageNo = pageNo + 1;
				if(pageNo <= maxPageNo){
					pageLinkArr.push(pageNo);
					continue;
				}else {
					break;
				}
			}
			return pageLinkArr.sort();
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
					<th></th>
					<th></th>
				</tr>
			</thead>
			<tbody>
				<tr v-for='book in books'>
					<td>{{book.name}}</td>
					<td>{{formateAuthor(book.authors)}}</td>
					<td><button class='btn'>更新</button></td>
					<td><button class='btn'>删除</button></td>
				</tr>
			</tbody>
		</table>
	`,
	props: ['books'],
	methods: {
		formateAuthor: function(authors){
			return authors.map(v => v.name).join(",");
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
						:books='resultData'>
					</book-dt>
				</div>
			</div>
		</div>
	`,
	components: {
		BookForm, Paging, BookDt
	},
	data: function(){
		return {
			searchCondition: {
				name: "",
				authorName: ""
			},
			resultData: [],
			pagingInfo: {
				perPageCount: PER_PAGE_COUNT,
				totalCount: 0,
				pageNo: 1
			}
		}
	},
	methods: {
		searchHandler: function(){
			common.sendAjax("/books/search", {
				method: 'POST',
				data: JSON.stringify({
					searchCondition: this.searchCondition,
					pagingInfo: this.pagingInfo
				}),
			}).done((result) => {
				this.pagingInfo = result.pagingInfo;
				this.resultData = result.results;
			});
		},
		pagingHandler: function(toPageNo){
			common.sendAjax("/books/search", {
				method: 'POST',
				data: JSON.stringify({
					searchCondition: this.searchCondition,
					pagingInfo: {
						pageNo: toPageNo,
						perPageCount: PER_PAGE_COUNT
					}
				})
			}).done((result) => {
				this.pagingInfo = result.pagingInfo;
				this.resultData = result.results;
			});
		}
	}
});


export default Page;