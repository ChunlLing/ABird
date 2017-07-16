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
		if ($(this).next('span')) {
			$(this).next('span').remove();
		}
		$(this).parents('.form-group').attr('class', 'form-group has-feedback');
	}).on('blur', '#reg-username', function () {
		var pattern = /[\w\u4e00-\u9fa5]/;
		if (pattern.test($(this).val())) {
			$(this).after('<span class="glyphicon glyphicon-ok form-control-feedback"></span>');
			$(this).parents('.form-group').addClass('has-success');
		} else {
			$(this).after('<span class="glyphicon glyphicon-remove form-control-feedback"></span>');
			$(this).parents('.form-group').addClass('has-error');
		}
	}).on('focus', '#reg-useremail', function () {
		var host = ['qq.com', 'gmail.com', 'sina.com', '126.com', '163.com'];
		for (var i = 0; i < host.length; i++) {
			$('.email-list').append('<li class="email-list-item"><span class="userinput"></span>@' + host[i] + '</li>');
		}
		if ($(this).next('span')) {
			$(this).next('span').remove();
		}
		$(this).parents('.form-group').attr('class', 'form-group has-feedback');
		$('.email-list').removeClass('hide');
	}).on('blur', '#reg-useremail', function () {
		$('.email-list').addClass('hide');
		var pattern = /^[\w]+@[\w]{2,4}\.[\w]{2,3}$/;
		if (pattern.test($(this).val())) {
			$(this).after('<span class="glyphicon glyphicon-ok form-control-feedback"></span>');
			$(this).parents('.form-group').addClass('has-success');
		} else {
			$(this).after('<span class="glyphicon glyphicon-remove form-control-feedback"></span>');
			$(this).parents('.form-group').addClass('has-error');
		}
	}).on('keyup', '#reg-useremail', function (e) {
		e.preventDefault();
		if (e.keyCode != 13 || e.keyCode != 38 || e.keyCode != 40) {
			$('.userinput').text($(this).val());
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
		if ($(this).next('span')) {
			$(this).next('span').remove();
		}
		$(this).parents('.form-group').attr('class', 'form-group has-feedback');
	}).on('blur', '#reg-userPSW', function () {
		var pattern = /^[\w]{6,20}$/;
		if (pattern.test($(this).val())) {
			$(this).after('<span class="glyphicon glyphicon-ok form-control-feedback"></span>');
			$(this).parents('.form-group').addClass('has-success');
		} else {
			$(this).after('<span class="glyphicon glyphicon-remove form-control-feedback"></span>');
			$(this).parents('.form-group').addClass('has-error');
		}
	}).on('focus', '#reg-userPSWAgain', function () {
		if ($(this).next('span')) {
			$(this).next('span').remove();
		}
		$(this).parents('.form-group').attr('class', 'form-group has-feedback');
	}).on('blur', '#reg-userPSWAgain', function () {
		if ($(this).val() == $('#reg-userPSW').val()) {
			$(this).after('<span class="glyphicon glyphicon-ok form-control-feedback"></span>');
			$(this).parents('.form-group').addClass('has-success');
		} else {
			$(this).after('<span class="glyphicon glyphicon-remove form-control-feedback"></span>');
			$(this).parents('.form-group').addClass('has-error');
		}
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