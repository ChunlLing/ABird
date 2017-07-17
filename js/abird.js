$(function () {

	$('#nav-list a[data-toggle="tab"]').on('show.bs.tab', function (e) {
		var url = $(this).attr('href');
		var target = $(this).data('target');
		var tab = $(this);
		$(target).load(url, function (result) {
			tab.tab('show');
		});
	});
	$('#nav-home a').tab('show');

	$('body').on('hidden.bs.modal', '#remote-modal', function () {
		$(this).removeData('bs.modal');
	}).on('click', '.addNote', function () {
		var ue = UE.getEditor('editor-container');
		ue.ready(function () {
			var html = ue.getContent();
		});
	}).on('click', '#to-myNote', function () {
		$('#nav-myNote a').tab('show');
	}).on('focus', '#reg-username', function () {
		validityFocus($(this));
	}).on('blur', '#reg-username', function () {
		validityBlur($(this), /[\w\u4e00-\u9fa5]/, '用户名不得包含非法字符！');
	}).on('focus', '#reg-useremail', function () {
		emailList();
		validityFocus($(this));
	}).on('blur', '#reg-useremail', function () {
		$('.email-list').addClass('hide');
		validityBlur($(this), /^[\w]+@[\w]{2,8}\.[\w]{2,3}$/, '邮箱格式不正确！');
	}).on('keyup', '#reg-useremail', function (e) {
		e.preventDefault();
		if (e.keyCode != 13 || e.keyCode != 38 || e.keyCode != 40) {
			emailList();
		}
	}).on('keydown', '#reg-useremail', function (e) {
		switch (e.keyCode) {
			case 13:
				e.preventDefault();
				$(this).val($('.email-list-item.highlight').text());
				$('.email-list').addClass('hide');
				break;
			case 38:
				e.preventDefault();
				if (!$('.email-list-item.highlight').is($('.email-list-item').first())) {
					$('.email-list-item.highlight').removeClass('highlight').prev().addClass('highlight');
				}
				break;
			case 40:
				e.preventDefault();
				if (!$('.email-list-item').is('.highlight')) {
					$('.email-list-item').first().addClass('highlight');
				} else {
				console.log(e.keyCode);
					if (!$('.email-list-item.highlight').is($('.email-list-item').last())) {
						$('.email-list-item.highlight').removeClass('highlight').next().addClass('highlight');
					}
				}
				break;
		}
	}).on('mousedown', '.email-list-item', function () {
		$('#reg-useremail').val($(this).text());
		$('.email-list').addClass('hide');
	}).on('focus', '#reg-userPSW', function () {
		validityFocus($(this));
	}).on('blur', '#reg-userPSW', function () {
		validityBlur($(this), /^[\w]{6,20}$/, '密码长度必须在6-20位之间！');
	}).on('focus', '#reg-userPSWAgain', function () {
		validityFocus($(this));
	}).on('blur', '#reg-userPSWAgain', function () {
		validityBlur($(this), "$('#reg-userPSWAgain').val() == $('#reg-userPSW').val()", '两次输入密码不一致！');
	}).on('click', '#reg-submit', function () {
		var option = {
			type: 'POST',
			data: $('#reg-form').serialize(),
			url: 'data/add_user.php',
			success: function (response) {
				console.log(response);
			}
		};
		// $('#reg-form').ajaxForm(option);
		return  false;
	});

});

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
	}
	obj.parents('.col-sm-10').after('<div class="col-sm-8 col-sm-offset-2"><p class="text-danger">' + ((obj.val()) ? errorText : '请输入内容') + '</p></div>');
}

function emailList() {
	$('.email-list').empty();
	// $('.email-list-item').detach();
	var hosts = ['qq.com', 'gmail.com', 'sina.com', '126.com', '163.com'];
	if ($('#reg-useremail').val().indexOf('@') != -1) {
		hosts = hosts.filter(function (host) {
			return !host.indexOf($('#reg-useremail').val().slice($('#reg-useremail').val().indexOf('@')+1));
		});
	}
	if (hosts.length != 0) {
		$('.email-list').removeClass('hide');
		for (let i = 0; i < hosts.length; i++) {
			$('.email-list').append('<li class="email-list-item"><span class="userinput"></span>@' + hosts[i] + '</li>');
		}
		if ($('#reg-useremail').val().indexOf('@') == -1) {
			$('.userinput').text($('#reg-useremail').val());
		} else {
			$('.userinput').text($('#reg-useremail').val().slice(0,$('#reg-useremail').val().indexOf('@')));
		}
	} else {
		$('.email-list').addClass('hide');
	}
}