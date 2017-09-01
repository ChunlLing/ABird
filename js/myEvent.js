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
					var data = {};
					for (var key in info) {
						data[key] = info[key];
					}
					$.get('tpl/group-item.html', function (html) {
						$('#groupNotes').append(html);
						$('.group-name').eq(index).data(data).attr('href', '#myGroup'+info.id).text(info.team);
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

/*
 *	remoteModalShown：远程加载模态框显示完成后的回调函数
 *	根据e.relatedTarget判断触发对话框的元素，执行相应的操作
 */
function remoteModalShown(e) {
	if ($(e.relatedTarget).attr('id') == 'no-login-btn' || $(e.relatedTarget).attr('id') == 'login-reg-btn') {
		// 由登录注册按钮触发
		$('#reg-useremail').emailList();
	} else if ($(e.relatedTarget).attr('id') == 'has-login-btn') {
		// 由用户信息按钮触发
		setUserLogin();
	} else if ($(e.relatedTarget).parents('.panel').hasClass('box')) {
		// 由笔记预览框触发
		$('#remote-modal .note-title').text($(e.relatedTarget).parents('.panel').find('.panel-title').text());
		$('#remote-modal .note-content').html($(e.relatedTarget).parents('.panel').data('content'));
	} else if ($(e.relatedTarget).hasClass('group-rename')) {
		// 由群组重命名触发
		var $this = $(e.relatedTarget);
		$('.modal-title:visible').text('重命名');
		$('#teamName').val($this.parents('.group-item').find('.group-name').data('team'));
		$('#teamDescription').val($this.parents('.group-item').find('.group-name').data('description'));
		$('#teamId').val($this.parents('.group-item').find('.group-name').data('id'));
	} else if ($(e.relatedTarget).hasClass('group-invite')) {
		// 由添加成员触发
		$('#teamId').val($(e.relatedTarget).parents('.group-item').find('.group-name').data('id'));
		$('#teamMaster').val($(e.relatedTarget).parents('.group-item').find('.group-name').data('master'));
	} else if ($(e.relatedTarget).hasClass('group-manage')) {
		// 由管理群组触发
		var data = {
			'teamId': $(e.relatedTarget).parents('.group-item').find('.group-name').data('id')
		};
		$.post('data/show_group_member.php', data, function (result) {
			result.forEach(function (currentValue, index, array) {
				$('.member-list').load('tpl/group-manage-item.html', '.btn-group', function (html) {
					$('.dropdown-toggle').text(currentValue['name']);
				});
			});
			$('.memberNum').text(result.length);
		}, 'json');
	}
}

/*
 *	remoteModalHidden：远程加载模态框隐藏完成后的回调函数
 *	清除远程加载模态框的内容，方便再次使用
 */
function remoteModalHidden() {
	$(this).removeData('bs.modal');
}

/*
 *	addNoteClick：点击添加（个人）笔记
 *	若用户未登录，提示用户并打开登录注册框
 *	若用户已登录，编辑编辑面板由添加（个人）笔记触发
 */
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

/*
 *	addNotePanelShown：编辑面板显示完成后的回调函数
 *	若编辑面板由添加（个人）笔记触发
 *		检测编辑面板是否有上次输入且未保存的内容，若有，询问是否继续编辑
 *	若编辑面板由编辑（个人、群组）笔记触发
 *		将被编辑笔记内容写入编辑面板
 */
function addNotePanelShown() {
	var title, label, html, txt;
	switch ($(this).data('trigger')) {
		case 'addNote' :
			title = $('.edit-title').val();
			label = $('.modal-title select').val();
			html = getContent(ue);
			if (title || (label != 'default') || html) {
				$('#tip-modal').modal('show')
					.on('click', '.tip-left', function () {
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

/*
 *	toTabShow：跳转到指定标签页
 */
function toTabShow(e) {
	e.data.target.tab('show');
}

/*
 *	validateFocus：表单元素获取焦点，若有状态提示样式，清除已有状态提示样式
 */
function validateFocus(e) {
	formControllerFocus($(this));
}

/*
 *	regUsernameBlur：注册表单用户名输入框失去焦点验证函数
 *	1 用户名只能为字母、数字、中文
 *	2 用户名不能被重复注册
 */
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

/*
 *	regUseremailBlur：注册表单邮箱输入框失去焦点验证函数
 *	1 必须符合邮箱格式要求
 */
function regUseremailBlur() {
	formControllerBlur($(this), /^[\w]+@[\w]{2,8}\.[\w]{2,3}$/, '邮箱格式不正确！');
}

/*
 *	regUserPSWBlur：注册表单密码输入框失去焦点验证函数
 *	1 密码长度必须在6-20位之间
 *	若密码符合要求且确认密码已输入，对确认密码进行手动获取焦点和失去焦点操作（以验证两次密码是否一致）
 */
function regUserPSWBlur() {
	formControllerBlur($(this), /^[\w]{6,20}$/, '密码长度必须在6-20位之间！');
	if ($(this).val() && $('#reg-userPSWAgain').val() && formControllerBlur($(this), /^[\w]{6,20}$/, '密码长度必须在6-20位之间！')) {
		$('#reg-userPSWAgain').trigger('focus').trigger('blur');
	}
}

/*
 *	regUserPSWAgainBlur：注册表单确认密码输入框失去焦点验证函数
 *	1 确认密码必须与密码一致
 *	2 确认密码长度必须在6-20位之间
 *	若密码符合要求且确认密码已输入，对确认密码进行手动获取焦点和失去焦点操作（以验证两次密码是否一致）
 */
function regUserPSWAgainBlur() {
	if (formControllerBlur($(this), "$('#reg-userPSWAgain').val() == $('#reg-userPSW').val()", '两次输入密码不一致！')) {
		formControllerBlur($(this), /^[\w]{6,20}$/, '密码长度必须在6-20位之间！');
	}
}

/*
 *	regUserAnswerBlur：注册表单密保问题回答输入框失去焦点验证函数
 */
function regUserAnswerBlur() {
	formControllerBlur($(this), 'true');
}

/*
 *	regSubmitClick：注册表单提交
 *	若所有表单元素正确填写则可向服务器进行提交
 */
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
			// 向sessionStorage对象写入用户信息
			setLoginMessage(msg);
			setTimeout(function () {
				$(':submit').removeAttr('disabled');
				$('#loading-alert').addClass('hidden').removeClass('alert-success').find('p').remove();
				// 将页面未注册UI隐藏，显示已注册UI
				setUserLogin();
				// 重新加载页面
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

/*
 *	exitClick：点击退出按钮，用户退出登录，清除用户信息
 */
function exitClick() {
	sessionStorage.clear();
	setUserExit();
}

/*
 *	loginSubmitClick：登录表单提交
 *	若所有表单元素正确填写则可向服务器进行提交
 *		若该用户存在数据库中则可登录，否则提示用户名或密码错误
 */
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

/*
 *	editSubmitClick：编辑表单提交
 */
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

	// 清除编辑面板的触发标记
	$('#addNote-panel').removeData('trigger');
}

/*
 *	editCancelClick：取消编辑
 *	若内容发生改变，询问是否保存修改
 */
function editCancelClick() {
	var title = $('.edit-title').val();
	var label = $('.modal-title select').val();
	var html = getContent(ue);
	if (html || title || (label != 'default')) {
		switch ($(this).parents('#addNote-panel').data('trigger')) {
			case 'addNote' :
				$('#tip-modal').modal('show')
					.on('click', '.tip-right', function () {
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
					.on('click', '.tip-right', function () {
						$('#edit-submit').trigger('click');
					})
					.find('.modal-body p')
					.text('您编辑的内容尚未保存，是否保存？');
				}
				break;
		}
	}
}

/*
 *	boxLoadMoreClick：我的笔记加载更多
 */
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

/*
 *	noteEditClick：笔记预览面板编辑按钮
 */
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

/*
 *	noteDeleteClick：删除笔记按钮
 */
function noteDeleteClick() {
	var $this = $(this);
	$('#tip-modal').modal('show')
	.on('click', '.tip-right', function () {
		var id = $this.parent().hasClass('panel-heading') ? $this.parents('.box.panel').data('id') : $('.panel.box.note-active').data('id');
		var url = ($this.parents('.box').data('type') == 'personal') ? 'data/delete_note.php' : 'data/delete_noteG.php';
		$.post(url, {id: id}, function () {
			if ($this.parent().hasClass('panel-heading')) {
				$this.parents('.box.panel').remove();
			} else {
				$('.panel.box.note-active').remove();
				$('#remote-modal').modal('hide');
			}
		});
	})
	.find('.modal-body p')
	.text('是否要删除该笔记？');
}

/*
 *	boxPanelBodyClick：点击笔记预览框
 */
function boxPanelBodyClick() {
	$('.panel.box.note-active').removeClass('note-active');
	$(this).parents('.box').addClass('note-active');
}

/*
 *	teamNameBlur：创建新群组/重命名群组表单群组名输入框失去焦点
 */
function teamNameBlur() {
	formControllerBlur($(this), /[\w\u4e00-\u9fa5]/, '群组名不得包含非法字符！');
}

/*
 *	createGroupClick：点击创建新群组按钮
 */
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

/*
 *	addGroupNoteClick：点击添加群组笔记按钮
 */
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

/*
 *	addGroupSubmitClick：创建新群组
 */
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
					var data = {};
					for (var key in info) {
						data[key] = info[key];
					}
					$.get('tpl/group-item.html', function (html) {
						if ($('#teamId').val()) {
							$('.group-name').filter(function (index, element) {
								return $(element).data('id') == $('#teamId').val();
							}).remove();
						}
						$('#groupNotes').prepend(html);
						$('.group-name').eq(0).data(data).attr('href', '#myGroup'+info.id).text(info.team).trigger('click');
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

/*
 *	groupNameClick：（小屏）点击群组名称进入相应群组内查看该组笔记
 */
function groupNameClick() {
	if ($(document).width() < 768) {
		$('.groupNote-tabpanel-right').show();
		$('.groupNote-tabpanel-left').hide();
	}
}

/*
 *	memberNameBlur：添加成员表单成员输入框失去焦点回调函数
 */
function memberNameBlur() {
	var $this = $(this);
	if ($this.val() == sessionStorage.name) {
		// 当前用户不能被添加
		formControllerBlur($this, 'false', '你已经在群中啦~~~');
	} else {
		var option = {
			user: $this.val(),
			teamId: $('#teamId').val()
		};
		$.post('data/add_group_member.php', option, function (response) {
			if (!response['status']) {
				// 该用户未注册
				formControllerBlur($this, 'false', '查无此人，再检查一下...');
			} else if (response['isMember']) {
				// 该用户已在群组中
				formControllerBlur($this, 'false', '这位少侠已经在群中了٩(๑❛ᴗ❛๑)۶');
			} else {
				formControllerBlur($this, 'true');
			}
		}, 'json');
	}
}

/*
*	addGroupInviteClick：添加成员表单提交
*/
function addGroupInviteClick() {
	if ($('#memberName').parents('.form-group').hasClass('has-success')) {
		if (!$('#memberInvitation').val()) {
			$('#memberInvitation').val($('#memberInvitation').attr('placeholder'));
		}
		var option = {
			type: 'POST',
			data: $('#add-group-member-form').serialize(),
			dataType: 'json',
			url: 'data/add_group_member_message.php',
			beforeSubmit: function () {
				$('#loading-alert').addClass('alert-info').append('<p>数据提交中 <i class="icon-spinner"></i></p>').removeClass('hidden');
				$(':submit').attr('disabled', 'disabled');
			},
			success: function (response) {
				$('#loading-alert p').remove();
				$('#loading-alert').removeClass('alert-info').addClass('alert-success').append('<p>数据提交成功！ <i class="icon-ok"></i></p>');
				setTimeout(function () {
					$(':submit').removeAttr('disabled');
					$('#loading-alert').addClass('hidden').removeClass('alert-success').find('p').remove();
					$('#remote-modal').modal('hide');
					resetForm($('#reg-form'));
				}, 2000);
			}
		};
		$('#add-group-member-form').ajaxForm(option);
	} else if (!$('#memberName').val()) {
		$(this).after('<span class="text-danger"> 请填写用户名！</span>');
		return false;
	} else {
		return false;
	}
}

/*
*	groupDeleteClick：删除群组
*/
function groupDeleteClick() {
	var $this = $(this);
	$('#tip-modal').on('click', '.tip-right', function () {
		$.post('data/delete_group.php', {user: sessionStorage.name, id: $this.parents('.group-item').find('.group-name').data('id')}, function () {
			$this.parents('.group-item').remove();
			$('a.group-name').first().tab('show');
		});
	})
	.find('.modal-body p')
	.text('是否要退出该组？');
}

/*
*	backGroupListClick：（小屏）返回到群组页面
*/
function backGroupListClick() {
	$('.groupNote-tabpanel-left').show();
	$('.groupNote-tabpanel-right').hide();
}