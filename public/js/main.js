(function(root) {
	"use strict";

	var hasGlobals = false;

	root.clarkInit = function() {

		var $ = root.jQuery;

		// Modern jQuery's .offset() calls getClientRects() on the target, which
		// window/document don't have — Stellar's _detectViewport calls .offset()
		// on the viewport ($(window)). Shim window offset to a default box.
		if ($ && $.fn && $.fn.offset) {
			var __offset = $.fn.offset;
			$.fn.offset = function(options) {
				if (!options && this[0] && this[0] === root) {
					return { top: 0, left: 0 };
				}
				return __offset.apply(this, arguments);
			};
		}

		if (!$.fn.owlCarousel || !$.fn.waypoint) {
			return;
		}

		if (!hasGlobals) {
			hasGlobals = true;

			AOS.init({
				duration: 800,
				easing: 'slide'
			});

			$(window).stellar({
				responsive: true,
				parallaxBackgrounds: true,
				parallaxElements: true,
				horizontalScrolling: false,
				hideDistantElements: false,
				scrollProperty: 'scroll'
			});

			var loader = function() {
				setTimeout(function() {
					if ($('#ftco-loader').length > 0) {
						$('#ftco-loader').removeClass('show');
					}
				}, 1);
			};
			loader();

			// Scrollax
			$.Scrollax();

			// Burger Menu
			var burgerMenu = function() {
				$('body').on('click', '.js-fh5co-nav-toggle', function(event) {
					event.preventDefault();
					if ($('#ftco-nav').is(':visible')) {
						$(this).removeClass('active');
					} else {
						$(this).addClass('active');
					}
				});
			};
			burgerMenu();

			var onePageClick = function() {
				$(document).on('click', '#ftco-nav a[href^="#"]', function(event) {
					if ($(this).hasClass('dropdown-toggle')) {
						return;
					}
					event.preventDefault();
					var href = $.attr(this, 'href');
					$('html, body').animate({
						scrollTop: $($.attr(this, 'href')).offset().top - 70
					}, 500);
				});
			};
			onePageClick();

			var dropdownMenu = function() {
				var hoverable = window.matchMedia
					? window.matchMedia('(hover: hover) and (pointer: fine)').matches
					: false;

				var setOpen = function(li, open) {
					var $li = $(li);
					$li.toggleClass('show', open);
					$li.find('> .dropdown-toggle').attr('aria-expanded', open);
					$li.find('> .dropdown-menu').toggleClass('show', open);
				};

				var closeAll = function() {
					$('#ftco-nav .nav-item.dropdown').each(function() {
						setOpen(this, false);
					});
				};

				if (hoverable) {
					$('#ftco-nav .nav-item.dropdown')
						.on('mouseenter', function() {
							setOpen(this, true);
						})
						.on('mouseleave', function() {
							setOpen(this, false);
						});
				}

				$('#ftco-nav').on('click', '.nav-item.dropdown > .dropdown-toggle', function(event) {
					event.preventDefault();
					var $li = $(this).closest('.nav-item.dropdown');
					setOpen($li, !$li.hasClass('show'));
				});

				$('#ftco-nav').on('click', '.nav-item.dropdown .dropdown-item', closeAll);

				$(document).on('click', function(event) {
					if (!$(event.target).closest('#ftco-nav .nav-item.dropdown').length) {
						closeAll();
					}
				});
			};
			dropdownMenu();

			// scroll
			var scrollWindow = function() {
				$(window).scroll(function() {
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
			scrollWindow();

			// magnific popup
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
				image: {
					verticalFit: true
				},
				zoom: {
					enabled: true,
					duration: 300
				}
			});

			$('.popup-youtube, .popup-vimeo, .popup-gmaps').magnificPopup({
				disableOn: 700,
				type: 'iframe',
				mainClass: 'mfp-fade',
				removalDelay: 160,
				preloader: false,
				fixedContentPos: false
			});
		}

		// DOM-scoped initializers, re-run on each rendered view

		var fullHeight = function() {
			$('.js-fullheight').css('height', $(window).height());
			$(window).resize(function() {
				$('.js-fullheight').css('height', $(window).height());
			});
		};
		fullHeight();

		var carousel = function() {
			$('.home-slider').owlCarousel({
				loop: true,
				autoplay: true,
				margin: 0,
				animateOut: 'fadeOut',
				animateIn: 'fadeIn',
				nav: false,
				autoplayHoverPause: false,
				items: 1,
				navText: ["<span class='ion-md-arrow-back'></span>", "<span class='ion-chevron-right'></span>"],
				responsive: {
					0: { items: 1 },
					600: { items: 1 },
					1000: { items: 1 }
				}
			});
		};
		carousel();

		var counter = function() {
			$('#section-counter, .hero-wrap, .ftco-counter, .ftco-about').waypoint(function(direction) {
				if (direction === 'down' && !$(this.element).hasClass('ftco-animated')) {
					var comma_separator_number_step = $.animateNumber.numberStepFactories.separator(',');
					$('.number').each(function() {
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
		counter();

		var contentWayPoint = function() {
			var i = 0;
			$('.ftco-animate').waypoint(function(direction) {
				if (direction === 'down' && !$(this.element).hasClass('ftco-animated')) {
					i++;
					$(this.element).addClass('item-animate');
					setTimeout(function() {
						$('body .ftco-animate.item-animate').each(function(k) {
							var el = $(this);
							setTimeout(function() {
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
		contentWayPoint();

		if ($.fn.aos && typeof AOS !== 'undefined' && AOS.refresh) {
			AOS.refresh();
		}
	};

})(window);