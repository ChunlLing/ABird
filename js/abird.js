$(function () {

	$('#nav-list a[data-toggle="tab"]').on('show.bs.tab', function (e) {
		var url = $(this).attr('href');
		var target = $(this).data('target');
		var tab = $(this);
		$(target).load(url, function (result) {
			tab.tab('show');
		});
	}).ready(function (e) {
		if (sessionStorage.getItem('name')) {
			isLogin();
		}
	});
	$('#nav-groupNotes a').tab('show');
	// $('#nav-home a').tab('show');

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
		$('.email-list').addClass('hidden');
		validityBlur($(this), /^[\w]+@[\w]{2,8}\.[\w]{2,3}$/, '邮箱格式不正确！');
	}).on('keydown', '#reg-useremail', function (e) {
		switch (e.keyCode) {
			case 13:
				e.preventDefault();
				$(this).val($('.email-list-item.highlight').text());
				$('.email-list').addClass('hidden');
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
					if (!$('.email-list-item.highlight').is($('.email-list-item').last())) {
						$('.email-list-item.highlight').removeClass('highlight').next().addClass('highlight');
					}
				}
				break;
			default:
				setTimeout(function () {
					emailList();
				}, 50);
		}
	}).on('mousedown', '.email-list-item', function () {
		$('#reg-useremail').val($(this).text());
		$('.email-list').addClass('hidden');
	}).on('focus', '#reg-userPSW', function () {
		validityFocus($(this));
	}).on('blur', '#reg-userPSW', function () {
		validityBlur($(this), /^[\w]{6,20}$/, '密码长度必须在6-20位之间！');
	}).on('focus', '#reg-userPSWAgain', function () {
		validityFocus($(this));
	}).on('blur', '#reg-userPSWAgain', function () {
		validityBlur($(this), "$('#reg-userPSWAgain').val() == $('#reg-userPSW').val()", '两次输入密码不一致！');
	}).on('focus', '#reg-userAnswer', function () {
		validityFocus($(this));
	}).on('blur', '#reg-userAnswer', function () {
		validityBlur($(this), 'true');
	}).on('click', '#reg-submit', function () {
		var option = {
			type: 'POST',
			data: $('#reg-form').serialize(),
			dataType: 'json',
			url: 'data/add_user.php',
			success: function (response) {
				sessionStorage.setItem('name', response['user']);
				sessionStorage.setItem('email', response['email']);
				sessionStorage.setItem('total', '1000');
				sessionStorage.setItem('used', Math.floor(Math.random()*1000));
				isLogin();
				$('#remote-modal').modal('hide');
				resetForm($('#reg-form'));
			}
		};
		if (!$('#reg-form .form-group').is('.has-error')) {
			if ($('#reg-form  input').filter(function () {return !$(this).val()}).length == 0) {
				$('#reg-form').ajaxForm(option);
			}
		}
	}).on('click', '.exit', function () {
		sessionStorage.clear();
		isExit();
	}).on('click', '#login-submit', function () {
		var option = {
			type: 'POST',
			data: $('#login-form').serialize(),
			dataType: 'json',
			url: 'data/login.php',
			success: function (response) {
				if (response['status']) {
					sessionStorage.setItem('name', response['user']);
					sessionStorage.setItem('email', response['email']);
					sessionStorage.setItem('total', '1000');
					sessionStorage.setItem('used', Math.floor(Math.random()*1000));
					isLogin();
					$('#remote-modal').modal('hide');
					resetForm($('#login-form'));
				} else {
					$('#login-form .form-group').addClass('has-feedback');
					validityBlur($('#username'), 'false', '');
					validityBlur($('#userPSW'), 'false', '用户名或密码错误，请重新输入！');
				}
			}
		};
		if ($('#username').val() && $('#userPSW').val()) {
			$('#login-form').ajaxForm(option);
		}
	});

});

