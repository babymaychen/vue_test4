import Vue from 'vue';

var Datatable = Vue.extend({
	template: `
		<div class="dtWrapper">
			<table class='table table-hover'>
				<thead>
					<tr>
						<td v-for='columnItem in columns'
							@click='sortHandler(columnItem.id, $event)'
							:class="getClassForHeaderTd(columnItem)">
								{{columnItem.text}}
								<span class='arrow' :class="{asc: isAsc(columnItem), desc: isDesc(columnItem)}"></span>
						</td>
					</tr>
				</thead>
				<tbody>
					<tr v-for='dataItem in dataSource'>
						<td v-for='columnItem in columns'>
							{{formatAuthor(dataItem[columnItem.id])}}
						</td>
					</tr>
				</tbody>
			</table>
	</div>
	`,
	props: ['dataSource', 'columns', 'sortInfo'],
	methods: {
		sortHandler: function(columnName, e){
			if(!$(e.target).hasClass('sortable')){
				return;
			}
			if(this.sortInfo.name === columnName){
				let scending = this.sortInfo.scending;
				scending = scending == "asc" ? "desc" : "asc";
				this.sortInfo.scending = scending;
			}else {
				this.sortInfo = {
					name: columnName,
					scending: 'asc'
				}
			}
			this.$dispatch('dt-sort', this.sortInfo);
		},
		formatAuthor: function(authors) {
			if (typeof authors === 'string') {
				return authors;
			} else {
				return authors.map(v => v.name).join(",");

			}
		},
		isAsc: function(columnItem){
			return columnItem.id == this.sortInfo.name && this.sortInfo.scending === 'asc';
		},
		isDesc: function(columnItem){
			return columnItem.id == this.sortInfo.name && this.sortInfo.scending === 'desc';
		},
		getClassForHeaderTd: function(columnItem){
			var classArr = [];
			classArr.push('col-' + columnItem.id);
			if(columnItem.sortable){
				classArr.push('pointer');
				classArr.push('sortable');
			}
			return classArr.join(" ");
		}
	}
});

export default Datatable;