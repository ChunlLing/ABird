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
	// $('#nav-groupNotes a').tab('show');
	// $('#nav-myNote a').tab('show');
	$('#nav-home a').tab('show');

	$('body').on('show.bs.tab', '#nav-myNote a', navMyNoteShow)
	.on('show.bs.tab', '#nav-groupNotes a', navGroupNotesShow)
	.on('shown.bs.modal', '#remote-modal', function () {
		$('#reg-useremail').emailList();
	})
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
	.on('click', '#myNote-tabpanel .box.panel', boxPanelClick)
	.on('click', '#myNote-tabpanel .box.loadMore', boxLoadMoreClick)
	.on('click', '.note-edit', noteEditClick)
	.on('click', '.note-delete', noteDeleteClick)
	.on('click', '.box .panel-body', boxPanelBodyClick)
	.on('blur', '#teamName', teamNameBlur)
	.on('click', '.createGroup', function () {
		if (!sessionStorage.name) {
			$('#loading-alert').find('p').remove().end().addClass('alert-info').append('<p>请先登录...</p>').removeClass('hidden');
			setTimeout(function () {
				$('#loading-alert').addClass('hidden').removeClass('alert-info');
				$('#no-login-btn').trigger('click');
			}, 1000);
			return false;
		}
	})
	.on('click', '#add-group-submit', addGroupSubmitClick)
	.on('click', '.add-group-note', function () {
		if (sessionStorage.name) {
			$('#addNote-panel').data('trigger', 'note-group');
		} else {
			$('#loading-alert').find('p').remove().end().addClass('alert-info').append('<p>请先登录...</p>').removeClass('hidden');
			setTimeout(function () {
				$('#loading-alert').addClass('hidden').removeClass('alert-info');
				$('#addNote-panel').modal('hide');
				$('#no-login-btn').trigger('click');
			}, 1000);
			return false;
		}
	});
});

