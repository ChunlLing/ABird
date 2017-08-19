function navMyNoteShow() {
	if ((!$('#note-container').html()) && sessionStorage.getItem('name')) {
		$.post('data/show_note.php', {start: 0, count: 4, user: sessionStorage.name}, function (response) {
			for (var i = 0; i < response.length; i++) {
				createNoteBox(response[i], i, response);
			}
		}, 'json');
	}
}

function navGroupNotesShow() {
	if ((!$('#groupNotes-sm').html()) && sessionStorage.getItem('name')) {
		$.post('data/show_group.php', {user: sessionStorage.name}, function (response) {
			for (var i = 0; i < response.length; i++) {
				(function (info, index) {
					$.get('tpl/group-item.html', function (html) {
						$('#groupNotes-sm').append(html);
						$('.group-name').eq(index).data('id', info.id).data('team', info.team).data('master', info.master).data('description', info.description).data('date', info.date).attr('href', '#myGroup'+info.id).text(info.team);
						$('.groupNote-tabpanel-right .notes-container .tab-content').append('<div id="myGroup' + info.id +'" class="tab-pane" role="tabpanel"></div>');
					}).done(function () {
							$('a.group-name').first().tab('show');
					});
				})(response[i], i);
			}
		}, 'json');
		$('#groupNote-tabpanel').on('shown.bs.tab', 'a.group-name', function () {
			if ((!$($(this).attr('href')).html())) {
				var options = {
					start: 0, 
					count: 3, 
					user: sessionStorage.name, 
					gid: $('.group-item.active').find('.group-name').data('id')
				};
				$.post('data/show_noteG.php', options, function (res) {
					for (var j = 0; j < res.length; j++) {
						createNoteBox(res[j], j);
					}
				}, 'json');
			}
		});
	}
}

function remoteModalShown(e) {
	if ($(e.relatedTarget).attr('id') == 'login-reg-btn') {
		$('#reg-useremail').emailList();
	} else if ($(e.relatedTarget).hasClass('panel-body')) {
		$('#remote-modal .note-title').text($(e.relatedTarget).parents('.panel').find('.panel-title').text());
		$('#remote-modal .note-content').html($(e.relatedTarget).parents('.panel').data('content'));
	}
}

function remoteModalLoaded() {
	if (sessionStorage.getItem('name')) {
		setUserLogin();
	}
}


function remoteModalHidden() {
	$(this).removeData('bs.modal');
}

function addNoteClick() {
	if ($('#addNote-panel').data('trigger') != 'note-edit') {
		if (sessionStorage.name) {
			$('.panel.box.note-active').removeClass('note-active');
			$('#addNote-panel').data('trigger', 'addNote');
		} else {
			$('#loading-alert').find('p').remove().end().addClass('alert-info').append('<p>请先登录...</p>').removeClass('hidden');
			setTimeout(function () {
				$('#loading-alert').addClass('hidden').removeClass('alert-info');
				$('#addNote-panel').modal('hide');
				$('#no-login-btn').trigger('click');
			}, 1000);
		}
	}
}

function addNotePanelShown() {
	var title, label, html, txt;
	switch ($(this).data('trigger')) {
		case 'addNote':
			title = $('.edit-title').val();
			label = $('.modal-title select').val();
			html = getContent(ue);
			if (title || (label != 'default') || html) {
				if (!confirm("您上次编辑的内容尚未保存，是否继续编辑？")) {
					clearContent(ue, $('#edit-form'));
				}
			}
			break;
		case 'note-edit':
		case 'note-group':
			var $panelBoxs = $('.panel.box.note-active');
			$('.edit-title').val($panelBoxs.data('title'));
			$('.modal-title select').val($panelBoxs.data('label'));
			$('#edit-txt').val($panelBoxs.data('txt'));
			$('#edit-id').val($panelBoxs.data('id'));
			ue.setContent($panelBoxs.data('content'));
			break;
	}
}

