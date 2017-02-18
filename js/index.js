;$(function () {
	// 测试
	$.cookie('user', '网络');
	$('#reg-a, #login-a').hide();

	// 未登录状态隐藏用户和退出
	// $('#member-dropdown, #logout').hide();

	// 注册对话框表单验证
	$('#reg').validate({
		errorElement : 'span',
		errorClass : 'help-block',
		rules : {
			user : {
				required : true,
				minlength : 2,
				remote : {
					url : 'is-user.php',
					type : 'POST',
				},
			},
			pass : {
				required : true,
				minlength : 6,
			},
			notpass : {
				required : true,
				equalTo : '#pass',
			},
			email : {
				required : true,
				email : true,
			},
		},
		messages : {
			user : {
				required : '昵称不得为空！',
				minlength : '昵称不得小于{0}位！',
				remote : '昵称被占用！',
			},
			pass : {
				required : '密码不得为空！',
				minlength : '密码不得小于{0}位！',
			},
			notpass : {
				required : '请再输入密码',
				equalTo : '两次密码不一致',
			},
			email : {
				required : '邮箱不得为空！',
				email : '请输入正确的邮箱格式！',
			},
		},
		errorPlacement : function(error, element) {
			element.next().remove();
			element.after('<span class="glyphicon glyphicon-remove form-control-feedback" aria-hidden="true"></span>');
			element.closest('.form-group').append(error);
		},
		highlight : function(element) {
			$(element).closest('.form-group').addClass('has-error has-feedback');
		},
		success : function(label) {
			var el = label.closest('.form-group').find("input");
			el.next().remove();
			el.after('<span class="glyphicon glyphicon-ok form-control-feedback" aria-hidden="true"></span>');
			label.closest('.form-group').removeClass('has-error').addClass("has-feedback has-success");
			label.remove();
		},
		submitHandler: function(form) { 
			$(form).ajaxSubmit({
				url : 'add_user.php',
				type : 'POST',
				beforeSubmit : function (formData, jqForm, options) {
					$('#loading-dialog').modal('show');
					$('#reg').find('button').each(function (index) {
						$(this).addClass('disabled');
					});
				},
				success : function (responseText, statusText) {
					if (responseText) {
						$('#loading-dialog').modal('hide');
						$('#reg').find('button').each(function (index) {
							$(this).removeClass('disabled');
						});
						$('#success-dialog').modal('show');
						$.cookie('user', $('#user').val());
						setTimeout(function () {
							$('#success-dialog').modal('hide');
							$('#modal-reg').modal('hide');
							$('#reg').resetForm();
							$('#reg').find('input').each(function (index) {
								$(this).removeClass().addClass('form-control');
							});
							$('#reg-a, #login-a').hide();
							$('#member-dropdown, #logout').show();
							$('#member').html($.cookie('user'));
						}, 1000);
					}
				},
			});
		}
	});

	// 登录对话框表单验证
	$('#login').validate({
		errorElement : 'span',
		errorClass : 'help-block',
		rules : {
			login_user : {
				required : true,
				minlength : 2,
			},
			login_pass : {
				required : true,
				minlength : 6,
				remote : {
					url : 'login.php',
					type : 'POST',
					data : {
						login_user : function () {
							return $('#login_user').val();
						},
					},
				},
			},
		},
		messages : {
			login_user : {
				required : '昵称不得为空！',
				minlength : '昵称不得小于{0}位！',
			},
			login_pass : {
				required : '密码不得为空！',
				minlength : '密码不得小于{0}位！',
				remote : '昵称或密码错误！',
			},
		},
		errorPlacement : function(error, element) {
			element.next().remove();
			element.after('<span class="glyphicon glyphicon-remove form-control-feedback" aria-hidden="true"></span>');
			element.closest('.form-group').append(error);
		},
		highlight : function(element) {
			$(element).closest('.form-group').addClass('has-error has-feedback');
		},
		success : function(label) {
			var el = label.closest('.form-group').find("input");
			el.next().remove();
			el.after('<span class="glyphicon glyphicon-ok form-control-feedback" aria-hidden="true"></span>');
			label.closest('.form-group').removeClass('has-error').addClass("has-feedback has-success");
			label.remove();
		},
		submitHandler: function(form) { 
			$(form).ajaxSubmit({
				url : 'login.php',
				type : 'POST',
				beforeSubmit : function (formData, jqForm, options) {
					$('#loading-dialog').modal('show');
					$('#login').find('button').each(function (index) {
						$(this).addClass('disabled');
					});
				},
				success : function (responseText, statusText) {
					if (responseText) {
						$('#loading-dialog').modal('hide');
						$('#login').find('button').each(function (index) {
							$(this).removeClass('disabled');
						});
						$('#success-dialog').modal('show');
						$.cookie('user', $('#login_user').val());
						setTimeout(function () {
							$('#success-dialog').modal('hide');
							$('#modal-login').modal('hide');
							$('#login').resetForm();
							$('#login').find('input').each(function (index) {
								$(this).removeClass().addClass('form-control');
							});
							$('#reg-a, #login-a').hide();
							$('#member-dropdown, #logout').show();
							$('#member').html($.cookie('user'));
						}, 1000);
					}
				},
			});
		}
	});

	// 发帖对话框
	$('#post').find(':submit').click(function (e) {
		e.preventDefault();
		$(this).ajaxSubmit({
			url : 'add_note.php',
			type : 'POST',
			data : {
				user : $.cookie('user'),
				post_title : $('#post_title').val(),
				post_content : $('#ueditor_0').contents().find('body').html(),
				post_label : $('#post').find(':radio:checked').val(),
			},
			beforeSubmit : function (formData, jqForm, options) {
				$('#loading-dialog').modal('show');
				$('#post').find('button').each(function (index) {
					$(this).addClass('disabled');
				});
			},
			success : function (responseText, statusText) {
				if (responseText) {
					$('#loading-dialog').modal('hide');
					$('#post').find('button').each(function (index) {
						$(this).removeClass('disabled');
					});
					$('#success-dialog').modal('show');
					setTimeout(function () {
						$('#success-dialog').modal('hide');
						$('#modal-post').modal('hide');
						$('#post').resetForm();
						$('#ueditor_0').contents().find('body').html('请输入内容...');
					}, 1000);
				}
			},
		});
	});

	// 点击退出
	$('#logout').click(function () {
		$.removeCookie('user');
		window.location.href = '/abird/';
	});

	// 编辑器初始化
	var ue = UE.getEditor('post_content', {
		elementPathEnabled : false,
		minFrameWidth : 372,
		toolbars: [['bold', 'italic', 'underline', 'fontborder', 'strikethrough', 'removeformat', 'formatmatch', 'autotypeset', 'blockquote', 'pasteplain', '|', 'selectall', 'cleardoc', 'undo', 'redo']],
	});

	// 动态添加
	$.ajax({
		url : 'show_note.php',
		type : 'POST',
		success : function (response, status, xhr) {
			var json = $.parseJSON(response);
			var html = '';
			var arr = [];
			$.each(json, function (index, value) {
				html += '<div class="note-item"><h2>' + value.title + '</h2><h5>来源：' + value.user + '</h5><span class="label label-info">' + value.label + '</span><div class="note-content">' + value.content + '</div></div>';
			});
			$('.panel-body').append(html);
		},
	});
});