;$(function () {
	// 注册对话框表单验证
	$('#reg-submit').click(function () {
		$('#reg').submit();
	});
	$('#reg').validate({
		debug : true,
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
			email : {
				required : true,
				email : true,
			},
		},
		messages : {
			user : {
				required : '账号不得为空！',
				minlength : '账号不得小于{0}位！',
				remote : '账号被占用！',
			},
			pass : {
				required : '密码不得为空！',
				minlength : '密码不得小于{0}位！',
			},
			email : {
				required : '邮箱不得为空！',
				email : '请输入正确的邮箱格式！',
			},
		},
	});
			/*
	$('#reg').validate({
		submitHandler : function (form) {
			$(form).ajaxSubmit({
				url : 'add_user.php',
				type : 'POST',
				beforeSubmit : function (formData, jqForm, options) {
					alert('beforeSubmit');
				},
				success : function (responseText, statusText) {
					if (responseText) {
						$.cookie('user', $('#user').val());
					}
					else {
						console.log('error');
					}
					setTimeout(function () {
						$('#reg').hide().resetForm();
					}, 1000);
				},
			});
			alert('submitHandler');
		},
		showError : function (errorMap, errorList) {
			var errors = this.numberOfInvalids();
			if (errors > 0) {
				alert(errors);
			} else {
				alert('errors = 0');
			}
			this.defaultShowErrors();
		},
		hightlight : function (element, errorClass) {
			$(element).addClass('text-danger');
		},
		unhightlight : function (element, errorClass) {
			$(element).removeClass('text-danger');
		},

		// errorLabelContainer : 'ol.reg-error',
		// wrapper : 'li',
	});
			*/
	$('#question').validate({
		rules : {
			login_pass : {
				required : true,
				minlength : 2,
			}, 
		}
	});
});