import Vue from 'vue';

/**
* 发出事件 select-change({sel: sel, recordId: recordId})
* 接受事件 
* select-set(val, triggerChangeFlg)
* select-restore(triggerChangeFlg)
*/
var DtSelect = Vue.extend({
	template: `
		<select name="" id="" v-modal='selected' @change='changeHandler($event)'>
			<option value="item.id" v-for='item in dataSource'>{{item.text}}</option>
		</select>
	`,
	props: ['selected', 'dataSource', 'recordId'],
	data: function(){
		return {
			oldValue: null,
			triggerChangeFlg: true
		}
	},
	ready: function(){
		this.oldValue = selected;
	},
	events: {
		selectSet: function(val, triggerChangeFlg =  false){
			if(triggerChangeFlg === false){
				this.triggerChangeFlg = false;
			}
			this.selected = val;
			this.oldValue = val;
		},
		selectRestore: function(triggerChangeFlg = false){
			if(triggerChangeFlg === false){
				this.triggerChangeFlg = false;
			}
			this.selected = this.oldValue;
		}
	},
	methods: {
		changeHandler: function(e){
			if(this.triggerChangeFlg === false){
				return;
			}

			var sel = this.selected;
			this.$dispatch('select-change', {
				sel: sel,
				recordId: this.recordId
			});
		}
	}
});

export default DtSelect;