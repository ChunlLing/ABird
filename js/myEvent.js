function navMyNoteShow() {
	if ((!$('#note-container').html()) && sessionStorage.getItem('name')) {
		$.post('data/show_note.php', {start: 0, count: 4, user: sessionStorage.name}, function (response) {
			for (var i = 0; i < response.length; i++) {
				(function (info, index) {
					if (info.type == 'personal') {
						$.get('tpl/note-box.html', function (html) {
							$('#note-container').append(html);
							$('#myNote-tabpanel .panel.box').eq(index).addClass('panel-' + info.label).data('content', info.content).find('.panel-title').text(info.title).end().find('.note-txt').text(info.txt).end().data('title', info.title).data('label', info.label).data('txt', info.txt).data('id', info.id);
							if (index == response.length-1 && response.length == 4) {
								$.get('tpl/loadMore-box.html', function (loadMore) {
									$('#myNote-tabpanel .panel.box').last().after(loadMore);
								});
							}
						});
					}
				})(response[i], i);
			}
		}, 'json');
	}
}

function navGroupNotesShow() {
	if ((!$('#groupNotes-sm').html())) {
		$.post('data/show_group.php', {user: sessionStorage.name}, function (response) {
			for (var i = 0; i < response.length; i++) {
				(function (info, index) {
					$.get('tpl/group-item.html', function (html) {
						$('#groupNotes-sm').append(html);
						$('.group-name').eq(index).data('id', info.id).data('team', info.team).data('master', info.master).data('description', info.description).data('date', info.date).attr('href', '#myGroup'+info.id).text(info.team);
						$('.groupNote-tabpanel-right .notes-container').append('<div id="myGroup' + info.id +'" class="tab-pane" role="tabpanel"><div class="notes">'+Math.random()*10+'</div></div>');
						if (index == response.length-1) {
							$('.group-item').first().find('a.group-name').trigger('click');
						}
					});
				})(response[i], i);
			}
		}, 'json');
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
			console.log($('#addNote-panel').data('trigger'));
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
	// formControllerBlur($(this), /[\w\u4e00-\u9fa5]/, '用户名不得包含非法字符！');
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
				if (response.type == 'personal') {
					(function (info) {
						$.get('tpl/note-box.html', function (html) {
							$('#myNote-tabpanel .row .addNote').after(html);
							$('#myNote-tabpanel .panel.box').eq(0).addClass('panel-' + info.label).data('content', info.content).find('.panel-title').text(info.title).end().find('.note-txt').text(info.txt).end().data('title', info.title).data('label', info.label).data('txt', info.txt).data('id', info.id);
						});
					})(response);
				} else {
					console.log(response);
					(function (info) {
						console.log(info);
					})(response);
				}
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
		case 'note-group':
			// 通过点击添加群组笔记触发的编辑面板
			$('#edit-type').val('group');
			option['url'] = 'data/add_noteG.php';
			$('#edit-master').val(sessionStorage.name);
			$('#edit-team').val($('.group-item.active').find('.group-name').data('team'));
			console.log($('#edit-form').serialize());
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

function boxPanelClick() {
	var $this = $(this);
	setTimeout(function () {
		$('#remote-modal .note-title').text($this.find('.panel-title').text());
		$('#remote-modal .note-content').html($this.data('content'));
	}, 100)
}

function boxLoadMoreClick() {
	var $this = $(this);
	var oldNum = $('.box.panel').length;
	var count = 5;
	$.post('data/show_note.php', {start: oldNum, count: count, user: sessionStorage.name}, function (response) {
		var length = response.length;
		for (var i = 0; i < response.length; i++) {
			(function (info, index) {
				index += oldNum;
				$.get('tpl/note-box.html', function (html) {
					$('#note-container').append(html);
					$('#myNote-tabpanel .panel.box').eq(index).addClass('panel-' + info.label).data('content', info.content).find('.panel-title').text(info.title).end().find('.note-txt').text(info.txt).end().data('title', info.title).data('label', info.label).data('txt', info.txt).data('id', info.id);
					if (!(length < count)) {
						if (index == length+oldNum-1) {
							$this.insertAfter($('#myNote-tabpanel .panel.box').last());
						}
					}
				});
			})(response[i], i);
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
	$('#addNote-panel').data('trigger', 'note-edit');
	$('#remote-modal').modal('hide');
}

function noteDeleteClick() {
	if (confirm('是否要删除该笔记？')) {
		var id = $(this).parent().hasClass('panel-heading') ? $(this).parents('.box.panel').data('id') : $('.panel.box.note-active').data('id');
		var $this = $(this);
		$.post('data/delete_note.php', {id: id}, function () {
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
	$('.panel.box.note-active').data('.note-active', 1);
	$(this).parents('.box').addClass('note-active');
}

function teamNameBlur() {
	formControllerBlur($(this), /[\w\u4e00-\u9fa5]/, '群组名不得包含非法字符！');
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
						$('.group-name').eq(0).attr('href', '#myGroup'+info.id).text(info.teamName);
						$('.groupNote-tabpanel-right .notes-container').append('<div id="myGroup' + info.id +'" class="tab-pane" role="tabpanel"><div class="notes">'+Math.random()*10+'</div></div>');
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