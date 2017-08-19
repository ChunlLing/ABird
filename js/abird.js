$(function () {

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

	$('body').on('show.bs.tab', '#nav-myNote a', navMyNoteShow)
	.on('show.bs.tab', '#nav-groupNotes a', navGroupNotesShow)
	.on('shown.bs.modal', '#remote-modal', remoteModalShown)
	.on('loaded.bs.modal', '#remote-modal', remoteModalLoaded)
	.on('hidden.bs.modal', '#remote-modal', remoteModalHidden)
	.on('click', '.addNote', addNoteClick)
	.on('shown.bs.modal', '#addNote-panel', addNotePanelShown)
	.on('click', '#to-myNote', {target: $('#nav-myNote a')}, toTabShow)
	.on('click', '#to-groupNotes', {target: $('#nav-groupNotes a')}, toTabShow)
	.on('focus', '#reg-username', validateFocus)
	.on('blur', '#reg-username', regUsernameBlur)
	.on('focus', '#reg-useremail', validateFocus)
	.on('blur', '#reg-useremail', regUseremailBlur)
	.on('focus', '#reg-userPSW', validateFocus)
	.on('blur', '#reg-userPSW', regUserPSWBlur)
	.on('focus', '#reg-userPSWAgain', validateFocus)
	.on('blur', '#reg-userPSWAgain', regUserPSWAgainBlur)
	.on('focus', '#reg-userAnswer', validateFocus)
	.on('blur', '#reg-userAnswer', regUserAnswerBlur)
	.on('click', '#reg-submit', regSubmitClick)
	.on('click', '.exit', exitClick)
	.on('click', '#login-submit', loginSubmitClick)
	.on('click', '#edit-submit', editSubmitClick)
	.on('click', '#edit-cancel', editCancelClick)
	.on('click', '#myNote-tabpanel .box.loadMore', boxLoadMoreClick)
	.on('click', '.box .panel-body', boxPanelBodyClick)
	.on('click', '.note-edit', noteEditClick)
	.on('click', '.note-delete', noteDeleteClick)
	.on('blur', '#teamName', teamNameBlur)
	.on('click', '.createGroup', createGroupClick)
	.on('click', '#add-group-submit', addGroupSubmitClick)
	.on('click', '.add-group-note', addGroupNoteClick);
	
	$('#nav-groupNotes a').tab('show');
	// $('#nav-myNote a').tab('show');
	// $('#nav-home a').tab('show');
});

