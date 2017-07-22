$(function () {
	var ue = null;

	$('#nav-list a[data-toggle="tab"]').on('show.bs.tab', function (e) {
		var url = $(this).attr('href');
		var target = $(this).data('target');
		var tab = $(this);
		if (!$(target).html()) {
			(function () {
				$(target).load(url, function (result) {
					tab.tab('show');
				});
			})();
		}
	}).ready(function (e) {
		if (sessionStorage.getItem('name')) {
			isLogin();
		}
	});
	// $('#nav-groupNotes a').tab('show');
	// $('#nav-myNote a').tab('show');
	$('#nav-home a').tab('show');

	$('body').on('show.bs.tab', '#nav-myNote a', function () {
		if ((!$('#note-container').html()) && sessionStorage.getItem('name')) {
			$.get('data/show_note.php', {start: 0, count: 4, user: sessionStorage.name}, function (response) {
				for (var i = 0; i < response.length; i++) {
					(function (info, index) {
						$.get('tpl/note-box.html', function (html) {
							$('#note-container').append(html);
							$('#myNote-tabpanel .panel.box').eq(index).addClass('panel-' + info.label).data('content', info.content).find('.panel-title').text(info.title).end().find('.note-txt').text(info.txt);
							if (index == response.length-1) {
								$.get('tpl/loadMore-box.html', function (loadMore) {
									$('#myNote-tabpanel .panel.box').last().after(loadMore);
								});
							}
						});
					})(response[i], i);
				}
			}, 'json');
		}
	}).on('hidden.bs.modal', '#remote-modal', function () {
		$(this).removeData('bs.modal');
	}).on('click', '.addNote', function () {
		ue = UE.getEditor('editor-container');
	}).on('shown.bs.modal', '#addNote-panel', function () {
		ue.ready(function () {
			var html = getContent(ue);
			if (html) {
				if (!confirm("您上次编辑的内容尚未保存，是否继续编辑？")) {
					clearContent(ue, $('#edit-form'));
				}
			}
		});
	}).on('click', '#to-myNote', function () {
		$('#nav-myNote a').tab('show');
	}).on('click', '#to-groupNotes', function () {
		$('#nav-groupNotes a').tab('show');
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
		} else {
			$(this).after('<span class="text-danger"> 请填写完整的登录信息</span>');
			return false;
		}
	}).on('click', '#edit-submit', function () {
		if (sessionStorage.name) {
			if ($('.edit-title').val() == '') {
				$('.edit-title').val($('.edit-title').attr('placeholder'));
			}
			$('#edit-user').val(sessionStorage.name);
			$('#edit-type').val('personal');
			$('#edit-txt').val(getContentTxt(ue));
			$('#editor-container').val(getContent(ue));
			var option = {
				type: 'POST',
				data: $('#edit-form').serialize(),
				dataType: 'json',
				url: 'data/add_note.php',
				beforeSubmit: function () {
					$('#loading-alert').addClass('alert-info').append('<p>数据提交中 <i class="icon-spinner"></i></p>').removeClass('hidden');
					$('button:visible').addClass('disabled');
				},
				success: function (response) {
					$('#loading-alert p').remove();
					$('#loading-alert').removeClass('alert-info').addClass('alert-success').append('<p>数据保存成功！ <i class="icon-ok"></i></p>');
					setTimeout(function () {
						(function (info) {
							$.get('tpl/note-box.html', function (html) {
								$('#myNote-tabpanel .row .addNote').after(html);
								$('#myNote-tabpanel .panel.box').eq(0).addClass('panel-' + info.label).data('content', info.content);
								$('#myNote-tabpanel .panel.box').eq(0).find('.panel-title').text(info.title);
								$('#myNote-tabpanel .panel.box').eq(0).find('.note-txt').text(info.txt);
							});
						})(response);
						$('button:visible').removeClass('disabled');
						$('#addNote-panel').modal('hide');
						$('#loading-alert').addClass('hidden').removeClass('alert-success');
						$('#loading-alert p').remove();
						clearContent(ue, $('#edit-form'));
					}, 2000);
				}
			}
			$('#edit-form').ajaxForm(option);
		} else {
			alert('请登录......');
			$('#addNote-panel').modal('hide');
			if ($('#no-login-btn:visible')) {
				$('#no-login-btn').trigger('click');
			} else if ($('#login-reg-btn:visible')) {
				$('#no-login-btn').trigger('click');
			}
			return false;
		}
	}).on('click', '#edit-cancel', function () {
		var html = getContent(ue);
		if (html) {
			if (confirm("是否清除所编辑的内容？")) {
				clearContent(ue, $('#edit-form'));
			}
		}
	}).on('click', '#myNote-tabpanel .box.panel', function () {
		var $this = $(this);
		setTimeout(function () {
			$('#remote-modal .note-title').text($this.find('.panel-title').text());
			$('#remote-modal .note-content').html($this.data('content'));
		}, 100)
	}).on('click', '#myNote-tabpanel .box.loadMore', function () {
		var $this = $(this);
		var oldNum = $('#note-container').children().length-1;
		var count = 5;
		$.get('data/show_note.php', {start: oldNum, count: count, user: sessionStorage.name}, function (response) {
			var length = response.length;
			if (length < count) {
				$this.remove();
				if (length == 0) {
					$('#loading-alert').addClass('alert-info').append('<p>没有更多数据了 ┐(ﾟ～ﾟ)┌ </p>').removeClass('hidden');
					setTimeout(function () {
						$('#loading-alert').addClass('hidden').removeClass('alert-info');
						$('#loading-alert p').remove();
					}, 1000);
				}
			}
			for (var i = 0; i < response.length; i++) {
				(function (info, index) {
					index += oldNum;
					$.get('tpl/note-box.html', function (html) {
						$('#note-container').append(html);
						$('#myNote-tabpanel .panel.box').eq(index).addClass('panel-' + info.label).data('content', info.content);
						$('#myNote-tabpanel .panel.box').eq(index).find('.panel-title').text(info.title);
						$('#myNote-tabpanel .panel.box').eq(index).find('.note-txt').text(info.txt);
						if (index == length+oldNum-1) {
							$this.insertAfter($('#myNote-tabpanel .panel.box').last());
						}
					});
				})(response[i], i);
			}
		}, 'json');
	});
});