function toTabShow(e) {
	e.data.target.tab('show');
}

function validateFocus(e) {
	formControllerFocus($(this));
}

function regUsernameBlur() {
	var $this = $(this);
	if (formControllerBlur($(this), /[\w\u4e00-\u9fa5]/, '用户名不得包含非法字符！')) {
		$.post('data/is_user.php', {user: $(this).val()}, function (response) {
			if (response['status']) {
				formControllerBlur($this, 'false', '该用户名已被注册，请重新填写！');
			}
		}, 'json');
	}
}

function regUseremailBlur() {
	$('.email-list').addClass('hidden');
	formControllerBlur($(this), /^[\w]+@[\w]{2,8}\.[\w]{2,3}$/, '邮箱格式不正确！');
}

function regUserPSWBlur() {
	formControllerBlur($(this), /^[\w]{6,20}$/, '密码长度必须在6-20位之间！');
	if ($(this).val() && $('#reg-userPSWAgain').val() && formControllerBlur($(this), /^[\w]{6,20}$/, '密码长度必须在6-20位之间！')) {
		$('#reg-userPSWAgain').trigger('focus').trigger('blur');
	}
}

function regUserPSWAgainBlur() {
	if (formControllerBlur($(this), "$('#reg-userPSWAgain').val() == $('#reg-userPSW').val()", '两次输入密码不一致！')) {
		formControllerBlur($(this), /^[\w]{6,20}$/, '密码长度必须在6-20位之间！');
	}
}

function regUserAnswerBlur() {
	formControllerBlur($(this), 'true');
}

function regSubmitClick() {
	var option = {
		type: 'POST',
		data: $('#reg-form').serialize(),
		dataType: 'json',
		url: 'data/add_user.php',
		beforeSubmit: function () {
			$('#loading-alert').addClass('alert-info').append('<p>数据提交中 <i class="icon-spinner"></i></p>').removeClass('hidden');
			$(':submit').attr('disabled', 'disabled');
		},
		success: function (response) {
			$('#loading-alert p').remove();
			$('#loading-alert').removeClass('alert-info').addClass('alert-success').append('<p>数据保存成功！ <i class="icon-ok"></i></p>');
			setTimeout(function () {
				$(':submit').removeAttr('disabled');
				$('#loading-alert').addClass('hidden').removeClass('alert-success').find('p').remove();
				sessionStorage.setItem('name', response['user']);
				sessionStorage.setItem('email', response['email']);
				sessionStorage.setItem('total', '1000');
				sessionStorage.setItem('used', Math.floor(Math.random()*1000));
				isLogin();
				$('#remote-modal').modal('hide');
				resetForm($('#reg-form'));
			}, 2000);
		}
	};
	if (!$('#reg-form .form-group').is('.has-error')) {
		if ($('#reg-form  input').filter(function () {return !$(this).val()}).length == 0) {
			$('#reg-form').ajaxForm(option);
		}
	}
}

function exitClick() {
	sessionStorage.clear();
	isExit();
}

function loginSubmitClick() {
	var option = {
		type: 'POST',
		data: $('#login-form').serialize(),
		dataType: 'json',
		url: 'data/login.php',
		beforeSubmit: function () {
			$('#loading-alert').addClass('alert-info').append('<p>数据提交中 <i class="icon-spinner"></i></p>').removeClass('hidden');
			$(':submit').attr('disabled', 'disabled');
		},
		success: function (response) {
			if (response['status']) {
				$('#loading-alert p').remove();
				$('#loading-alert').removeClass('alert-info').addClass('alert-success').append('<p>数据保存成功！ <i class="icon-ok"></i></p>');
				setTimeout(function () {
					$(':submit').removeAttr('disabled');
					$('#loading-alert').addClass('hidden').removeClass('alert-success').find('p').remove();
					sessionStorage.setItem('name', response['user']);
					sessionStorage.setItem('email', response['email']);
					sessionStorage.setItem('total', '1000');
					sessionStorage.setItem('used', Math.floor(Math.random()*1000));
					isLogin();
					$('#remote-modal').modal('hide');
					resetForm($('#login-form'));
				}, 2000);
			} else {
				$('#login-form .form-group').addClass('has-feedback');
				formControllerBlur($('#username'), 'false', '');
				formControllerBlur($('#userPSW'), 'false', '用户名或密码错误，请重新输入！');
			}
		}
	};
	if ($('#username').val() && $('#userPSW').val()) {
		$('#login-form').ajaxForm(option);
	} else {
		if (!$(this).next('span').html()) {
			$(this).after('<span class="text-danger"> 请填写完整的登录信息！</span>');
		}
		return false;
	}
}

