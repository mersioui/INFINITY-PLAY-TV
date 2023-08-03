'use strict';
jQuery(window).on('elementor/frontend/init', () => {
    elementorFrontend.hooks.addAction('frontend/element_ready/woocommerce-photo-reviews.default', function ($scope) {
        if (!window.elementor) {
            return;
        }
        wcpr_helpful_button();
    })
});
jQuery(document).ready(function ($) {
    /*{test}*/
    let image_caption_enable = woocommerce_photo_reviews_params.image_caption_enable == 1;
    let i18n_image_caption = woocommerce_photo_reviews_params.i18n_image_caption;

    function getSelectedImageHtml(src, name) {
        let selectImageHtml;
        if (image_caption_enable) {
            selectImageHtml = `<div class="wcpr-selected-image"><img title="${name}" src="${src}" class="wcpr-selected-image-preview"><div class="wcpr-selected-image-info"><div class="wcpr-selected-image-name" title="${name}">${name}</div><input class="wcpr-selected-image-caption" type="text" name="wcpr_image_caption[]" placeholder="${i18n_image_caption}"></div></div>`;
        } else {
            selectImageHtml = `<div class="wcpr-selected-image"><img title="${name}" src="${src}" class="wcpr-selected-image-preview"><div class="wcpr-selected-image-info"><div class="wcpr-selected-image-name" title="${name}">${name}</div></div></div>`;
        }
        return selectImageHtml;
    }

    function readURL(input) {
        for (let i = 0; i < input.files.length; i++) {
            var reader = new FileReader();

            reader.onload = function (e) {
                $(input).parent().find('.wcpr-selected-image-container').append(getSelectedImageHtml(e.target.result, input.files[i].name))
            };

            reader.readAsDataURL(input.files[i]); // convert to base64 string
        }
    }

    /*{test}*/
    /*helpful button*/
    wcpr_helpful_button();
    let max_files = woocommerce_photo_reviews_params.max_files;
    $('#commentform').on('change', '.wcpr_image_upload', function (e) {
        $(this).parent().find('.wcpr-selected-image-container').html('');
        if (this.files.length > max_files) {
            alert(woocommerce_photo_reviews_params.warning_max_files);
            $(this).val('');
            return false;
        } else if (this.files.length > 0) {
            readURL(this);
        }
    });

    $('#commentform').find('input[type="submit"]').on('click', function (e) {
        let $container = $(this).closest('form');
        let $content = $container.find('textarea[name="comment"]');
        let $name = $container.find('input[name="author"]');
        let $email = $container.find('input[name="email"]');
        if ($content.length > 0 && !$content.val() && woocommerce_photo_reviews_params.allow_empty_comment != 1) {
            alert(woocommerce_photo_reviews_params.i18n_required_comment_text);
            e.preventDefault();
            $content.focus();
            return false;
        }
        if ('on' === woocommerce_photo_reviews_params.enable_photo) {
            let $fileUpload = $container.find('.wcpr_image_upload');
            if ($fileUpload.length > 0) {
                let imagesCount = parseInt($fileUpload.get(0).files.length);
                if ('on' === woocommerce_photo_reviews_params.required_image && imagesCount === 0) {
                    alert(woocommerce_photo_reviews_params.warning_required_image);
                    e.preventDefault();
                    return false;
                }
                if (imagesCount > max_files) {
                    alert(woocommerce_photo_reviews_params.warning_max_files);
                    e.preventDefault();
                    return false;
                }
            } else if ('on' === woocommerce_photo_reviews_params.required_image) {
                alert(woocommerce_photo_reviews_params.warning_required_image);
                e.preventDefault();
                return false;
            }
        }
        if ($name.length > 0 && !$name.val()) {
            alert(woocommerce_photo_reviews_params.i18n_required_name_text);
            e.preventDefault();
            $name.focus();
            return false;
        }
        if ($email.length > 0 && !$email.val()) {
            alert(woocommerce_photo_reviews_params.i18n_required_email_text);
            e.preventDefault();
            $email.focus();
            return false;
        }
        if ($container.find('input[name="wcpr_gdpr_checkbox"]').prop('checked') === false) {
            alert(woocommerce_photo_reviews_params.warning_gdpr);
            e.preventDefault();
            return false;
        }
    });
    let comments = woocommerce_photo_reviews_params.hasOwnProperty('comments_container_id') ? woocommerce_photo_reviews_params.comments_container_id : 'comments';
    let $comments = $('#' + comments);
    $comments.prepend($('.wcpr-filter-container')).prepend($('.wcpr-overall-rating-and-rating-count')).prepend($('.woocommerce-Reviews-title').eq(0));
    let $pagination_container = $comments.find('.woocommerce-pagination');
    if ($('.wcpr-load-more-reviews-button-modal').length) {
        $pagination_container.html($('.wcpr-load-more-reviews-button-modal').html());
    }
});

