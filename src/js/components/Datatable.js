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
						<td v-for='columnItem in columns' :title='formatText(dataItem, columnItem)'>

							<!-- button component -->
							<template v-if="columnItem.type === 'button'">
								<button 
									class='btn btn-default' 
									:data-id='dataItem._id' 
									:data-event-name='columnItem.eventName'
									@click='buttonClickHandler($event)'>
										{{columnItem.buttonText}}
								</button>
							</template>

							<!-- select box component -->
							<template v-if="columnItem.type === 'select'">
								<select name="" id="" 
									:value='dataItem.status'
									:data-id='dataItem._id' 
									:data-event-name='columnItem.eventName'
									@change.prevent='statusChangeHandler($event)'>
									<option 
										v-for='dataItem in columnItem.selectDatasource' 
										:value="dataItem.id">
											{{dataItem.text}}
									</option>
								</select>
							</template>
						
							<!-- text display -->
							<template v-if='columnItem.type == undefined'>
								{{formatText(dataItem, columnItem)}}
							</template>
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
		buttonClickHandler: function(e){
			let target = $(e.target);
			let recordId = target.attr('data-id');
			let eventName = target.attr('data-event-name');
			this.$dispatch(eventName, recordId);
		},
		statusChangeHandler: function(e){
			let target = $(e.target);
			let recordId = target.attr('data-id');
			let eventName = target.attr('data-event-name');
			let status = target.val();
			this.$dispatch(eventName, recordId, status, target);
		},
		formatText: function(dataItem, columnItem) {
			let value = dataItem[columnItem.id];
			if(!value){
				return "";
			}
			if(!columnItem.formatter){
				return value;
			}
			return columnItem.formatter.call(null, value);
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
				classArr.push('unselectable');
			}
			return classArr.join(" ");
		}
	}
});

export default Datatable;