function resetForm(form) {
	form.trigger('reset');
	form.find('.form-group').removeClass('has-success');
	form.find('input:not([type="submit"])').next('span').remove();
}

function validityFocus(obj) {
	if (obj.next('span')) {
		obj.next('span').remove();
	}
	obj.parents('.col-sm-10').next('div.col-sm-8').remove();
	obj.parents('.form-group').attr('class', 'form-group has-feedback');
}

function validityBlur(obj, reg, errorText) {
	var pattern = reg;
	var condition = (typeof reg === 'string') ? eval(reg) : pattern.test(obj.val());
	if (condition && obj.val()) {
		obj.after('<span class="glyphicon glyphicon-ok form-control-feedback"></span>');
		obj.parents('.form-group').addClass('has-success');
	} else {
		obj.after('<span class="glyphicon glyphicon-remove form-control-feedback"></span>');
		obj.parents('.form-group').addClass('has-error');
		obj.parents('.col-sm-10').after('<div class="col-sm-8 col-sm-offset-2"><p class="text-danger">' + ((obj.val()) ? errorText : '请输入内容') + '</p></div>');
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

function isLogin() {
	if ($('#hasLogin').hasClass('hidden')) {
		$('#hasLogin').removeClass('hidden');
		$('#unlogin').addClass('hidden');
		$('#has-login-btn').removeClass('hidden');
		$('#no-login-btn').addClass('hidden');
		$('#userSetting .btn').removeClass('disabled');

		setInterval(function () {
			$('.userName').text(sessionStorage.name);
			$('.userEmail').text(sessionStorage.email);
			$('.userSpace-total').text(sessionStorage.total);
			$('.userSpace-used').text(sessionStorage.used);
			$('.userSpace').val(sessionStorage.used);
		}, 10);
	}
}

function isExit() {
	$('#hasLogin').addClass('hidden');
	$('#unlogin').removeClass('hidden');
	$('#has-login-btn').addClass('hidden');
	$('#no-login-btn').removeClass('hidden');
	$('#userSetting .btn').addClass('disabled');
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