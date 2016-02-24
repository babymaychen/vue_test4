var common = {}

common.sendAjax = function(url, params) {
	// do some common staff here
	return $.ajax(url, params).done((result) => {
		if(result.code == 'error_validation'){
			showError(result.errorMsg);
		}else{
			// leave the logic to ajax caller
		}
	}).fail(() => {
		showError("系统异常");
		console.log("ajax error", err);
	});
}

function showError(msg){
	$("#errorModal .modal-body").text(msg);
	$("#errorModal").modal("show");
}

export default common