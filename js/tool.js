/*
*	resetForm：重置表单
*/
function resetForm(form) {
	form.trigger('reset');
	form.find('.form-group').removeClass('has-success');
	form.find('input:not([type="submit"])').next('span').remove();
}

/*
*	formControllerFocus：表单控件得到焦点
*/
function formControllerFocus(obj) {
	if (obj.next('span')) {
		obj.next('span').remove();
	}
	obj.parents('.col-sm-10').next('div.col-sm-8').remove();
	obj.parents('.form-group').attr('class', 'form-group has-feedback');
}

/*
*	formControllerBlur：表单控件失去焦点
*/
function formControllerBlur(obj, reg, text) {
	var pattern = reg;
	var condition = (typeof reg === 'string') ? eval(reg) : pattern.test(obj.val());
	if (condition && obj.val()) {
		formControllerFocus(obj);
		obj.after('<span class="glyphicon glyphicon-ok form-control-feedback"></span>');
		obj.parents('.form-group').addClass('has-success');
		return true;
	} else {
		formControllerFocus(obj);
		obj.after('<span class="glyphicon glyphicon-remove form-control-feedback"></span>');
		obj.parents('.form-group').addClass('has-error');
		obj.parents('.col-sm-10').after('<div class="col-sm-8 col-sm-offset-2"><p class="text-danger">' + ((obj.val()) ? text : '请输入内容') + '</p></div>');
		return false;
	}
}

/*
*	setLoginMessage：向sessionStorage对象写入用户信息
*/
function setLoginMessage(msg) {
	for (var item in msg) {
		sessionStorage.setItem(item, msg[item]);
	}
}

/*
*	setUserLogin：将页面未注册UI隐藏，显示已注册UI
*/
function setUserLogin() {
	$('#hasLogin').removeClass('hidden');
	$('#unlogin').addClass('hidden');
	$('#has-login-btn').removeClass('hidden');
	$('#no-login-btn').addClass('hidden');
	$('#userSetting .btn').removeAttr('disabled');

	$('.userName').text(sessionStorage.name);
	$('.userEmail').text(sessionStorage.email);
	$('.userSpace-total').text(sessionStorage.total);
	$('.userSpace-used').text(sessionStorage.used);
	$('.userSpace').val(sessionStorage.used);
}

/*
*	isLogin：判断用户是否登录
*/
function isLogin() {
	if (sessionStorage.getItem('name')) {
		return true;
	} else {
		return false;
	}
}

/*
*	setUserExit：用户退出设置
*/
function setUserExit() {
	$('#hasLogin').addClass('hidden');
	$('#unlogin').removeClass('hidden');
	$('#has-login-btn').addClass('hidden');
	$('#no-login-btn').removeClass('hidden');
	$('#userSetting .btn').attr('disabled', 'disabled');

	$('.userName').text('');
	$('.userEmail').text('');
	$('.userSpace-total').text('');
	$('.userSpace-used').text('');
	$('.userSpace').val('');

	$('#myNote-tabpanel .row').html($('#myNote-tabpanel .row .addNote'));
	$('#groupNote-tabpanel').find('#groupNotes').html('').end().find('.tab-content').html('');
}

/*
*	getContent：获取编辑器内容
*/
function getContent(obj) {
	return obj.getContent();
}

/*
*	getContentTxt：获取编辑器纯文本内容
*/
function getContentTxt(obj) {
	return obj.getContentTxt();
}

/*
*	clearContent：清空编辑器
*/
function clearContent(editor, form) {
	form.trigger('reset');
	editor.setContent('');
}

/*
*	createNoteBox：创建笔记预览框
*/
function createNoteBox(info, index, infoArr, extra) {
	var isNew = (typeof index == 'undefined') ? true : false;	// 判断是显示新笔记还是显示已有笔记，为false表示显示已有笔记，此时index不为undefined
	var index = index || 0;
	var oldNum = $('.box.panel:visible').length;
	if (extra) {
		isNew = false;
		index += oldNum;
	}
	$.get('tpl/note-box.html', function (html) {
		var dataArr = {
			'id': info.id,
			'title': info.title,
			'label': info.label,
			'type': (info.type) ? info.type : 'group',
			'content': info.content,
			'txt': info.txt,
			'date': info.date
		};
		if (info.type == 'personal') {
			if (isNew) {
				$('#myNote-tabpanel .row .addNote').after(html);
			} else {
				$('#note-container').append(html);
			}
			$('#myNote-tabpanel .panel.box').eq(index).addClass('col-md-2 col-sm-4 col-xs-6 panel-' + info.label).data(dataArr).find('.panel-title').text(info.title).end().find('.note-txt').text(info.txt).end().find('.note-time').text(info.date);
			if (!extra) {
				// 没有第四个参数
				if (!isNew) {
					if (index == infoArr.length-1 && infoArr.length == 4) {
						$.get('tpl/loadMore-box.html', function (loadMore) {
							$('#myNote-tabpanel .panel.box').last().after(loadMore);
						});
					}
				}
			} else {
				// 有第四个参数，由boxLoadMoreClick触发
				if (!(infoArr.length < extra)) {
					if (index == infoArr.length+oldNum-1) {
						$('.loadMore.box').insertAfter($('#myNote-tabpanel .panel.box').last());
					}
				}
			}
		} else {
			if (isNew) {
				$('.notes-container .tab-pane.active').prepend(html);
			} else {
				$('.notes-container .tab-pane.active').append(html);
			}
			$('.notes-container .tab-pane.active .panel.box').eq(index).addClass('panel-' + info.label).data(dataArr).find('.panel-title').text(info.title).end().find('.note-txt').text(info.txt).end().find('.note-time').text(info.date);
		}
	});
}