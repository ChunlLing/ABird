$(function () {
	// $('#login-btn').trigger('click');
	// $('#reg-btn').trigger('click');
	$('#nav-list a[data-toggle="tab"]').on('show.bs.tab', function (e) {
		var url = $(this).attr('href');
		var target = $(this).data('target');
		var tab = $(this);
		$(target).load(url, function (result) {
			tab.tab('show');
			$('.addNote').click(function () {
				// 获取编辑器
				var ue = UE.getEditor('editor-container');
				ue.ready(function () {
					var html = ue.getContent();
				});
				console.log('12');
			});
			$('#to-myNote').click(function () {
				$('#nav-myNote a').tab('show');
			});
		});
	});
	$('#nav-home a').tab('show');
	$('body').on('hidden.bs.modal', '#remote-modal', function () {
		$(this).removeData('bs.modal');
	});
});