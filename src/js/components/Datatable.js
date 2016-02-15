import Vue from 'vue';

var Datatable = Vue.extend({
	template: `
		<div class="dtWrapper">
			<table class='table table-hover'>
				<thead>
					<tr>
						<td v-for='columnItem in columns'>
							{{columnItem.text}}
							<span :class="{sortable: columnItem.sortable, 
								asc: columnItem.name === sortInfo.name && sortInfo.scending == 'asc',
								desc: columnItem.name === sortInfo.name && sortInfo.scending == 'desc'}"></span>
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
		formatAuthor: function(authors) {
			if (typeof authors === 'string') {
				return authors;
			} else {
				return authors.map(v => v.name).join(",");

			}
		}
	}
});

export default Datatable;