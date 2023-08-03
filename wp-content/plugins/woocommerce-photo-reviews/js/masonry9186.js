'use strict';
jQuery(document).ready(function ($) {
    let current = -1;
    let slides;
    let swipeBoxIndex = 0;

    function triggerReadMoreButton() {
        $('.wcpr-read-more').on('click', function (e) {
            e.stopPropagation();
            let $button = $(this);
            let $comment_content = $button.closest('.wcpr-review-content');
            let $comment_content_full = $comment_content.find('.wcpr-review-content-full');
            let comment_content_full = $comment_content_full.html();
            if (comment_content_full) {
                $comment_content.html(comment_content_full);
            }
        })
    }

    function triggerReviewClick() {
        $(document).on('click', '.wcpr-grid-item', function () {
            slides = $('.wcpr-grid-item');
            let i = slides.index($(this));
            if (i >= 0) {
                showReview(i);
                wcpr_disable_scroll();
                wcpr_helpful_button();
            }
        });
    }

    function wcpr_enable_scroll() {
        let scrollTop = parseInt($('html').css('top'));
        $('html').removeClass('wcpr-noscroll');
        $('html,body').scrollTop(-scrollTop);
    }

    function wcpr_disable_scroll() {
        if ($(document).height() > $(window).height()) {
            let scrollTop = ($('html').scrollTop()) ? $('html').scrollTop() : $('body').scrollTop(); // Works for Chrome, Firefox, IE...
            $('html').addClass('wcpr-noscroll').css('top', -scrollTop);
        }
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
        $('#reviews-content-left-modal').html('');
        $('#reviews-content-left-main').html('');
        if ($('.wcpr-grid').find('.wcpr-grid-item').eq(current).find('.reviews-images-container').length == 0) {
            $('.wcpr-modal-light-box').addClass('wcpr-no-images');
        } else {
            $('#reviews-content-left-modal').html(($('.wcpr-grid').find('.wcpr-grid-item').eq(current).find('.reviews-images-wrap-left').html()));
            let img_data = $('.wcpr-grid').find('.wcpr-grid-item').eq(current).find('.reviews-images-wrap-right').html();
            if (img_data) {
                $('.wcpr-modal-light-box').removeClass('wcpr-no-images');
                $('#reviews-content-left-main').html(img_data);
            }
            $('#reviews-content-left-modal').find('.reviews-images').closest('a').on('click', function () {
                swipeBoxIndex = $(this).data('image_index');
                let current_image_src = $(this).attr('href');
                $('#reviews-content-left-main').find('source').attr('srcset', current_image_src);
                $('#reviews-content-left-main').find('.reviews-images').attr('src', current_image_src);
                $('#reviews-content-left-main').find('.wcpr-review-image-caption').html($(this).data('image_caption'));
                return false;
            });
        }
        $('#reviews-content-right .reviews-content-right-meta').html($('.wcpr-grid').find('.wcpr-grid-item').eq(current).find('.review-content-container').html());
        $('.wcpr-modal-light-box').fadeIn(200);
    }

    triggerReadMoreButton();
    switch (woocommerce_photo_reviews_params.masonry_popup) {
        case 'review':
            if ($('.wcpr-grid-item')) {
                slides = $('.wcpr-grid-item');
            }
            $('.wcpr-close').on('click', function () {
                wcpr_enable_scroll();
                $('.wcpr-modal-light-box').fadeOut(200);
                current = -1;

            });
            $('.wcpr-modal-light-box .wcpr-overlay').on('click', function () {
                wcpr_enable_scroll();
                $('.wcpr-modal-light-box').fadeOut(200);
                current = -1;
            });
            $('#reviews-content-left-main').on('click', '.reviews-images', function () {
                let this_image = $(this);
                let data = [];
                $('#reviews-content-left-modal').find('a').map(function () {
                    let current_image = $(this).find('.reviews-images');
                    let href = $(this).data('image_src') ? $(this).data('image_src') : current_image.attr('src');
                    let title = $(this).data('image_caption') ? $(this).data('image_caption') : ((parseInt($(this).data('image_index')) + 1) + '/' + $('#reviews-content-left-modal').find('a').length);
                    data.push({ href: href, title: title });
                });
                if (data.length == 0) {
                    data.push({
                        href: this_image.data('original_src') ? this_image.data('original_src') : this_image.attr('src'),
                        title: this_image.parent().find('.wcpr-review-image-caption').html()
                    });
                }
                $.swipebox(data, { hideBarsDelay: 100000, initialIndexOnArray: swipeBoxIndex })
            });

            $(document).keydown(function (e) {
                if ($.swipebox.isOpen) {
                    return;
                }
                if ($('.wcpr-modal-light-box').css('display') == 'none') {
                    return;
                }
                if (e.keyCode == 27) {
                    wcpr_enable_scroll();
                    $('.wcpr-modal-light-box').fadeOut(200);
                    current = -1;
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
            $('.wcpr-next').on('click', function () {
                showReview(current += 1);
            });
            $('.wcpr-prev').on('click', function () {
                showReview(current -= 1);
            });
            /*Mobile swipe support*/
            // let el = document.getElementById('wcpr-modal-wrap');
            // if (el !== null) {
            //     viSwipeDetect(el, function (swipedir) {
            //         switch (swipedir) {
            //             case 'left':
            //                 $('.wcpr-prev').click();
            //                 break;
            //             case 'right':
            //                 $('.wcpr-next').click();
            //                 break;
            //             case 'up':
            //             case 'down':
            //                 $('.wcpr-overlay').click();
            //                 break;
            //         }
            //     });
            //
            // }
            break;
        case 'image':
            $(document).on('click', '.wcpr-grid-item .reviews-images', function (e) {
                let this_image = $(this);
                e.stopPropagation();
                let $container = this_image.closest('.reviews-images-container');
                let data = [];
                $container.find('.reviews-images-wrap-left').find('a').map(function () {
                    let current_image = $(this).find('.reviews-images');
                    let href = $(this).data('image_src') ? $(this).data('image_src') : current_image.attr('src');
                    let title = $(this).data('image_caption') ? $(this).data('image_caption') : ((parseInt($(this).data('image_index')) + 1) + '/' + $container.find('.reviews-images-wrap-left').find('a').length);
                    data.push({ href: href, title: title });
                });
                if (data.length == 0) {
                    data.push({
                        href: this_image.data('original_src') ? this_image.data('original_src') : this_image.attr('src'),
                        title: this_image.parent().find('.wcpr-review-image-caption').html()
                    });
                }
                $.swipebox(data, { hideBarsDelay: 100000, initialIndexOnArray: 0 })
            });
            break;
        case 'off':
        default:
    }
    /*Ajax pagination*/
    if (woocommerce_photo_reviews_params.pagination_ajax) {
        let comments = woocommerce_photo_reviews_params.hasOwnProperty('comments_container_id') ? woocommerce_photo_reviews_params.comments_container_id : 'comments';
        let $comments = $('#' + comments);
        let ajax_pagination_running = false;
        $(document).on('click', '.woocommerce-pagination a', function (e) {
            if (ajax_pagination_running) {
                return false;
            }
            let $container = $('.wcpr-grid');
            let scrollTop = parseInt($container.offset().top) - 200;
            window.scrollTo({ top: scrollTop, behavior: 'smooth' });
            let $pagination_container = $comments.find('.woocommerce-pagination');
            ajax_pagination_running = true;
            e.preventDefault();
            let url = $(this).attr('href');
            let $overlay = $container.find('.wcpr-grid-overlay');
            $overlay.removeClass('wcpr-hidden');
            $.ajax({
                url: url,
                type: 'get',
                success: function (response) {
                    ajax_pagination_running = false;
                    if (response) {
                        response = response.replace(/(\r\n\t|\n|\r\t)/gm, "");
                        let $reg = new RegExp('<div class="' + woocommerce_photo_reviews_params.grid_class + '">([^]+?)<div class="wcpr-grid-overlay', 'gm');
                        let match = $reg.exec(response);
                        if (match != null) {
                            $container.html(match[1].substr(0, match[1].length - 6) + '<div class="wcpr-grid-overlay wcpr-hidden"></div>');
                            triggerReadMoreButton();
                            wcpr_helpful_button();
                        }
                        $reg = /class="woocommerce-pagination">([^]+?)<\/nav>/gm;
                        match = $reg.exec(response);
                        if (match != null) {
                            $pagination_container.html(match[1])
                        }
                    }
                    $overlay.addClass('wcpr-hidden');
                },
                error: function (err) {
                    ajax_pagination_running = false;
                    $overlay.addClass('wcpr-hidden');
                }
            });
        });

        let $filters = $('.wcpr-filter-container');
        if ($filters.length > 0) {
            $(document).on('click', 'a.wcpr-filter-button', function (e) {
                let $button = $(this);
                if (ajax_pagination_running || (parseInt($button.find('.wcpr-filter-button-count').html()) === 0 && !$button.hasClass('wcpr-active'))) {
                    return false;
                }
                let $pagination_container = $comments.find('.woocommerce-pagination');
                ajax_pagination_running = true;
                e.preventDefault();
                let url = $(this).attr('href');
                let $container = $('.wcpr-grid');
                if ($container.length === 0) {
                    $container = $('<div class="' + woocommerce_photo_reviews_params.grid_class + '"><div class="wcpr-grid-overlay"></div></div>');
                    $comments.append($container);
                    $('.woocommerce-noreviews').hide();
                }
                let $overlay = $container.find('.wcpr-grid-overlay');
                $overlay.removeClass('wcpr-hidden');
                $filters.addClass('wcpr-filter-loading');
                $.ajax({
                    url: url,
                    type: 'get',
                    data: {
                        'wcpr_is_ajax': 1
                    },
                    success: function (response) {
                        if (response) {
                            response = response.replace(/(\r\n\t|\n|\r\t)/gm, "");
                            let $reg = new RegExp('<div class="' + woocommerce_photo_reviews_params.grid_class + '">([^]+?)<div class="wcpr-grid-overlay', 'gm');
                            let match = $reg.exec(response);
                            if (match != null) {
                                $container.html(match[1].substr(0, match[1].length - 6) + '<div class="wcpr-grid-overlay wcpr-hidden"></div>');
                                triggerReadMoreButton();
                                wcpr_helpful_button();
                            } else {
                                $container.html('<div class="wcpr-grid-overlay wcpr-hidden"></div>');
                            }
                            $reg = /class="woocommerce-pagination">([^]+?)<\/nav>/gm;
                            match = $reg.exec(response);
                            if (match != null) {
                                if ($pagination_container.length > 0) {
                                    $pagination_container.html(match[1]);
                                } else {
                                    $comments.append('<nav class="woocommerce-pagination">' + match[1] + '</nav>');
                                }
                            } else {
                                if ($pagination_container.length > 0) {
                                    $pagination_container.remove();
                                }
                            }
                            $reg = /<div class="wcpr-filter-container" style="display: none;">([^]+?)<\/div>/gm;
                            match = $reg.exec(response);
                            if (match != null) {
                                $filters.html(match[1]);
                            }
                        }
                    },
                    error: function (err) {
                        console.log(err);
                    },
                    complete: function () {
                        ajax_pagination_running = false;
                        $overlay.addClass('wcpr-hidden');
                        $filters.removeClass('wcpr-filter-loading');
                    }
                });
            });
        }
    }
});