function editSubmitClick() {
	var option = {
		type: 'POST',
		data: $('#edit-form').serialize(),
		dataType: 'json',
		beforeSubmit: function () {
			$('#loading-alert').addClass('alert-info').append('<p>数据提交中 <i class="icon-spinner"></i></p>').removeClass('hidden');
			$('button:visible').attr('disabled', 'disabled');
		},
		success: function (response) {
			$('#loading-alert p').remove();
			$('#loading-alert').removeClass('alert-info').addClass('alert-success').append('<p>数据保存成功！ <i class="icon-ok"></i></p>');
			setTimeout(function () {
				createNoteBox(response);
				$('button:visible').removeAttr('disabled');
				$('#addNote-panel').modal('hide');
				$('#loading-alert').addClass('hidden').removeClass('alert-success').find('p').remove();
				clearContent(ue, $('#edit-form'));
			}, 2000);
		}
	}
	if ($('.edit-title').val() == '') {
		// 若笔记标题没有修改，默认为‘未命名’（即placeholder属性的值）
		$('.edit-title').val($('.edit-title').attr('placeholder'));
	}
	$('#edit-txt').val(getContentTxt(ue));
	$('#edit-user').val(sessionStorage.name);
	$('#edit-trigger').val($('#addNote-panel').data('trigger'));

	switch ($('#addNote-panel').data('trigger')) {
		case 'addNote':		// 通过点击添加个人笔记触发的编辑面板
		case 'note-edit':	// 通过点击个人笔记预览框触发的编辑面板
			$('#edit-type').val('personal');
			$('.panel.box.note-active').remove();
			option['url'] = 'data/add_note.php';
			break;
		case 'note-group':	// 通过点击添加群组笔记触发的编辑面板
			$('#edit-type').val('group');
			option['url'] = 'data/add_noteG.php';
			$('#edit-master').val(sessionStorage.name);
			$('#edit-team').val($('.group-item.active').find('.group-name').data('team'));
			$('#edit-gid').val($('.group-item.active').find('.group-name').data('id'));
			break;
	}
	$('#edit-form').ajaxForm(option);

	$('#addNote-panel').removeData('trigger');
}

function editCancelClick() {
	switch ($(this).parents('#addNote-panel').data('trigger')) {
		case 'addNote' :
			var title = $('.edit-title').val();
			var label = $('.modal-title select').val();
			var html = getContent(ue);
			if (html || title || (label != 'default')) {
				if (confirm("是否清除所编辑的内容？")) {
					clearContent(ue, $('#edit-form'));
				}
			}
			break;
		case 'note-edit' : 
			var $panelBoxs = $('.panel.box.note-active');
			var title = $('.edit-title').val();
			var label = $('.modal-title select').val();
			var html = getContent(ue);
			if ((title != $panelBoxs.data('title')) || (label != $panelBoxs.data('label')) || (html != $panelBoxs.data('content'))) {
				if (confirm("您编辑的内容尚未保存，是否保存？")) {
					$('#edit-submit').trigger('click');
				}
			}
			break;
	}
}

