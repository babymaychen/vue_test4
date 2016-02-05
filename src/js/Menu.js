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
						<li role="presentation" v-link="{path: '/books2'}">
							<a href="#">书籍管理(2)</a>
						</li>
					</ul>
				</div>
				<div class="col-sm-10">
					<router-view></router-view>
				</div>
			</div>

		</div>
	`
});