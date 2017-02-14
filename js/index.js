;$(function () {
	// 未登录状态隐藏用户和退出
	$('#member, #logout').hide();

	// 点击退出
	$('#logout').click(function () {
		$.removeCookie('user');
		window.location.href = '/abird/';
	});

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
							$('#member, #logout').show();
							$('#member').html($.cookie('user'));
						}, 1000);
					}
				},
			});
		}
	});
});