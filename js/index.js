;$(function () {

	// 未登录状态隐藏用户和退出
	$('#member-dropdown, #logout').hide();

	// 如果有user名的cookie存在即用户登录
	if ($.cookie('user')) {
		$('#reg-a, #login-a').hide();
		$('#member-dropdown, #logout').show();
		$('#member').html($.cookie('user'));
	} else {
		$('#member-dropdown, #logout').hide();
		$('#reg-a, #login-a').show();
	}

	// 邮箱补全
	var hosts = ['qq.com', '163.com', 'sina.com.cn', 'gmail.com', 'sohu.com', '139.com'];
	for (var i = 0; i < hosts.length; i++) {
		var liElement = '<li><span class="inputName"></span>' + '@<span class="emailHost">' + hosts[i] + '</span></li>';
		$('.all-email').append(liElement);
	}
	$('.all-email').hide();
	$('#email').keyup(function (e) {
		if (e.keyCode != 38 && e.keyCode != 40 && e.keyCode != 13) {
			if ($.trim($(this).val()) != '' && $.trim($(this).val()).match(/^@/) == null) {
				$('.all-email').show();
				if ($('.all-email li:visible').hasClass('highlight')) {
					$('.all-email li').removeClass('highlight');
				}
				if ($('.all-email li:visible')) {
					$('.all-email li:visible:eq(0)').addClass('highlight');
				}
			} else {
				$('.all-email').hide();
				$('.all-email li').removeClass('highlight');
			}
			if ($.trim($(this).val()).match(/.*@/) == null) {
				$('.all-email li .inputName').text($(this).val());
			} else {
				var str = $(this).val();
				var strs = str.split('@');
				$('.all-email li .inputName').text(strs[0]);
				if ($(this).val().length >= strs[0].length + 1) {
					var emailHost = str.substr(strs[0].length + 1);
					$('.all-email li .emailHost').each(function () {
						if (!($(this).text().match(emailHost) != null && $(this).text().indexOf(emailHost) == 0)) {
							$(this).parent().hide();
						} else {
							$(this).parent().show();
						}
					});
				}
			}
		}
	});
	$('#email').keydown(function (e) {
		if (e.keyCode == 13) {
			e.preventDefault();
			$('#email').val($('.all-email li.highlight:visible').text());
			$('.all-email').hide();
		}
		if (e.keyCode == 40) {
			e.preventDefault();
			if ($('.all-email li').is('.highlight')) {
				if ($('.all-email li.highlight').nextAll().is('li:visible')) {
					$('.all-email li.highlight').removeClass('highlight').next('li').addClass('highlight');
				}
			}
		}
		if (e.keyCode == 38) {
			e.preventDefault();
			if ($('.all-email li').is('.highlight')) {
				if ($('.all-email li.highlight').prevAll().is('li:visible')) {
					$('.all-email li.highlight').removeClass('highlight').prev('li').addClass('highlight');
				}
			}
		}
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
						if ($('#expires').is(':checked')) {
							$.cookie('user', $('#login_user').val(), {expires : 7});
						} else {
							$.cookie('user', $('#login_user').val());
						}
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
	var number = 0;
	$('#post').find(':submit').click(function (e) {
		e.preventDefault();
		$(this).ajaxSubmit({
			url : 'add_note.php',
			type : 'POST',
			data : {
				user : $.cookie('user'),
				post_title : $('#post_title').val(),
				post_content : encodeURIComponent(ue.getContent()),
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
					$('#newTip').removeClass('hidden');
					number += 1;
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
			addNote(response, status, xhr);
		},
	});

	// 点击刷新内容
	$('#newTip').click(function () {
		$.ajax({
		url : 'show_note.php',
		type : 'POST',
		success : function (response, status, xhr) {
			addNote(response, status, xhr, number);
			number = 0;
		},
	});
		$(this).addClass('hidden');
	});
});


// 显示概要
function replascePos(strObj, pos, replaceText) {
	var str = strObj.substr(0, pos - 1) + replaceText + strObj.substring(pos, strObj.length);
	return str;
}

// 动态添加内容
function addNote(response, status, xhr, num) {
	var json = $.parseJSON(response);
	var jsonRefresh = json.slice(0, num);
	var html = new Array(4);
	$(html).each(function (index, value) {
		html[index] = '';
	});
	var html_handicraft = '';
	var html_paper = '';
	var html_cooking = '';
	var html_other = '';
	var arr = [];
	var summary = [];
	if (num) {
		$.each(jsonRefresh, function (index, value) {
			var templateHtml = '<div class="note-item"><h2>' + value.title + '</h2><h5>来源：' + value.user + '</h5><span class="label label-info">' + value.label + '</span><div class="note-content">' + decodeURIComponent(value.content) + '</div><button class="btn btn-default pull-right hidden down"><span class="glyphicon glyphicon-triangle-bottom"> 全文</span></button><button class="btn btn-default pull-right hidden up"><span class="glyphicon glyphicon-triangle-top"> 收起</span></button></div>';
			switch (value.label) {
				case '手艺' : html[0] += templateHtml;break;
				case '纸艺' : html[1] += templateHtml;break;
				case '厨艺' : html[2] += templateHtml;break;
				case '其它' : html[3] += templateHtml;break;
			}
		});
		$('#handicraft .panel-body').prepend(html[0]);
		$('#paper .panel-body').prepend(html[1]);
		$('#cooking .panel-body').prepend(html[2]);
		$('#other .panel-body').prepend(html[3]);
	} else {
		$.each(json, function (index, value) {
			var templateHtml = '<div class="note-item"><h2>' + value.title + '</h2><h5>来源：' + value.user + '</h5><span class="label label-info">' + value.label + '</span><div class="note-content">' + decodeURIComponent(value.content) + '</div><button class="btn btn-default pull-right hidden down"><span class="glyphicon glyphicon-triangle-bottom"> 全文</span></button><button class="btn btn-default pull-right hidden up"><span class="glyphicon glyphicon-triangle-top"> 收起</span></button></div>';
			switch (value.label) {
				case '手艺' : html[0] += templateHtml;break;
				case '纸艺' : html[1] += templateHtml;break;
				case '厨艺' : html[2] += templateHtml;break;
				case '其它' : html[3] += templateHtml;break;
			}
		});
		$('#handicraft .panel-body').append(html[0]);
		$('#paper .panel-body').append(html[1]);
		$('#cooking .panel-body').append(html[2]);
		$('#other .panel-body').append(html[3]);
	}
	$.each($('.note-content'), function (index, value) {
		arr[index] = $(value).html();
		summary[index] = arr[index].substr(0, 100);
		if (summary[index].substring(99, 100) == '<') {
			summary[index] = replascePos(summary[index], 100, '');
		}
		if (summary[index].substring(98, 100) == '</') {
			summary[index] = replascePos(summary[index], 100, '');
			summary[index] = replascePos(summary[index], 99, '');
		}
		if (arr[index].length > 100) {
			summary[index] += '<span><b>……</b></span>';
			$(value).html(summary[index]);
			$(value).next('button.down').removeClass('hidden');
		}
		$('button.up').addClass('hidden');
	});
	$.each($('.down'), function (index, value) {
		$(this).on('click', function () {
			$('.note-content').eq(index).html(arr[index]);
			$(this).addClass('hidden');
			$('button.up').eq(index).removeClass('hidden');
		});
	});
	$.each($('.up'), function (index, value) {
		$(this).on('click', function () {
			$('.note-content').eq(index).html(summary[index]);
			$(this).addClass('hidden');
			$('button.down').eq(index).removeClass('hidden');
		});
	});
}