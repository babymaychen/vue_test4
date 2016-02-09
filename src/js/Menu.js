import Vue from 'vue'


export default Vue.extend({
	template: `
		<div class="container-fluid">
			<div class="row">
				<div class="col-sm-2">
					<ul class="nav nav-pills nav-stacked">
						<li role="presentation" v-link="{path: '/news'}">
							<a href="#">新闻</a>
						</li>
						<li role="presentation" v-link="{path: '/demos'}">
							<a href="#">Demos</a>
						</li>
						<li role="presentation" v-link="{path: '/books'}">
							<a href="#">书籍管理</a>
						</li>
					</ul>
				</div>
				<div class="col-sm-10">
					<router-view></router-view>
				</div>
			</div>

		<!-- Modal -->
		<div class="modal fade" id="confirmModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel">
		  <div class="modal-dialog" role="document">
		    <div class="modal-content">
		      <div class="modal-header">
		        <h4 class="modal-title" id="myModalLabel">操作确认</h4>
		      </div>
		      <div class="modal-body">
		      </div>
		      <div class="modal-footer">
		        <button type="button" class="btn btn-default closeModal" data-dismiss="modal">关闭</button>
		        <button type="button" class="btn btn-primary ok">确认</button>
		      </div>
		    </div>
		  </div>
		</div>


		</div>
	`,

	ready: function(){
		// bootstrap要求所有的modal是body的直接子元素
		$('div.modal', this.$el).detach().appendTo($(document.body));
	}
});