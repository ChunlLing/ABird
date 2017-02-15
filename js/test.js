;$(function () {
	// 编辑器初始化
	var ue = UE.getEditor('post_content', {
		elementPathEnabled : false,
		minFrameWidth : 372,
		toolbars: [['bold', 'italic', 'underline', 'fontborder', 'strikethrough', 'removeformat', 'formatmatch', 'autotypeset', 'blockquote', 'pasteplain', '|', 'selectall', 'cleardoc', 'undo', 'redo']
	],
	});

	// 点击发布
	$('#post-button').click(function () {
		$('#success-dialog').modal('show');
		setTimeout(function () {
			$('#success-dialog').modal('hide');
		}, 3000);
	});
});