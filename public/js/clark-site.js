(function ($) {
	"use strict";

	var navInited = false;
	var homeInited = false;
	var singleInited = false;

	var fullHeight = function () {
		$('.js-fullheight').css('height', $(window).height());
	};

	var loader = function () {
		setTimeout(function () {
			var $loader = $('#ftco-loader');
			if ($loader.length > 0) {
				$loader.removeClass('show');
			}
		}, 1);
	};

	var scrollWindow = function () {
		$(window).on('scroll', function () {
			var $w = $(this),
				st = $w.scrollTop(),
				navbar = $('.ftco_navbar'),
				sd = $('.js-scroll-wrap');

			if (st > 150) {
				if (!navbar.hasClass('scrolled')) {
					navbar.addClass('scrolled');
				}
			}
			if (st < 150) {
				if (navbar.hasClass('scrolled')) {
					navbar.removeClass('scrolled sleep');
				}
			}
			if (st > 350) {
				if (!navbar.hasClass('awake')) {
					navbar.addClass('awake');
				}
				if (sd.length > 0) {
					sd.addClass('sleep');
				}
			}
			if (st < 350) {
				if (navbar.hasClass('awake')) {
					navbar.removeClass('awake');
					navbar.addClass('sleep');
				}
				if (sd.length > 0) {
					sd.removeClass('sleep');
				}
			}
		});
	};

	var carousel = function () {
		$('.home-slider').owlCarousel({
			loop: true,
			autoplay: true,
			margin: 0,
			animateOut: 'fadeOut',
			animateIn: 'fadeIn',
			nav: false,
			autoplayHoverPause: false,
			items: 1,
			responsive: {
				0: { items: 1 },
				600: { items: 1 },
				1000: { items: 1 }
			}
		});
	};

	var counter = function () {
		$('#section-counter, .hero-wrap, .ftco-counter, .ftco-about').waypoint(function (direction) {
			if (direction === 'down' && !$(this.element).hasClass('ftco-animated')) {
				var comma_separator_number_step = $.animateNumber.numberStepFactories.separator(',');
				$('.number').each(function () {
					var $this = $(this),
						num = $this.data('number');
					$this.animateNumber({
						number: num,
						numberStep: comma_separator_number_step
					}, 7000);
				});
			}
		}, { offset: '95%' });
	};

	var contentWayPoint = function () {
		var i = 0;
		$('.ftco-animate').waypoint(function (direction) {
			if (direction === 'down' && !$(this.element).hasClass('ftco-animated')) {
				i++;
				$(this.element).addClass('item-animate');
				setTimeout(function () {
					$('body .ftco-animate.item-animate').each(function (k) {
						var el = $(this);
						setTimeout(function () {
							var effect = el.data('animate-effect');
							if (effect === 'fadeIn') {
								el.addClass('fadeIn ftco-animated');
							} else if (effect === 'fadeInLeft') {
								el.addClass('fadeInLeft ftco-animated');
							} else if (effect === 'fadeInRight') {
								el.addClass('fadeInRight ftco-animated');
							} else {
								el.addClass('fadeInUp ftco-animated');
							}
							el.removeClass('item-animate');
						}, k * 50, 'easeInOutExpo');
					});
				}, 100);
			}
		}, { offset: '95%' });
	};

	var initNav = function () {
		if (navInited) return;
		navInited = true;

		$(window).stellar({
			responsive: true,
			parallaxBackgrounds: true,
			parallaxElements: true,
			horizontalScrolling: false,
			hideDistantElements: false,
			scrollProperty: 'scroll'
		});

		loader();

		if ($.fn.Scrollax) {
			$('[data-scrollax-parent], [data-scrollax]').Scrollax();
		}

		$(window).on('resize', function () {
			$('.js-fullheight').css('height', $(window).height());
		});

		$('body').on('click', '.js-fh5co-nav-toggle', function (event) {
			event.preventDefault();
			if ($('#ftco-nav').is(':visible')) {
				$(this).removeClass('active');
			} else {
				$(this).addClass('active');
			}
		});

		$('nav .dropdown').hover(function () {
			$(this).addClass('show');
			$(this).find('> a').attr('aria-expanded', true);
			$(this).find('.dropdown-menu').addClass('show');
		}, function () {
			$(this).removeClass('show');
			$(this).find('> a').attr('aria-expanded', false);
			$(this).find('.dropdown-menu').removeClass('show');
		});

		scrollWindow();
	};

	var initHome = function () {
		if (homeInited) return;
		homeInited = true;

		if (typeof AOS !== 'undefined') {
			AOS.init({ duration: 800, easing: 'slide' });
		}

		fullHeight();
		carousel();
		counter();
		contentWayPoint();

		$('.image-popup').magnificPopup({
			type: 'image',
			closeOnContentClick: true,
			closeBtnInside: false,
			fixedContentPos: true,
			mainClass: 'mfp-no-margins mfp-with-zoom',
			gallery: {
				enabled: true,
				navigateByImgClick: true,
				preload: [0, 1]
			},
			image: { verticalFit: true },
			zoom: { enabled: true, duration: 300 }
		});

		$('.popup-youtube, .popup-vimeo, .popup-gmaps').magnificPopup({
			disableOn: 700,
			type: 'iframe',
			mainClass: 'mfp-fade',
			removalDelay: 160,
			preloader: false,
			fixedContentPos: false
		});
	};

	var initSingle = function () {
		if (singleInited) return;
		singleInited = true;

		if (typeof AOS !== 'undefined') {
			AOS.init({ duration: 800, easing: 'slide' });
		}

		fullHeight();
		contentWayPoint();
	};

	window.ClarkSite = {
		initNav: initNav,
		initHome: initHome,
		initSingle: initSingle,
		reset: function () {
			homeInited = false;
			singleInited = false;
		}
	};
})(window.jQuery);