function wcpr_helpful_button() {
    jQuery('.wcpr-comment-helpful-button').unbind().on('click', function (e) {
        e.stopPropagation();
        let button = jQuery(this);
        let vote = button.hasClass('wcpr-comment-helpful-button-up-vote') ? 'up' : 'down';
        let container = button.closest('.wcpr-comment-helpful-button-container');
        let comment_id = container.data('comment_id');
        if (vote === 'up' && container.hasClass('wcpr-comment-helpful-button-voted-up')) {
            return;
        }
        if (vote === 'down' && container.hasClass('wcpr-comment-helpful-button-voted-down')) {
            return;
        }
        if (container.hasClass('wcpr-comment-helpful-button-voting')) {
            return;
        }
        container.addClass('wcpr-comment-helpful-button-voting');
        jQuery.ajax({
            url: woocommerce_photo_reviews_params.ajaxurl, // AJAX handler, declared before
            data: {
                'action': 'wcpr_helpful_button_handle',
                'vote': vote,
                'comment_id': comment_id,
                // 'nonce': woocommerce_photo_reviews_params.nonce,
            },
            type: 'POST',
            success: function (response) {
                if (response.status === 'success') {
                    container.find('.wcpr-comment-helpful-button-up-vote-count').html(parseInt(response.up));
                    container.find('.wcpr-comment-helpful-button-down-vote-count').html(parseInt(response.down));
                    if (vote === 'up') {
                        container.removeClass('wcpr-comment-helpful-button-voted-down').addClass('wcpr-comment-helpful-button-voted-up');
                    } else {
                        container.removeClass('wcpr-comment-helpful-button-voted-up').addClass('wcpr-comment-helpful-button-voted-down');
                    }
                    if (container.parent().hasClass('reviews-content-right-meta') || container.parent().hasClass('shortcode-reviews-content-right-meta')) {
                        let comment_container = jQuery('.wcpr-comment-helpful-button-container[data-comment_id="' + comment_id + '"]');
                        comment_container.find('.wcpr-comment-helpful-button-up-vote-count').html(parseInt(response.up));
                        comment_container.find('.wcpr-comment-helpful-button-down-vote-count').html(parseInt(response.down));
                        if (vote === 'up') {
                            comment_container.removeClass('wcpr-comment-helpful-button-voted-down').addClass('wcpr-comment-helpful-button-voted-up');
                        } else {
                            comment_container.removeClass('wcpr-comment-helpful-button-voted-up').addClass('wcpr-comment-helpful-button-voted-down');
                        }
                    }
                }
            },
            error: function () {

            },
            complete: function () {
                container.removeClass('wcpr-comment-helpful-button-voting');
            }
        });
    });
}

function viSwipeDetect(el, callback) {
    var touchsurface = el,
        swipedir,
        startX,
        startY,
        distX,
        distY,
        threshold = 150, //required min distance traveled to be considered swipe
        restraint = 100, // maximum distance allowed at the same time in perpendicular direction
        allowedTime = 300, // maximum time allowed to travel that distance
        elapsedTime,
        startTime,
        handleswipe = callback || function (swipedir) {
        };

    touchsurface.addEventListener(
        "touchstart",
        function (e) {
            var touchobj = e.changedTouches[0];
            swipedir = "none";
            startX = touchobj.pageX;
            startY = touchobj.pageY;
            startTime = new Date().getTime(); // record time when finger first makes contact with surface
        },
        false
    );

    touchsurface.addEventListener(
        "touchmove",
        function (e) {
            e.preventDefault(); // prevent scrolling when inside DIV
        },
        false
    );

    touchsurface.addEventListener(
        "touchend",
        function (e) {
            var touchobj = e.changedTouches[0];
            distX = touchobj.pageX - startX; // get horizontal dist traveled by finger while in contact with surface
            distY = touchobj.pageY - startY; // get vertical dist traveled by finger while in contact with surface
            elapsedTime = new Date().getTime() - startTime; // get time elapsed
            if (elapsedTime <= allowedTime) {
                // first condition for awipe met
                if (Math.abs(distX) >= threshold && Math.abs(distY) <= restraint) {
                    // 2nd condition for horizontal swipe met
                    swipedir = distX < 0 ? "left" : "right"; // if dist traveled is negative, it indicates left swipe
                } else if (
                    Math.abs(distY) >= threshold &&
                    Math.abs(distX) <= restraint
                ) {
                    // 2nd condition for vertical swipe met
                    swipedir = distY < 0 ? "up" : "down"; // if dist traveled is negative, it indicates up swipe
                }
            }
            handleswipe(swipedir);
        },
        false
    );
}
