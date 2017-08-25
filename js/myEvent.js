/*
 *	navMyNoteShow：我的笔记标签页显示处理函数
 *	若客户已登录并且该便签页内容未加载过，向服务器请求该客户存储在数据库中的个人笔记数据并渲染
 */
function navMyNoteShow() {
	if ((!$('#note-container').html()) && sessionStorage.getItem('name')) {
		$.post('data/show_note.php', {start: 0, count: 4, user: sessionStorage.name}, function (response) {
			for (var i = 0; i < response.length; i++) {
				createNoteBox(response[i], i, response);
			}
		}, 'json');
	}
}

/*
 *	navGroupNotesShow：群组笔记标签页显示处理函数
 *	若客户已登录并且该便签页内容未加载过，向服务器请求该客户存储在数据库中有关的群组和群组笔记数据并渲染
 */
function navGroupNotesShow() {
	if ((!$('#groupNotes').html()) && sessionStorage.getItem('name')) {
		$.post('data/show_group.php', {user: sessionStorage.name}, function (response) {
			for (var i = 0; i < response.length; i++) {
				(function (info, index) {
					$.get('tpl/group-item.html', function (html) {
						$('#groupNotes').append(html);
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
					count: 5, 
					user: sessionStorage.name, 
					gid: $('.group-item.active').find('.group-name').data('id')
				};
				$.post('data/show_noteG.php', options, function (res) {
					for (let j = 0; j < res.length; j++) {
						createNoteBox(res[j], j);
					}
				}, 'json');
				$('.tab-pane.active').scroll(function () {
					if ($(this).prop('scrollHeight') - $(this).scrollTop() - $(this).height() == 0) {
						options.gid = $('.group-item.active').find('.group-name').data('id');
						options.start = $('.box.panel:visible').length;
						$.post('data/show_noteG.php', options, function (res) {
							for (let j = 0; j < res.length; j++) {
								createNoteBox(res[j], j, res, options.count);
							}
						}, 'json');
					}
				});
			}
		});
	}
}

function remoteModalShown(e) {
	if ($(e.relatedTarget).attr('id') == 'no-login-btn') {
		$('#reg-useremail').emailList();
	} else if ($(e.relatedTarget).hasClass('panel-body')) {
		$('#remote-modal .note-title').text($(e.relatedTarget).parents('.panel').find('.panel-title').text());
		$('#remote-modal .note-content').html($(e.relatedTarget).parents('.panel').data('content'));
	}
}

function remoteModalLoaded() {
	if (isLogin()) {
		setUserLogin();
	}
}

function remoteModalHidden() {
	$(this).removeData('bs.modal');
}

function addNoteClick() {
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

function addNotePanelShown() {
	var title, label, html, txt;
	switch ($(this).data('trigger')) {
		case 'addNote' :
			title = $('.edit-title').val();
			label = $('.modal-title select').val();
			html = getContent(ue);
			if (title || (label != 'default') || html) {
				$('#tip-modal').modal('show')
					.on('click', '.btn-default', function () {
						clearContent(ue, $('#edit-form'));
					})
					.find('.modal-body p')
					.text('您上次编辑的内容尚未保存，是否继续编辑？');
			}
			break;
		case 'note-edit' :
		case 'note-group' :
			var $panelBoxs = $('.panel.box.note-active');
			$('.edit-title').val($panelBoxs.data('title'));
			$('.modal-title select').val($panelBoxs.data('label') ? $panelBoxs.data('label') : 'default');
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
			var msg = {
				'name': response['user'],
				'email': response['email'],
				'total': '1000',
				'used': Math.floor(Math.random()*1000)
			};
			$('#loading-alert p').remove();
			$('#loading-alert').removeClass('alert-info').addClass('alert-success').append('<p>数据保存成功！ <i class="icon-ok"></i></p>');
			setLoginMessage(msg);
			setTimeout(function () {
				$(':submit').removeAttr('disabled');
				$('#loading-alert').addClass('hidden').removeClass('alert-success').find('p').remove();
				setUserLogin();
				location.reload();
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
	setUserExit();
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
			$('#loading-alert p').remove();
			if (response['status']) {
				var msg = {
					'name': response['user'],
					'email': response['email'],
					'total': '1000',
					'used': Math.floor(Math.random()*1000)
				};
				$('#loading-alert').removeClass('alert-info').addClass('alert-success').append('<p>数据保存成功！ <i class="icon-ok"></i></p>');
				setLoginMessage(msg);
				setTimeout(function () {
					$(':submit').removeAttr('disabled');
					$('#loading-alert').addClass('hidden').removeClass('alert-success').find('p').remove();
					setUserLogin();
					location.reload();
					$('#remote-modal').modal('hide');
					resetForm($('#login-form'));
				}, 2000);
			} else {
				$('#loading-alert').removeClass('alert-info');
				$(':submit').removeAttr('disabled');
				$('#login-form .form-group').addClass('has-feedback');
				formControllerBlur($('#username'), 'false', '');
				formControllerBlur($('#userPSW'), 'false', '用户名或密码错误，请重新输入！');
				return false;
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
				$('.panel.box.note-active').remove();
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
	var title = $('.edit-title').val();
	var label = $('.modal-title select').val();
	var html = getContent(ue);
	if (html || title || (label != 'default')) {
		switch ($(this).parents('#addNote-panel').data('trigger')) {
			case 'addNote' :
				$('#tip-modal').modal('show')
					.on('click', '.btn-primary', function () {
						clearContent(ue, $('#edit-form'));
					})
					.find('.modal-body p')
					.text('是否清除所编辑的内容？');
				break;
			case 'note-edit' : 
			case 'note-group' :
				var $panelBoxs = $('.panel.box.note-active');
				if ((title != $panelBoxs.data('title')) || (label != $panelBoxs.data('label')) || (html != $panelBoxs.data('content'))) {
					$('#tip-modal').modal('show')
					.on('click', '.btn-primary', function () {
						$('#edit-submit').trigger('click');
					})
					.find('.modal-body p')
					.text('您编辑的内容尚未保存，是否保存？');
				}
				break;
		}
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
	var $this = $(this);
	$('#tip-modal').modal('show')
	.on('click', '.btn-primary', function () {
		var id = $this.parent().hasClass('panel-heading') ? $this.parents('.box.panel').data('id') : $('.panel.box.note-active').data('id');
		var url = ($this.parents('.box').data('type') == 'personal') ? 'data/delete_note.php' : 'data/delete_noteG.php';
		$.post(url, {id: id}, function () {
			if ($this.parent().hasClass('panel-heading')) {
				$this.parents('.box.panel').remove();
			} else {
				$('#remote-modal').modal('hide');
				$('.panel.box.note-active').remove();
			}
		});
	}).on('click', '.btn-default', function () {
		$('#remote-modal').modal('hide');
	})
	.find('.modal-body p')
	.text('是否要删除该笔记？');
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
						$('#groupNotes').prepend(html);
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

function groupNameClick() {
	if ($(window).width() < 768) {
		$('.groupNote-tabpanel-right').show();
		$('.groupNote-tabpanel-left').hide();
	}
}

function groupDeleteClick() {
	var $this = $(this);
	$('#tip-modal').on('click', '.btn-primary', function () {
		$.post('data/delete_group.php', {user: sessionStorage.name, id: $this.parents('.group-item').find('.group-name').data('id')}, function () {
			$this.parents('.group-item').remove();
			$('a.group-name').first().tab('show');
		});
	})
	.find('.modal-body p')
	.text('是否要退出该组？')
	.end()
	.find('.btn-primary')
	.text('是的');
}

function backGroupListClick() {
		$('.groupNote-tabpanel-left').show();
		$('.groupNote-tabpanel-right').hide();
	}