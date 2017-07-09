$(function () {
	$('.addNote').click(function () {
		// 获取编辑器
		var ue = UE.getEditor('editor-container');
		ue.ready(function () {
			var html = ue.getContent();
		});
	});

	$('#loginModal').modal('show');
});