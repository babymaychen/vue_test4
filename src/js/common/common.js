var common = {}

common.sendAjax = function(url, params) {
	// do some common staff here
	return $.ajax(url, params).done((result) => {
		if(result.code == 'error_validation'){
			this.showError(result.errorMsg);
		}else{
			// leave the logic to ajax caller
		}
	}).fail(() => {
		this.showError("系统异常");
		console.log("ajax error", err);
	});
}

common.showOverlay = function(){
	$("#overlay").show();
}

common.hideOverlay = function(){
	$("#overlay").hide();
}

common.showError = function(msg){
	$("#errorModal .modal-body").text(msg);
	$("#errorModal").modal("show");
}

export default common