function boxLoadMoreClick() {
	var $this = $(this);
	var count = 5;
	var oldNum = $('#note-container .box.panel').length+1;
	$.post('data/show_note.php', {start: oldNum, count: count, user: sessionStorage.name}, function (response) {
		var length = response.length;
		for (var i = 0; i < response.length; i++) {
			createNoteBox(response[i], i, response, count);
		}
		if (length < count) {
			$this.remove();
			$('#loading-alert').addClass('alert-info').append('<p>没有更多数据了 ┐(ﾟ～ﾟ)┌ </p>').removeClass('hidden');
			setTimeout(function () {
				$('#loading-alert').addClass('hidden').removeClass('alert-info').find('p').remove();
			}, 1000);
		}
	}, 'json');
}

function noteEditClick() {
	var $this = $(this);
	switch ($('.box.note-active').data('type')) {
		case 'personal' :
			$('#addNote-panel').data('trigger', 'note-edit');
			break;
		case 'group' :
			$('#addNote-panel').data('trigger', 'note-group');
			break;
	}
	$('#remote-modal').modal('hide');
}

function noteDeleteClick() {
	if (confirm('是否要删除该笔记？')) {
		var id = $(this).parent().hasClass('panel-heading') ? $(this).parents('.box.panel').data('id') : $('.panel.box.note-active').data('id');
		var $this = $(this);
		var url = ($this.parents('.box').data('type') == 'personal') ? 'data/delete_note.php' : 'data/delete_noteG.php';
		$.post(url, {id: id}, function () {
			if ($this.parent().hasClass('panel-heading')) {
				$this.parents('.box.panel').remove();
			} else {
				$('#remote-modal').modal('hide');
				$('.panel.box.note-active').remove();
			}
		});
	}
}

function boxPanelBodyClick() {
	$('.panel.box.note-active').removeClass('note-active');
	$(this).parents('.box').addClass('note-active');
}

function teamNameBlur() {
	formControllerBlur($(this), /[\w\u4e00-\u9fa5]/, '群组名不得包含非法字符！');
}

function createGroupClick() {
	if (!sessionStorage.name) {
		$('#loading-alert').find('p').remove().end().addClass('alert-info').append('<p>请先登录...</p>').removeClass('hidden');
		setTimeout(function () {
			$('#loading-alert').addClass('hidden').removeClass('alert-info');
			$('#no-login-btn').trigger('click');
		}, 1000);
		return false;
	}
}

function addGroupNoteClick() {
	if (sessionStorage.name) {
		$('#addNote-panel').data('trigger', 'note-group');
		$('.panel.box.note-active').removeClass('note-active');
	} else {
		$('#loading-alert').find('p').remove().end().addClass('alert-info').append('<p>请先登录...</p>').removeClass('hidden');
		setTimeout(function () {
			$('#loading-alert').addClass('hidden').removeClass('alert-info');
			$('#addNote-panel').modal('hide');
			$('#no-login-btn').trigger('click');
		}, 1000);
		return false;
	}
}

function addGroupSubmitClick() {
	if ($('#teamName').val()) {
		$('#teamMaster').val(sessionStorage.name);
		var option = {
			type: 'POST',
			data: $('#add-group-form').serialize(),
			dataType: 'json',
			url: 'data/add_group.php',
			success: function (response) {
				$('#remote-modal').modal('hide');
				(function (info) {
					$.get('tpl/group-item.html', function (html) {
						$('#groupNotes-sm').prepend(html);
						$('.group-name').eq(0).attr('href', '#myGroup'+info.id).data('id', info.id).data('team', info.team).data('master', info.master).data('description', info.description).data('date', info.date).attr('href', '#myGroup'+info.id).text(info.team);
						$('.groupNote-tabpanel-right .notes-container .tab-content').append('<div id="myGroup' + info.id +'" class="tab-pane" role="tabpanel"></div>');
					});
				})(response);
			}
		};
		$('#add-group-form').ajaxForm(option);
	} else {
		if (!$(this).next('span').html()) {
			$(this).after('<span class="text-danger"> 请填写群组名称！</span>');
		}
		return false;
	}
}