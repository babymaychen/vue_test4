module.exports = function(){
	Array.prototype.sortArr = function(key, scending){
		var converter = scending === "asc" ? 1 : -1;
		this.sort(function(a, b){
			var aVal = a[key];
			var bVal = b[key];
			if(aVal === bVal){
				return 0;
			}
			if(aVal > bVal){
				return 1 * converter;
			}
			if(aVal < bVal){
				return -1 * converter;
			}
		})
	}
}