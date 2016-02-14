import Vue from 'vue';

var SelectConfirm = Vue.extend({
	template: `
		<select name="" id="" v-modal='selected' @change='changeHandler($event)'>
			<option value="item.id" v-for='item in dataSource'>{{item.text}}</option>
		</select>
	`,
	props: ['selected', 'dataSource'],
	data: function(){
		return {
			oldValue: null
		}
	},
	methods: {
		changeHandler: function(e){
			var sel = this.selected;
			var recordId = this.recordId;
			this.$dispatch('select-change', {
				recordId: recordId,
				sel: sel
			});
		}
	}
});

export default SelectConfirm;