;$(function () {
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
			var el=label.closest('.form-group').find("input");
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
						$('#loading-dialog').modal('hidden');
						$('#reg').find('button').each(function (index) {
							$(this).remoteClass('disabled');
						});
						$('#success-dialog').modal('show');
					}
				},
			});
		}
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
	});
			*/
});