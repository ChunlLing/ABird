$(function () {
	$('#userSetting-modal').modal('show');
	$('#userSetting-modal-label a').click(function (e) {
		e.preventDefault();
		$(this).tab('show');
	});
});