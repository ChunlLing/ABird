$(function () {
	// $('#login-btn').trigger('click');
	$('#reg-btn').trigger('click');
	$('.addNote').click(function () {
		// 获取编辑器
		var ue = UE.getEditor('editor-container');
		ue.ready(function () {
			var html = ue.getContent();
		});
	});
	// $('#login-modal').modal('show');
});