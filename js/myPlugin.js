(function ($) {
	$.fn.extend({
		emailList: function (option) {

			var $this = this;
			$this.after('<div class="email-container"><ul class="email-list"></ul><div>');

			var defaults = {
				hosts: ['qq.com', 'gmail.com', 'sina.com', '126.com', '163.com'],

				init: function () {
					var hosts = this.hosts;
					$('.email-list').empty().show();
					if ($this.val().indexOf('@') != -1) {
						hosts = this.hosts.filter(function (host) {
							return !host.indexOf($this.val().slice($this.val().indexOf('@')+1));
						});
					}
					if (hosts.length != 0) {
						$('.email-list').removeClass('hidden');
						for (let i = 0; i < hosts.length; i++) {
							$('.email-list').append('<li class="email-list-item"><span class="userinput"></span>@' + hosts[i] + '</li>');
						}
						if ($this.val().indexOf('@') == -1) {
							$('.userinput').text($this.val());
						} else {
							$('.userinput').text($this.val().slice(0,$this.val().indexOf('@')));
						}
					} else {
						$('.email-list').hide();
					}
				}

				,keydown: function (e) {
					switch (e.keyCode) {
						case 13:
							// 按下回车键
							e.preventDefault();
							$(e.target).val($('.email-list-item.highlight').text());
							$('.email-list').hide();
							break;
						case 38:
							// 按下向上键
							e.preventDefault();
							if (!$('.email-list-item.highlight').is($('.email-list-item').first())) {
								$('.email-list-item.highlight').removeClass('highlight').prev().addClass('highlight');
							}
							break;
						case 40:
							// 按下向上下键
							e.preventDefault();
							if (!$('.email-list-item').is('.highlight')) {
								$('.email-list-item').first().addClass('highlight');
							} else {
								if (!$('.email-list-item.highlight').is($('.email-list-item').last())) {
									$('.email-list-item.highlight').removeClass('highlight').next().addClass('highlight');
								}
							}
							break;
						case 9:
							// 按下tab键
							$('.email-list').hide();
							break;
						default:
							setTimeout(function () {
								defaults.init();
							}, 50);
					}
				}

				,mousedown: function (e) {
					$this.val($(e.target).text());
					$('.email-list').hide();
				}
			};

			if (option) {
				if (option['hosts']) {
					defaults['hosts'] = option['hosts'];
				}
			}

			defaults.init();
			$this.keydown(defaults.keydown);
			$('.email-list').mousedown(defaults.mousedown);

			return this;
		}
	});
})(jQuery);