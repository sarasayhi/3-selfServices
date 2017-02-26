/* Copyright (C) 2017
 * This file is part of my graduation project.
 *
 * filename : cart.js
 * function :
 * action   :
 * version  : 1.0
 * author   : MarissaMan
 * date     : 2017/2/26
 * modify   :
 */

function pageInit() {
    // initCartList();

    eventTrigger();
}

function updateState() {

    var $cont = $('.ct-content');
    var $selected = $('input[name=checkItem][checked=checked]');

    var cnt = 0;
    var total = 0;

    // 清除无商品的档口标题
    $('.ct-ground').each(function(i) {

        var length = $(this).find('input[name=checkItem]').length;
        if (length == 0) {
            $cont.find('.ct-ground').eq(i).remove();
        }
    });

    // 空白页显示
    if ($cont.html() == '') {
        $('.ct-cont').hide().siblings('.cm-empty').fadeIn('100').slideDown(200);
    }

    // 更新状态
    if (!epm.isEmpty($selected)) {

        cnt = $selected.length;

        // 更新全选按钮
        if ($('input[name=checkItem][checked!=checked]').length == 0) {
            $('input[name=checkAll]').removeClass('check-normal').addClass('check-selected').attr('checked', 'checked');
        } else {
            $('input[name=checkAll]').removeClass('check-selected').addClass('check-normal').removeAttr('checked');
        }

        // 档口选中
        $('input[name=checkShop]').each(function() {

            var len = $(this).parents('.ct-ground').find('input[name=checkItem][checked!=checked]').length;
            if (len == 0) {
                $(this).removeClass('check-normal').addClass('check-selected').attr('checked', 'checked');

            } else {
                $(this).removeClass('check-selected').addClass('check-normal').removeAttr('checked');
            }
        });

        // 算总金额
        $selected.each(function() {
            total += epm.getMoney($(this).parents('.ct-list').find('.subtotal').text());
        });

    }

    $('.selected-count').text(cnt);
    $('#total').text(epm.getMoney(total));

}

function initCartList() {

    var params = {};
    params['action'] = 'get_cart_list';
    params['market_iid'] = epm.c.market['market_iid'];
    params['offset'] = 0;

    epm.ajax(params, function(data) {
            var html = '';

            if (epm.isEmpty(data['data'][0])) {
                $('.ct-cont').hide().siblings('.cm-empty').show();
                return;
            }

            $.each(data['data'], function(index, value) {
                var shopId = value['shop_iid'];
                var shopName = value['shop_name'];

                html += '<div class="ct-ground"><div class="ct-stall">'
                    + '<input class="check-all check-normal" type="checkbox" title="全选" name="checkShop">'
                    + '<a href="shop_detail.html?shopiid=' + shopId + '">' + shopName + '</a></div>';

                $.each(value['goods'], function(index, value) {

                    var cartId = value['cart_iid'];
                    var goodsId = value['goods_iid'];
                    var goodsName = value['goods_name'];
                    var amount = value['cart_amount'];
                    var price = value['price1'];
                    var subtotal = epm.getMoney(price * amount);
                    var stockAmount = value['stock_amount'];
                    var spec = '规格 : ' + value['goods_spec'];
                    var imgURL = epm.v.imageURLPrefix + value['image_url'];
                    var isBuyerLike = value['is_buyer_like'];
                    var likeIcon = isBuyerLike == 1 ? '&#xe606;' : '&#xe624;';

                    html += '<ul class="ct-list ct-cn-list"  data-stock-amount="' + stockAmount
                        + '" data-cartiid="' + cartId + '" data-shopiid="' + shopId
                        + '" data-goodsiid="' + goodsId + '"><li class="ct-goods-img">'
                        + '<input class="check-item check-normal" type="checkbox" name="checkItem">'
                        + '<img src="' + imgURL + '"></li>'
                        + '<li class="ct-goods-info"><p class="ct-goods-name">'
                        + '<a href="goods_detail.html?shopiid=' + shopId + '&goodsiid=' + goodsId + '">' + goodsName + '</a></p>'
                        + '<p class="ct-goods-size">' + spec + '</p></li>'
                        + '<li class="ct-price">￥<span class="unit-price">' + price + '</span></li>'
                        + '<li class="cm-alter ct-alter"><div class="cm-num-alter"><span class="cm-less">-</span>'
                        + '<input class="cm-num-input" type="text" title="数量" disabled="true" value="' + amount + '">'
                        + '<span class="cm-add">+</span></div></li>'
                        + '<li class="ct-count"><p class="ct-count-red">￥<span class="subtotal">' + subtotal + '</span></p></li>'
                        + '<li class="ct-operate"><span class="cm-collect-success">收藏成功</span>'
                        + '<i class="iconfont i-ct-like" data-isbuyerlike=' + isBuyerLike + '>' + likeIcon + '</i>'
                        + '<i class="iconfont i-ct-delete">&#xe71f;</i></li></ul>';

                });

                html += '</div>';
            });

            $('.ct-content').empty().append(html);

            var cartIds = epm.getUrlParam('cartiid');

            if (!epm.isEmpty(cartIds)) {
                cartIds = epm.getUrlParam('cartiid').split(',');

                $.each(cartIds, function(i) {
                    $('ul[data-cartiid=' + cartIds[i] + ']').find('input[name=checkItem]').removeClass('check-normal').addClass('check-selected').attr('checked', true);
                });

                updateState();

            }

            // 改变商品购物车数量
            $('.cm-less').on({
                click: function() {

                    var $target = $(this).parents('.ct-list');
                    var shopId = $target.attr('data-shopiid');
                    var goodsId = $target.attr('data-goodsiid');

                    var unitPrice = epm.getMoney($target.find('.unit-price').text());
                    var amount = parseInt($target.find('.cm-num-input').val()) - 1;
                    var subtotal = epm.getMoney(unitPrice * amount);

                    if (amount > 0) {

                        epm.b.subCart(shopId, goodsId, function() {
                            $target.find('.cm-num-input').val(amount);
                            $target.find('.subtotal').text(subtotal);

                            updateState();
                        });

                    }

                }
            });

            $('.cm-add').on({
                click: function() {

                    var $target = $(this).parents('.ct-list');
                    var shopId = $target.attr('data-shopiid');
                    var goodsId = $target.attr('data-goodsiid');
                    var max = $target.attr('data-stock-amount');

                    var unitPrice = epm.getMoney($target.find('.unit-price').text());
                    var amount = parseInt($target.find('.cm-num-input').val()) + 1;
                    var subtotal = epm.getMoney(unitPrice * amount);

                    if (amount < max || max == -1) {
                        epm.b.addCart(shopId, goodsId, function() {
                            $target.find('.cm-num-input').val(amount);
                            $target.find('.subtotal').text(subtotal);

                            updateState();

                        });
                    }
                }
            });

            // 删除购物车商品
            $('.i-ct-delete').on({
                click: function() {

                    var $target = $(this).parents('.ct-list');
                    var cartId = $target.attr('data-cartiid');

                    epm.b.removeCart(cartId, function() {

                        $target.remove();

                        updateState();
                    });

                }
            });

            // 选中商品
            $('input[name=checkItem]').on({
                click: function() {

                    if ($(this).hasClass('check-normal')) {

                        $(this).removeClass('check-normal').addClass('check-selected').attr('checked', 'checked');

                    } else if ($(this).hasClass('check-selected')) {

                        $(this).removeClass('check-selected').addClass('check-normal').removeAttr('checked');

                    }

                    updateState();

                }
            });

            // 档口全选
            $('input[name=checkShop]').on({
                click: function() {

                    var $target = $(this).parents('.ct-ground').find('input[name=checkItem]');
                    if ($(this).hasClass('check-normal')) {

                        $target.removeClass('check-normal').addClass('check-selected').attr('checked', 'checked');

                    } else if ($(this).hasClass('check-selected')) {

                        $target.removeClass('check-selected').addClass('check-normal').removeAttr('checked');

                    }

                    updateState();
                }
            });

            // 收藏商品
            $('.i-ct-like').on({
                click: function() {

                    var $target = $(this).parents('.ct-list');
                    var shopId = $target.attr('data-shopiid');
                    var goodsId = $target.attr('data-goodsiid');
                    var $tips = $target.find('.cm-collect-success');
                    var state = $target.find('.i-ct-like').attr('data-isbuyerlike');

                    if (state == 0) {

                        epm.b.addGoodsLike(shopId, goodsId, function() {

                            $tips.show();
                            $target.find('.i-ct-like').html('&#xe606;').attr('data-isbuyerlike', 1);

                        });

                    } else {

                        epm.b.removeGoodsLike(shopId, goodsId, function() {

                            $tips.hide();
                            $target.find('.i-ct-like').html('&#xe624;').attr('data-isbuyerlike', 0);

                        });

                    }

                }
            });

        }
    );

}

