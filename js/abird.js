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
	}).on('focus', '#useremail', function () {
		var host = ['qq.com', 'gmail.com', 'sina.com', '126.com', '163.com'];
		for (var i = 0; i < host.length; i++) {
			$('.email-list').append('<li class="email-list-item"><span class="userinput"></span>@' + host[i] + '</li>');
		}
		$('.email-list').removeClass('hide');
	}).on('keyup', '#useremail', function (e) {
		e.preventDefault();
		if (e.keyCode != 13 || e.keyCode != 38 || e.keyCode != 40) {
			$('.userinput').text($(this).val());
		}
	}).on('keydown', '#useremail', function (e) {
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
	}).on('blur', '#useremail', function () {
		$('.email-list').addClass('hide');
	}).on('mousedown', '.email-list-item', function () {
		$('#useremail').val($(this).text());
		$('.email-list').addClass('hide');
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