var common = {}

common.sendAjax = function(url, params) {
	// do some common staff here
	return $.ajax(url, params).fail(function(err){
		console.log("ajax error", err);
	});
}

export default common