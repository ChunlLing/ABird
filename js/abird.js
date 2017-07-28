$(function () {
	var ue = null;

	$('#nav-list a[data-toggle="tab"]').on('show.bs.tab', function (e) {
		var url = $(this).attr('href');
		var target = $(this).data('target');
		var tab = $(this);
		if (!$(target).html()) {
			(function () {
				$(target).load(url, function (result) {
					if (sessionStorage.getItem('name')) {
						isLogin();
					}
					tab.tab('show');
				});
			})();
		}
	});
	// $('#nav-groupNotes a').tab('show');
	// $('#nav-myNote a').tab('show');
	$('#nav-home a').tab('show');

	$('body').on('show.bs.tab', '#nav-myNote a', navMyNoteShow)
	.on('show.bs.tab', '#nav-groupNotes a', navGroupNotesShow)
	.on('loaded.bs.modal', '#remote-modal', remoteModalLoaded)
	.on('hidden.bs.modal', '#remote-modal', remoteModalHidden)
	.on('click', '.addNote', addNoteClick)
	.on('shown.bs.modal', '#addNote-panel', addNotePanelShown)
	.on('click', '#to-myNote', toMyNoteClick)
	.on('click', '#to-groupNotes', toGroupNotesClick)
	.on('focus', '#reg-username', regUsernameFocus)
	.on('blur', '#reg-username', regUsernameBlur)
	.on('focus', '#reg-useremail',regUseremailFocus)
	.on('blur', '#reg-useremail', regUseremailBlur)
	.on('keydown', '#reg-useremail', regUseremailKeydown)
	.on('mousedown', '.email-list-item', emailListItemMousedown)
	.on('focus', '#reg-userPSW', regUserPSWFocus)
	.on('blur', '#reg-userPSW', regUserPSWBlur)
	.on('focus', '#reg-userPSWAgain', regUserPSWAgainFocus)
	.on('blur', '#reg-userPSWAgain', regUserPSWAgainBlur)
	.on('focus', '#reg-userAnswer', regUserAnswerFocus)
	.on('blur', '#reg-userAnswer', regUserAnswerBlur)
	.on('click', '#reg-submit', regSubmitClick)
	.on('click', '.exit', exitClick)
	.on('click', '#login-submit', loginSubmitClick)
	.on('click', '#edit-submit', editSubmitClick)
	.on('click', '#edit-cancel', editCancelClick)
	.on('click', '#myNote-tabpanel .box.panel', boxPanelClick)
	.on('click', '#myNote-tabpanel .box.loadMore', boxLoadMoreClick)
	.on('click', '.note-edit', noteEditClick)
	.on('click', '.note-delete', noteDeleteClick)
	.on('click', '.box .panel-body', boxPanelBodyClick)
	.on('blur', '#teamName', teamNameBlur)
	.on('click', '#add-group-submit', addGroupSubmitClick);
});

