import Vue from 'vue';

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
		    <li :class="{'active': link == pagingInfo.pageNo}" v-for='link in linkArr'>
		    	<a href="#"  
		    		@click.prevent='pagingHandler($event)' 
		    		:data-link='link'>
		    		{{link}}
	    		</a>
	    	</li>
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
			var maxPageNo = totalCount % perPageCount == 0 ? totalCount / perPageCount : parseInt(totalCount/ perPageCount,10) + 1;
			var pageLinkArr = [];

			var beforeMissing = 1 - (pageNo - 2);
			beforeMissing = beforeMissing < 0 ? 0 : beforeMissing;
			var afterMissing = (pageNo + 2) - maxPageNo;
			afterMissing = afterMissing < 0 ? 0 : afterMissing;
			var start = pageNo - 2 - afterMissing;
			if(start < 1){
				start = 1;
			}
			var end = pageNo + 2 + beforeMissing;
			if(end > maxPageNo){
				end = maxPageNo;
			}
			for (var i = start; i <= end; i++) {
				pageLinkArr.push(i);
			};
			return pageLinkArr;
		}
	}
});

export default Paging;