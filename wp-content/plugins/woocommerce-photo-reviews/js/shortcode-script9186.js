'use strict';
let slides;
let current_shortcode_id;
jQuery(window).on('elementor/frontend/init', () => {
    elementorFrontend.hooks.addAction('frontend/element_ready/woocommerce-photo-reviews.default', function ($scope) {
        if (!window.elementor) {
            return;
        }
        let $shortcode_container = $scope.find('.woocommerce-photo-reviews-shortcode');
        let current = -1;
        let swipeBoxIndex = 0;
        triggerReviewImageClick();

        function triggerReviewImageClick() {
            $shortcode_container.find('.shortcode-wcpr-grid-item .shortcode-reviews-images').unbind().on('click', function (e) {
                let this_image = jQuery(this);
                let reviews_shortcode = $shortcode_container.data('reviews_shortcode');
                if (reviews_shortcode.hasOwnProperty('masonry_popup') && reviews_shortcode.masonry_popup === 'image') {
                    e.stopPropagation();
                    let $container = this_image.closest('.shortcode-reviews-images-container');
                    let data = [];
                    $container.find('.shortcode-reviews-images-wrap-left').find('a').map(function () {
                        let current_image = jQuery(this).find('.shortcode-reviews-images');
                        let href = jQuery(this).data('image_src') ? jQuery(this).data('image_src') : current_image.attr('src');
                        let title = jQuery(this).data('image_caption') ? jQuery(this).data('image_caption') : ((parseInt(jQuery(this).data('image_index')) + 1) + '/' + $container.find('.shortcode-reviews-images-wrap-left').find('a').length);
                        data.push({ href: href, title: title });
                    });
                    if (data.length === 0) {
                        data.push({
                            href: this_image.data('original_src') ? this_image.data('original_src') : this_image.attr('src'),
                            title: this_image.parent().find('.shortcode-wcpr-review-image-caption').html()
                        });
                    }
                    jQuery.swipebox(data, { hideBarsDelay: 100000, initialIndexOnArray: 0 })
                }
            });
        }

        function showReviewElementor(n) {
            swipeBoxIndex = 0;
            current = n;
            if (n >= slides.length) {
                current = 0
            }
            if (n < 0) {
                current = slides.length - 1
            }
            jQuery('#shortcode-reviews-content-left-modal').html('');
            jQuery('#shortcode-reviews-content-left-main').html('');
            let $current = jQuery(slides[current]);
            if ($current.find('.shortcode-reviews-images-container').length == 0) {
                jQuery('.shortcode-wcpr-modal-light-box').addClass('shortcode-wcpr-no-images');
            } else {
                jQuery('#shortcode-reviews-content-left-modal').html(($current.find('.shortcode-reviews-images-wrap-left').html()));
                let img_data = $current.find('.shortcode-reviews-images-wrap-right').html();
                if (img_data) {
                    jQuery('.shortcode-wcpr-modal-light-box').removeClass('shortcode-wcpr-no-images');
                    jQuery('#shortcode-reviews-content-left-main').html(img_data);
                }
                jQuery('#shortcode-reviews-content-left-modal').find('.shortcode-reviews-images').parent().on('click', function () {
                    swipeBoxIndex = jQuery(this).data('image_index');
                    jQuery('#shortcode-reviews-content-left-main').find('.shortcode-reviews-images').attr('src', jQuery(this).attr('href'));
                    jQuery('#shortcode-reviews-content-left-main').find('.shortcode-wcpr-review-image-caption').html(jQuery(this).data('image_caption'));
                    return false;
                });
            }
            jQuery('#shortcode-reviews-content-right .shortcode-reviews-content-right-meta').html($current.find('.shortcode-review-content-container').html());
            jQuery('#shortcode-reviews-content-right .shortcode-wcpr-single-product-summary').html($current.find('.shortcode-wcpr-single-product-summary-content-wrapper').html());
            jQuery('.shortcode-wcpr-modal-light-box').fadeIn(200);
        }

        jQuery('.shortcode-wcpr-modal-light-box').keydown(function (e) {
            if (jQuery.swipebox.isOpen) {
                return;
            }
            if (jQuery('.shortcode-wcpr-modal-light-box').css('display') == 'none') {
                return;
            }
            if (e.keyCode == 27) {
                jQuery('.shortcode-wcpr-modal-light-box').fadeOut(200);
                jQuery('.shortcode-wcpr-modal-light-box').removeClass(current_shortcode_id + '-modal');
                current = -1;

            }
            if (current != -1) {
                if (e.keyCode == 37) {
                    showReviewElementor(current -= 1);
                }

                if (e.keyCode == 39) {
                    showReviewElementor(current += 1);
                }
            }
        });
        triggerReviewClickElementor();

        function triggerReviewClickElementor() {
            $shortcode_container.find('.shortcode-wcpr-grid-item').unbind().on('click', function () {
                let reviews_shortcode = $shortcode_container.data('reviews_shortcode');

                if (reviews_shortcode.hasOwnProperty('masonry_popup') && reviews_shortcode.masonry_popup === 'review') {
                    if (reviews_shortcode.hasOwnProperty('full_screen_mobile') && reviews_shortcode.full_screen_mobile === 'on') {
                        jQuery('.shortcode-wcpr-modal-light-box').addClass('shortcode-wcpr-full-screen-mobile');
                    } else {
                        jQuery('.shortcode-wcpr-modal-light-box').removeClass('shortcode-wcpr-full-screen-mobile');
                    }
                    slides = $shortcode_container.find('.shortcode-wcpr-grid-item');
                    let i = slides.index(jQuery(this));
                    if (i >= 0) {
                        jQuery('.shortcode-wcpr-modal-light-box').removeClass(current_shortcode_id + '-modal');
                        current_shortcode_id = $shortcode_container.attr('id');
                        jQuery('.shortcode-wcpr-modal-light-box').addClass(current_shortcode_id + '-modal');
                        showReviewElementor(i);
                        wcpr_disable_scroll();
                        wcpr_helpful_button();
                    }
                }
            });
            $shortcode_container.find('.shortcode-wcpr-read-more').unbind().on('click', function (e) {
                e.stopPropagation();
                let $button = jQuery(this);
                let $comment_content = $button.closest('.shortcode-wcpr-review-content');
                let $comment_content_full = $comment_content.find('.shortcode-wcpr-review-content-full');
                let comment_content_full = $comment_content_full.html();
                if (comment_content_full) {
                    $comment_content.html(comment_content_full);
                }
            })
        }
    });
});
jQuery(document).ready(function ($) {
    /*Masonry*/
    let current = -1;
    let swipeBoxIndex = 0;
    $('.shortcode-wcpr-close').on('click', function () {
        closeReviewPopUp();

    });
    $('.shortcode-wcpr-modal-light-box .shortcode-wcpr-overlay').on('click', function () {
        closeReviewPopUp();
    });
    $('#shortcode-reviews-content-left-main').on('click', '.shortcode-reviews-images', function () {
        let this_image = $(this);
        let data = [];
        $('#shortcode-reviews-content-left-modal').find('a').map(function () {
            let current_image = $(this).find('.shortcode-reviews-images');
            let href = $(this).data('image_src') ? $(this).data('image_src') : current_image.attr('src');
            let title = $(this).data('image_caption') ? $(this).data('image_caption') : ((parseInt($(this).data('image_index')) + 1) + '/' + $('#shortcode-reviews-content-left-modal').find('a').length);
            data.push({ href: href, title: title });
        });
        if (data.length === 0) {
            data.push({
                href: this_image.data('original_src') ? this_image.data('original_src') : this_image.attr('src'),
                title: this_image.parent().find('.shortcode-wcpr-review-image-caption').html()
            });
        }
        $.swipebox(data, { hideBarsDelay: 100000, initialIndexOnArray: swipeBoxIndex })
    });
    triggerReviewImageClick();

    function closeReviewPopUp() {
        wcpr_enable_scroll();
        $('.shortcode-wcpr-modal-light-box').fadeOut(200);
        current = -1;
    }
    function triggerReviewImageClick() {
        $('.shortcode-wcpr-grid-item .shortcode-reviews-images').unbind().on('click', function (e) {
            let this_image = $(this);
            let $shortcode_container = this_image.closest('.woocommerce-photo-reviews-shortcode');
            let reviews_shortcode = $shortcode_container.data('reviews_shortcode');
            if (reviews_shortcode.hasOwnProperty('masonry_popup') && reviews_shortcode.masonry_popup === 'image') {
                e.stopPropagation();
                let $container = this_image.closest('.shortcode-reviews-images-container');
                let data = [];
                $container.find('.shortcode-reviews-images-wrap-left').find('a').map(function () {
                    let current_image = $(this).find('.shortcode-reviews-images');
                    let href = $(this).data('image_src') ? $(this).data('image_src') : current_image.attr('src');
                    let title = $(this).data('image_caption') ? $(this).data('image_caption') : ((parseInt($(this).data('image_index')) + 1) + '/' + $container.find('.shortcode-reviews-images-wrap-left').find('a').length);
                    data.push({ href: href, title: title });
                });
                if (data.length === 0) {
                    data.push({
                        href: this_image.data('original_src') ? this_image.data('original_src') : this_image.attr('src'),
                        title: this_image.parent().find('.shortcode-wcpr-review-image-caption').html()
                    });
                }
                $.swipebox(data, { hideBarsDelay: 100000, initialIndexOnArray: 0 })
            }
        });
    }

    function showReview(n) {
        swipeBoxIndex = 0;
        current = n;
        if (n >= slides.length) {
            current = 0
        }
        if (n < 0) {
            current = slides.length - 1
        }
        $('#shortcode-reviews-content-left-modal').html('');
        $('#shortcode-reviews-content-left-main').html('');
        let $current = $(slides[current]);
        if ($current.find('.shortcode-reviews-images-container').length == 0) {
            $('.shortcode-wcpr-modal-light-box').addClass('shortcode-wcpr-no-images');
        } else {
            $('#shortcode-reviews-content-left-modal').html(($current.find('.shortcode-reviews-images-wrap-left').html()));
            let img_data = $current.find('.shortcode-reviews-images-wrap-right').html();
            if (img_data) {
                $('.shortcode-wcpr-modal-light-box').removeClass('shortcode-wcpr-no-images');
                $('#shortcode-reviews-content-left-main').html(img_data);
            }
            $('#shortcode-reviews-content-left-modal').find('.shortcode-reviews-images').parent().on('click', function () {
                swipeBoxIndex = $(this).data('image_index');
                $('#shortcode-reviews-content-left-main').find('.shortcode-reviews-images').attr('src', $(this).attr('href'));
                $('#shortcode-reviews-content-left-main').find('.shortcode-wcpr-review-image-caption').html($(this).data('image_caption'));
                return false;
            });
        }
        $('#shortcode-reviews-content-right .shortcode-reviews-content-right-meta').html($current.find('.shortcode-review-content-container').html());
        $('#shortcode-reviews-content-right .shortcode-wcpr-single-product-summary').html($current.find('.shortcode-wcpr-single-product-summary-content-wrapper').html());
        $('.shortcode-wcpr-modal-light-box').fadeIn(200);
    }

    $(document).keydown(function (e) {
        if ($.swipebox.isOpen) {
            return;
        }
        if ($('.shortcode-wcpr-modal-light-box').css('display') == 'none') {
            return;
        }
        if (e.keyCode == 27) {
            closeReviewPopUp();
        }
        if (current != -1) {
            if (e.keyCode == 37) {
                showReview(current -= 1);
            }

            if (e.keyCode == 39) {
                showReview(current += 1);
            }
        }
    });
    triggerReviewClick();

    function triggerReviewClick() {
        $('.shortcode-wcpr-grid-item').unbind().on('click', function () {
            let $shortcode_container = $(this).closest('.woocommerce-photo-reviews-shortcode');
            let reviews_shortcode = $shortcode_container.data('reviews_shortcode');
            if (reviews_shortcode.hasOwnProperty('masonry_popup') && reviews_shortcode.masonry_popup === 'review') {
                if (reviews_shortcode.hasOwnProperty('full_screen_mobile') && reviews_shortcode.full_screen_mobile === 'on') {
                    $('.shortcode-wcpr-modal-light-box').addClass('shortcode-wcpr-full-screen-mobile');
                } else {
                    $('.shortcode-wcpr-modal-light-box').removeClass('shortcode-wcpr-full-screen-mobile');
                }
                slides = $shortcode_container.find('.shortcode-wcpr-grid-item');
                let i = slides.index($(this));
                if (i >= 0) {
                    $('.shortcode-wcpr-modal-light-box').removeClass(current_shortcode_id + '-modal');
                    current_shortcode_id = $shortcode_container.attr('id');
                    $('.shortcode-wcpr-modal-light-box').addClass(current_shortcode_id + '-modal');
                    showReview(i);
                    wcpr_disable_scroll();
                    wcpr_helpful_button();
                }
            }
        });
        $('.shortcode-wcpr-read-more').unbind().on('click', function (e) {
            e.stopPropagation();
            let $button = $(this);
            let $comment_content = $button.closest('.shortcode-wcpr-review-content');
            let $comment_content_full = $comment_content.find('.shortcode-wcpr-review-content-full');
            let comment_content_full = $comment_content_full.html();
            if (comment_content_full) {
                $comment_content.html(comment_content_full);
            }
        })
    }

    $('body').on('click', '.shortcode-wcpr-next', function () {
        showReview(current += 1);
    });
    $('body').on('click', '.shortcode-wcpr-prev', function () {
        showReview(current -= 1);
    });

    /*Mobile swipe support*/
    // let el = document.getElementById('shortcode-wcpr-modal-wrap');
    // if (el !== null) {
    //     viSwipeDetect(el, function (swipedir) {
    //         switch (swipedir) {
    //             case 'left':
    //                 $('.shortcode-wcpr-prev').click();
    //                 break;
    //             case 'right':
    //                 $('.shortcode-wcpr-next').click();
    //                 break;
    //             case 'up':
    //             case 'down':
    //                 $('.shortcode-wcpr-overlay').click();
    //                 break;
    //         }
    //     });
    // }
    /*Ajax pagination*/
    let ajax_pagination_running = false;
    let wcpr_image = '', wcpr_verified = '', wcpr_rating = '';
    $(document).on('click', 'a.wcpr-page-numbers', function (e) {
        let $button = $(this);
        let $container = $button.closest('.woocommerce-photo-reviews-shortcode');
        wcpr_image = $container.data('wcpr_image');
        wcpr_verified = $container.data('wcpr_verified');
        wcpr_rating = $container.data('wcpr_rating');
        let reviews_shortcode = $container.data('reviews_shortcode');
        if (!reviews_shortcode.hasOwnProperty('pagination_ajax') || reviews_shortcode.pagination_ajax !== 'on') {
            return;
        }
        if (ajax_pagination_running) {
            return false;
        }
        let scrollTop = parseInt($container.offset().top);
        window.scrollTo({ top: scrollTop, behavior: 'smooth' });
        ajax_pagination_running = true;
        e.preventDefault();
        $container.addClass('woocommerce-photo-reviews-shortcode-loading');
        $.ajax({
            url: woocommerce_photo_reviews_shortcode_params.ajaxurl,
            type: 'get',
            data: {
                action: 'woocommerce_photo_reviews_shortcode_ajax_get_reviews',
                reviews_shortcode: JSON.stringify(reviews_shortcode),
                wcpr_page: parseInt($button.html()),
                wcpr_image: wcpr_image,
                wcpr_verified: wcpr_verified,
                wcpr_rating: wcpr_rating,
            },
            success: function (response) {
                $container.html(response.html);
                $container.data('wcpr_image', wcpr_image);
                $container.data('wcpr_verified', wcpr_verified);
                $container.data('wcpr_rating', wcpr_rating);
            },
            error: function (err) {

            },
            complete: function () {
                if (reviews_shortcode.hasOwnProperty('style') && reviews_shortcode.style === 'masonry') {
                    triggerReviewClick();
                    if (reviews_shortcode.hasOwnProperty('masonry_popup') && reviews_shortcode.masonry_popup === 'image') {
                        triggerReviewImageClick()
                    }
                }
                wcpr_helpful_button();
                ajax_pagination_running = false;
                $container.removeClass('woocommerce-photo-reviews-shortcode-loading');
            }
        });
    });
    $(document).on('click', 'a.shortcode-wcpr-filter-button', function (e) {
        let $button = $(this);
        let $container = $button.closest('.woocommerce-photo-reviews-shortcode');
        let reviews_shortcode = $container.data('reviews_shortcode');
        if (!reviews_shortcode.hasOwnProperty('pagination_ajax') || reviews_shortcode.pagination_ajax !== 'on') {
            return;
        }
        if (ajax_pagination_running || (parseInt($button.find('.shortcode-wcpr-filter-button-count').html()) === 0 && !$button.hasClass('shortcode-wcpr-active'))) {
            return false;
        }
        wcpr_image = $container.data('wcpr_image');
        wcpr_verified = $container.data('wcpr_verified');
        wcpr_rating = $container.data('wcpr_rating');
        let filter_type = $button.data('filter_type');
        switch (filter_type) {
            case 'all':
                if ($button.hasClass('shortcode-wcpr-active')) {
                    return false;
                } else {
                    wcpr_rating = '';
                }
                break;
            case 'image':
                if ($button.hasClass('shortcode-wcpr-active')) {
                    wcpr_image = '';
                } else {
                    wcpr_image = 1;
                }

                break;
            case 'verified':
                if ($button.hasClass('shortcode-wcpr-active')) {
                    wcpr_verified = '';
                } else {
                    wcpr_verified = 1;
                }
                break;
            default:
                if ($button.hasClass('shortcode-wcpr-active')) {
                    return false;
                } else {
                    wcpr_rating = filter_type;
                }
        }
        let scrollTop = parseInt($container.offset().top);
        window.scrollTo({ top: scrollTop, behavior: 'smooth' });
        ajax_pagination_running = true;
        e.preventDefault();
        $container.addClass('woocommerce-photo-reviews-shortcode-loading');
        $.ajax({
            url: woocommerce_photo_reviews_shortcode_params.ajaxurl,
            type: 'get',
            data: {
                action: 'woocommerce_photo_reviews_shortcode_ajax_get_reviews',
                reviews_shortcode: JSON.stringify(reviews_shortcode),
                wcpr_image: wcpr_image,
                wcpr_verified: wcpr_verified,
                wcpr_rating: wcpr_rating,
            },
            success: function (response) {
                $container.html(response.html);
                $container.data('wcpr_image', wcpr_image);
                $container.data('wcpr_verified', wcpr_verified);
                $container.data('wcpr_rating', wcpr_rating);
            },
            error: function (err) {

            },
            complete: function () {
                if (reviews_shortcode.hasOwnProperty('style') && reviews_shortcode.style === 'masonry') {
                    triggerReviewClick();
                    if (reviews_shortcode.hasOwnProperty('masonry_popup') && reviews_shortcode.masonry_popup === 'image') {
                        triggerReviewImageClick()
                    }
                }
                wcpr_helpful_button();
                ajax_pagination_running = false;
                $container.removeClass('woocommerce-photo-reviews-shortcode-loading');
            }
        });
    });
});

function wcpr_enable_scroll() {
    let scrollTop = parseInt(jQuery('html').css('top'));
    jQuery('html').removeClass('shortcode-wcpr-noscroll');
    jQuery('html,body').scrollTop(-scrollTop);
}

function wcpr_disable_scroll() {
    if (jQuery(document).height() > jQuery(window).height()) {
        let scrollTop = (jQuery('html').scrollTop()) ? jQuery('html').scrollTop() : jQuery('body').scrollTop(); // Works for Chrome, Firefox, IE...
        jQuery('html').addClass('shortcode-wcpr-noscroll').css('top', -scrollTop);
    }
}