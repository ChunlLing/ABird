function resetForm(form) {
	form.trigger('reset');
	form.find('.form-group').removeClass('has-success');
	form.find('input:not([type="submit"])').next('span').remove();
}

function formControllerFocus(obj) {
	if (obj.next('span')) {
		obj.next('span').remove();
	}
	obj.parents('.col-sm-10').next('div.col-sm-8').remove();
	obj.parents('.form-group').attr('class', 'form-group has-feedback');
}

function formControllerBlur(obj, reg, errorText) {
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
		obj.parents('.col-sm-10').after('<div class="col-sm-8 col-sm-offset-2"><p class="text-danger">' + ((obj.val()) ? errorText : '请输入内容') + '</p></div>');
		return false;
	}
}

function emailList() {
	$('.email-list').empty();
	var hosts = ['qq.com', 'gmail.com', 'sina.com', '126.com', '163.com'];
	if ($('#reg-useremail').val().indexOf('@') != -1) {
		hosts = hosts.filter(function (host) {
			return !host.indexOf($('#reg-useremail').val().slice($('#reg-useremail').val().indexOf('@')+1));
		});
	}
	if (hosts.length != 0) {
		$('.email-list').removeClass('hidden');
		for (let i = 0; i < hosts.length; i++) {
			$('.email-list').append('<li class="email-list-item"><span class="userinput"></span>@' + hosts[i] + '</li>');
		}
		if ($('#reg-useremail').val().indexOf('@') == -1) {
			$('.userinput').text($('#reg-useremail').val());
		} else {
			$('.userinput').text($('#reg-useremail').val().slice(0,$('#reg-useremail').val().indexOf('@')));
		}
	} else {
		$('.email-list').addClass('hidden');
	}
}

function setUserLogin() {
	$('.userName').text(sessionStorage.name);
	$('.userEmail').text(sessionStorage.email);
	$('.userSpace-total').text(sessionStorage.total);
	$('.userSpace-used').text(sessionStorage.used);
	$('.userSpace').val(sessionStorage.used);
}

function isLogin() {
	if ($('#hasLogin').hasClass('hidden')) {
		$('#hasLogin').removeClass('hidden');
		$('#unlogin').addClass('hidden');
		$('#has-login-btn').removeClass('hidden');
		$('#no-login-btn').addClass('hidden');
		$('#userSetting .btn').removeAttr('disabled');
		setUserLogin();
	}
}

function isExit() {
	$('#hasLogin').addClass('hidden');
	$('#unlogin').removeClass('hidden');
	$('#has-login-btn').addClass('hidden');
	$('#no-login-btn').removeClass('hidden');
	$('#userSetting .btn').attr('disabled', 'disabled');
	$('#myNote-tabpanel').html('');
	$('#groupNote-tabpanel').html('');
}

function getContent(obj) {
	return obj.getContent();
}

function getContentTxt(obj) {
	return obj.getContentTxt();
}

function clearContent(editor, form) {
	form.trigger('reset');
	editor.setContent('');
}

function createNoteBox(info, index, infoArr, extra) {
	var isNew = (index) ? false : true;	// 判断是显示新笔记还是显示已有笔记，为false表示显示已有笔记，此时index不为undefined
	var index = index || 0;
	var oldNum = $('#note-container .box.panel').length+1;
	if (extra) {
		isNew = false;
		index += oldNum;
	}
	$.get('tpl/note-box.html', function (html) {
		if (info.type == 'personal') {
			if (isNew) {
				$('#myNote-tabpanel .row .addNote').after(html);
			} else {
				$('#note-container').append(html);
			}
			$('#myNote-tabpanel .panel.box').eq(index).addClass('col-md-2 col-sm-4 col-xs-6 panel-' + info.label).data('content', info.content).find('.panel-title').text(info.title).end().find('.note-txt').text(info.txt).end().data('title', info.title).data('label', info.label).data('txt', info.txt).data('id', info.id).data('type', info.type);
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
			$('.notes-container .tab-pane.active').prepend(html);
			console.log(info.title);
			console.log(index);
			$('.notes-container .tab-pane.active .panel.box').eq(0).addClass('panel-' + info.label).data('content', info.content).find('.panel-title').text(info.title).end().find('.note-txt').text(info.txt).end().data('title', info.title).data('label', info.label).data('txt', info.txt).data('id', info.id);
		}
	});
}