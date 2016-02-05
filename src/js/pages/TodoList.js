import Vue from 'vue';

var TodoList = Vue.extend({
	template: `
		<div class="todolist">
			<div class="todoItem" v-for="todoItem in todos">
				<span>{{todoItem.name}}</span>
				<span @click='deleteHandler($index)' class='batu'>×</span>
			</div>
			<div class="todoForm">
				<span class="todoInput">
					<input type="text" name="" id="" @keyup.enter="addHandler($event)" placeholder='输入内容后，按下回车'/>
				</span>
			</div>
		</div>
	`,
	data: function(){
		return {
			todos:[]
		}
	},
	methods: {
		deleteHandler: function(index){
			this.todos.splice(index, 1);
		},
		addHandler: function(e){
			var todoContent = e.target.value;
			this.todos.push({name: todoContent});
			e.target.value = "";
		}
	}
});

export default TodoList;