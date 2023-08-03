'use strict';
jQuery(document).ready(function ($) {
    let $cur, $n, parent;
    $(document).on('click', '.reviews-images-item', function () {
        let $item = $(this);
        let $container = $item.closest('.kt-reviews-image-container');
        if ($container.hasClass('kt-reviews-image-container-image-popup-below_thumb')) {
            let currentRotate, rotateItem;
            parent = $(this).parent().parent();
            currentRotate = parseInt(parent.find('.wcpr-rotate-value').val());
            let $big_review_images = parent.find('.big-review-images');
            if ($(this).hasClass('active-image')) {
                $big_review_images.hide();
                $(this).removeClass('active-image');
            } else {
                $cur = $(this).data('index');
                $n = $(this).parent().find('.reviews-images-item').length;
                $(this).parent().find('.reviews-images-item').removeClass('active-image');
                $(this).addClass('active-image');
                parent.find('.big-review-images-content').html('');
                // $big_review_images.hide();
                $big_review_images.find('.big-review-images-content').append('<img class="big-review-images-content-img" style="float:left;display: block;border-radius: 3px;" src="' + $(this).data('image_src') + '">');
                $big_review_images.css({ 'display': 'table' });
                parent.find('.wcpr-review-image-caption').html($(this).data('image_caption'));
            }
            if (currentRotate) {
                rotateItem = parent.find('.big-review-images-content-container');
                rotateItem.css({ 'transform': 'rotate(' + currentRotate + 'deg)' });
            }

        } else {
            let this_image = $item.find('.review-images');
            let $image_container = this_image.closest('.kt-wc-reviews-images-wrap-wrap');
            let data = [];
            $image_container.find('.reviews-images-item').map(function () {
                let current_image = $(this).find('.review-images');
                let href = $(this).data('image_src') ? $(this).data('image_src') : current_image.attr('src');
                let title = $(this).data('image_caption') ? $(this).data('image_caption') : ((parseInt($(this).data('index')) + 1) + '/' + $image_container.find('.reviews-images-item').length);
                data.push({ href: href, title: title });
            });
            $.swipebox(data, { hideBarsDelay: 100000, initialIndexOnArray: $item.data('index') })
        }
    });

    $(document).on('click', '.big-review-images-content-img', function () {
        let $image_container = $(this).closest('.kt-reviews-image-container').find('.kt-wc-reviews-images-wrap-wrap');
        let data = [];
        $image_container.find('.reviews-images-item').map(function () {
            let current_image = $(this).find('.review-images');
            let href = $(this).data('image_src') ? $(this).data('image_src') : current_image.attr('src');
            let title = $(this).data('image_caption') ? $(this).data('image_caption') : ((parseInt($(this).data('index')) + 1) + '/' + $image_container.find('.reviews-images-item').length);
            data.push({ href: href, title: title });
        });
        $.swipebox(data, {
            hideBarsDelay: 100000,
            initialIndexOnArray: $image_container.find('.active-image').data('index')
        })
    });
    $(document).on('click', '.wcpr-next-normal', function () {
        let currentRotate, rotateItem;
        parent = $(this).parent().parent();
        currentRotate = parseInt(parent.find('.wcpr-rotate-value').val());
        $cur = parent.find('.active-image').data('index');
        $n = parent.find('.reviews-images-item').length;
        parent.find('.reviews-images-item').removeClass('active-image');
        if ($cur < $n - 1) {

            $cur++;

        } else {
            $cur = 0;
        }
        parent.find('.reviews-images-item').eq($cur).addClass('active-image');
        parent.find('.big-review-images-content').html('');
        let $big_review_images = parent.find('.big-review-images');
        // $big_review_images.hide();
        $big_review_images.find('.big-review-images-content').append('<img class="big-review-images-content-img" style="float:left;display: block;border-radius: 3px;" src="' + parent.find('.reviews-images-item').eq($cur).data('image_src') + '">')
        $big_review_images.css({ 'display': 'table' });
        parent.find('.wcpr-review-image-caption').html(parent.find('.reviews-images-item').eq($cur).data('image_caption'));
        if (currentRotate) {
            rotateItem = parent.find('.big-review-images-content-container');
            rotateItem.css({ 'transform': 'rotate(' + currentRotate + 'deg)' });
        }
    });
    $(document).on('click', '.wcpr-prev-normal', function () {
        let currentRotate, rotateItem;
        parent = $(this).parent().parent();
        currentRotate = parseInt(parent.find('.wcpr-rotate-value').val());
        $cur = parent.find('.active-image').data('index');
        $n = parent.find('.reviews-images-item').length;
        parent.find('.reviews-images-item').removeClass('active-image');
        if ($cur > 0) {

            $cur--;

        } else {
            $cur = $n - 1;
        }
        parent.find('.reviews-images-item').eq($cur).addClass('active-image');
        parent.find('.big-review-images-content').html('');
        let $big_review_images = parent.find('.big-review-images');
        // $big_review_images.hide();
        $big_review_images.find('.big-review-images-content').append('<img class="big-review-images-content-img" style="float:left;display: block;border-radius: 4px;" src="' + parent.find('.reviews-images-item').eq($cur).data('image_src') + '">')
        $big_review_images.css({ 'display': 'table' });
        parent.find('.wcpr-review-image-caption').html(parent.find('.reviews-images-item').eq($cur).data('image_caption'));
        if (currentRotate) {
            rotateItem = parent.find('.big-review-images-content-container');
            rotateItem.css({ 'transform': 'rotate(' + currentRotate + 'deg)' });
        }
    });

    $(document).on('click', '.wcpr-close-normal', function () {
        parent = $(this).parent().parent();
        $(this).parent().hide();
        parent.find('.kt-wc-reviews-images-wrap-wrap').find('.active-image').removeClass('active-image');
    });
    $(document).on('click', '.wcpr-rotate-left', function () {
        let currentRotate, rotateItem;
        parent = $(this).parent().parent();
        currentRotate = parseInt(parent.find('.wcpr-rotate-value').val());
        rotateItem = parent.find('.big-review-images-content-container');
        currentRotate += -90;
        parent.find('.wcpr-rotate-value').val(currentRotate);
        rotateItem.css({ 'transform': 'rotate(' + currentRotate + 'deg)' });
    });
    $(document).on('click', '.wcpr-rotate-right', function () {
        let currentRotate, rotateItem;
        parent = $(this).parent().parent();
        currentRotate = parseInt(parent.find('.wcpr-rotate-value').val());
        rotateItem = parent.find('.big-review-images-content-container');
        currentRotate += 90;
        parent.find('.wcpr-rotate-value').val(currentRotate);
        rotateItem.css({ 'transform': 'rotate(' + currentRotate + 'deg)' });
    });
    /*Ajax load more and filters for normal style*/
    let comments = woocommerce_photo_reviews_params.hasOwnProperty('comments_container_id') ? woocommerce_photo_reviews_params.comments_container_id : 'comments';
    let $filters = $('.wcpr-filter-container');
    let $comments = $('#' + comments);
    $comments.prepend($filters).prepend($('.wcpr-overall-rating-and-rating-count')).prepend($('.woocommerce-Reviews-title').eq(0));
    let $pagination_container = $comments.find('.woocommerce-pagination');
    let cpage = $('.wcpr-load-more-reviews-cpage').val(),
        parent_post_id = $('.wcpr-load-more-reviews-product-id').val(),
        rating = $('.wcpr-load-more-reviews-rating').val(),
        verified = $('.wcpr-load-more-reviews-verified').val(),
        image = $('.wcpr-load-more-reviews-image').val(),
        $no_review = $('.woocommerce-noreviews'),
        $container = $(woocommerce_photo_reviews_params.container);

    function handle_missing_container() {
        if ($container.length === 0) {
            let first_char = woocommerce_photo_reviews_params.container.substr(0, 1);
            if (first_char === '.') {
                $container = $('<ol class="' + woocommerce_photo_reviews_params.container.substr(1) + '"></ol>');
            } else {
                $container = $('<ol id="' + woocommerce_photo_reviews_params.container.substr(1) + '"></ol>');
            }
            $comments.append($container);
        }
    }

    function handle_missing_pagination() {
        if ($pagination_container.length === 0) {
            $pagination_container = $('<nav class="woocommerce-pagination"></nav>');
            $comments.append($pagination_container);
        }
    }

    if (cpage && parent_post_id) {
        if (woocommerce_photo_reviews_params.display == 2 && woocommerce_photo_reviews_params.pagination_ajax) {
            let $button = $('.wcpr-load-more-reviews-button');
            $button.addClass('wcpr-loading');
            $.ajax({
                url: woocommerce_photo_reviews_params.ajaxurl, // AJAX handler, declared before
                data: {
                    'action': 'wcpr_ajax_load_more_reviews', // wp_ajax_cloadmore
                    'post_id': parent_post_id, // the current post
                    'cpage': cpage, // current comment page
                    'rating': rating,
                    'verified': verified,
                    'image': image,
                },
                type: 'POST',
                success: function (response) {
                    if (response.html) {
                        handle_missing_container();
                        $container.append(response.html);
                    }
                    if (woocommerce_photo_reviews_params.sort == 2) {
                        cpage++;
                    } else {
                        cpage--;
                    }
                    wcpr_helpful_button();
                },
                complete: function () {
                    $button.removeClass('wcpr-loading');
                }
            });
        }
        $(document).on('click', '.wcpr-load-more-reviews-button', function () {
            let $button = $(this);
            if (woocommerce_photo_reviews_params.sort == 2) {
                cpage++;
                if (cpage == 1) {
                    cpage++;
                }
            } else {
                cpage--;
                if (cpage == 1) {
                    cpage--;
                }
            }
            if (cpage > -1) {
                $.ajax({
                    url: woocommerce_photo_reviews_params.ajaxurl, // AJAX handler, declared before
                    data: {
                        'action': 'wcpr_ajax_load_more_reviews', // wp_ajax_cloadmore
                        'post_id': parent_post_id, // the current post
                        'cpage': cpage, // current comment page
                        'rating': rating,
                        'verified': verified,
                        'image': image,
                    },
                    type: 'POST',
                    beforeSend: function (xhr) {
                        $button.addClass('wcpr-loading');
                    },
                    success: function (response) {
                        if (response.html) {
                            $container.append(response.html);
                            // if the last page, remove the button
                            if (cpage == 0)
                                $button.parent().remove();
                        } else {
                            $button.parent().remove();
                        }
                        wcpr_helpful_button();
                    },
                    complete: function () {
                        $button.removeClass('wcpr-loading');
                    }
                });
            }
            return false;
        });
        let ajax_pagination_running = false;
        if ($filters.length > 0) {
            let $filters_rating = $filters.find('.wcpr-filter-button-ul');
            $(document).on('click', 'a.wcpr-filter-button', function (e) {
                let $button = $(this);
                if (ajax_pagination_running || (parseInt($button.find('.wcpr-filter-button-count').html()) === 0 && !$button.hasClass('wcpr-active'))) {
                    return false;
                }
                cpage = 0;
                let filter_type = $button.data('filter_type');
                switch (filter_type) {
                    case 'all':
                        if ($button.hasClass('wcpr-active')) {
                            return false;
                        } else {
                            rating = '';
                        }
                        break;
                    case 'image':
                        if ($button.hasClass('wcpr-active')) {
                            image = '';
                        } else {
                            image = 1;
                        }

                        break;
                    case 'verified':
                        if ($button.hasClass('wcpr-active')) {
                            verified = '';
                        } else {
                            verified = 1;
                        }

                        break;
                    default:
                        if ($button.hasClass('wcpr-active')) {
                            return false;
                        } else {
                            rating = parseInt(filter_type);
                        }
                }
                ajax_pagination_running = true;
                e.preventDefault();
                $filters.addClass('wcpr-filter-loading');
                $.ajax({
                    url: woocommerce_photo_reviews_params.ajaxurl, // AJAX handler, declared before
                    type: 'POST',
                    data: {
                        'action': 'wcpr_ajax_load_more_reviews', // wp_ajax_cloadmore
                        'post_id': parent_post_id, // the current post
                        'cpage': cpage, // current comment page
                        'rating': rating,
                        'verified': verified,
                        'image': image,
                        'filter_type': filter_type,
                    },
                    success: function (response) {
                        if (woocommerce_photo_reviews_params.sort == 2) {
                            cpage++;
                        } else {
                            cpage--;
                        }
                        if (response.html) {
                            $no_review.hide();
                            handle_missing_container();
                        }
                        $container.html(response.html);
                        cpage = parseInt(response.cpage);
                        handle_missing_pagination();
                        $pagination_container.html(response.load_more_html);
                        wcpr_helpful_button();
                        let update_count = response.update_count;
                        if (update_count) {
                            for (let i in update_count) {
                                if (update_count.hasOwnProperty(i)) {
                                    $filters.find('.wcpr-filter-button[data-filter_type="' + i + '"]').find('.wcpr-filter-button-count').html(update_count[i]);
                                }
                            }
                        }
                        switch (filter_type) {
                            case 'all':
                                $filters_rating.find('.wcpr-filter-button').removeClass('wcpr-active');
                                $button.addClass('wcpr-active');
                                $filters.find('.wcpr-filter-rating-placeholder').html($button.html());
                                break;
                            case 'image':
                            case 'verified':
                                if ($button.hasClass('wcpr-active')) {
                                    $button.removeClass('wcpr-active');
                                } else {
                                    $button.addClass('wcpr-active');
                                }
                                break;
                            default:
                                $filters_rating.find('.wcpr-filter-button').removeClass('wcpr-active');
                                $button.addClass('wcpr-active');
                                $filters.find('.wcpr-filter-rating-placeholder').html($button.html());
                        }

                    },
                    error: function (err) {
                        console.log(err);
                    },
                    complete: function () {
                        ajax_pagination_running = false;
                        $filters.removeClass('wcpr-filter-loading');
                    }
                });
            });
        }
    }
});