function eventTrigger() {

    //结算按钮悬浮效果
    var $cont = $('.ct-content');
    var $ctTotal = $('.ct-total');

    if ($cont.offset().top + $cont.height() > $(window).height()) {
        $ctTotal.addClass('ct-total-fixed');
    }

    $(window).scroll(function() {
        var scrollValue = $(document).scrollTop(),
            fixHeight = $cont.offset().top + $cont.height() - $(window).height();

        scrollValue < fixHeight ? $ctTotal.addClass('ct-total-fixed') : $ctTotal.removeClass('ct-total-fixed');
    });

    // 全选
    $('.check-all').on({
        click: function() {

            var $target = $('input[name=checkItem]');

            if ($(this).hasClass('check-selected')) {

                $target.addClass('check-normal').removeClass('check-selected').removeAttr('checked');

            } else if ($(this).hasClass('check-normal')) {

                $target.addClass('check-selected').removeClass('check-normal').attr('checked', true);

            }

            updateState();

        }
    });

    // 批量删除
    $('.ct-batch-delete').on({
        click: function() {

            var cartIds = [];

            $('input[name=checkItem][checked=checked]').each(function() {

                var cartId = $(this).parents('.ct-list').attr('data-cartiid');

                cartIds.push(cartId);

            });

            // if (!epm.isEmpty(cartIds)) {
            //
            //     epm.b.removeCarts(cartIds, function() {

                    $('input[name=checkItem][checked=checked]').parents('.ct-list').each(function() {
                        $(this).remove();
                    });

                    updateState();

                // });
            // } else {
            //     alert('请选择需要删除的商品~');
            // }

        }
    });

    // 结算按钮
    $('.ct-pay-total-btn').on({
        click: function() {

            var cartIds = [];
            $('input[name=checkItem][checked=checked]').each(function() {

                var cartId = $(this).parents('.ct-list').attr('data-cartiid');

                cartIds.push(cartId);

            });

            // if (!epm.isEmpty(cartIds)) {

                window.location.href = 'order_submit.html?cartiid=' + cartIds;

            // } else {
            //
            //     alert('请选中需要结算的商品~');
            //
            // }
        }
    });

}