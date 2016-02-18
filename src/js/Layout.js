import Vue from 'vue'


export default Vue.extend({
	template: `
		<div id="layout">
			<div class="header">this is header</div>
			<div class="mobile-header">this is header (mobile)</div>

			<div id="mainContainer">
				<a 
					href="javascript:void(0)" 
					class="menu-control visible-sm visible-xs"
					@click.prevent='menuControlHandler'></a>
				<div class="container-fluid">
					<div class="row">
						<div class="col-md-2 main-menu" @click='menuClickHandler($event)'>
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
						<div class="col-md-10 col-sm-12">
							<router-view></router-view>
							<div class="mobile-footer">all right reserved 2016 (mobile)</div>
						</div>
					</div>
				</div>
			</div>
			<div class="footer">all right reserved 2016</div>
		</div>

	`,
	ready: function(){
	},
	methods: {
		menuControlHandler: function(){
			$(".main-menu").toggle(200);
		},
		menuClickHandler: function(e){
			let target = $(e.target);
			if(!$(".menu-control").is(":visible")){
				// 大屏幕，menu始终显示
				return;
			}
			if(!target.is("a")){
				// 点击的不是a标签，返回
				return;
			}
			// 关闭menu
			$(".main-menu").toggle(200);
		}
	}
});