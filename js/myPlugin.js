(function ($) {
	$.fn.extend({
		emailList: function (option) {

			var $this = this;
			$this.after('<div class="email-container"><ul class="email-list"></ul><div>');

			var defaults = {
				'hosts': ['qq.com', 'gmail.com', 'sina.com', '126.com', '163.com']

				,'style': {
					'container': {
						'position': 'relative'
					}
					,'list': {
						'position': 'absolute'
						,'margin-top': 5
						,'border': '1px solid #ccc'
						,'border-radius': 5
						,'background-color': '#fff'
						,'list-style': 'none'
						,'padding': 0
					}
					,'item': {
						'padding': 5
						,'cursor': 'default'
					}
					,'highlight': {
						'background-color': '#23b5f9'
					},'normal': {
						'background-color': 'transparent'
					}
				}

				,init: function () {
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

					$('.email-container').css(defaults['style']['container'])
					.find('.email-list').css(defaults['style']['list'])
					.find('.email-list-item').css(defaults['style']['item']);
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
					$('.email-list-item.highlight').css(defaults['style']['highlight']);
					$('.email-list-item:not(.highlight)').css(defaults['style']['normal']);
				}

				,mousedown: function (e) {
					$this.val($(e.target).text());
					$('.email-list').hide();
				}

				,show: function () {
					$('.email-list').show();
				}

				,hide: function () {
					$('.email-list').hide();
				}
			};

			if (option) {
				if (option['hosts']) {
					defaults['hosts'] = option['hosts'];
				}
			}

			defaults.init();
			$this.keydown(defaults.keydown).focus(defaults.show)/*.blur(defaults.hide)*/;
			$('.email-list').mousedown(defaults.mousedown).on('mouseover', '.email-list-item', function () {
				$(this).css(defaults['style']['highlight']);
			}).on('mouseout', '.email-list-item', function () {
				$(this).css(defaults['style']['normal']);
			});

			return this;
		}
	});
})(jQuery);

/*
* 一个小规范：
* 对于对象，属性使用"['属性名']"，方法使用"."
* 对象的属性和方法定义前使用","防止出错
* 对象的属性定义方式"'属性名'"
*/