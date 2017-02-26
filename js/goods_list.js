/* Copyright (C) 2017
 * This file is part of my graduation project.
 *
 * filename : goods_list.js
 * function :
 * action   :
 * version  : 1.0
 * author   : MarissaMan
 * date     : 2017/2/26
 * modify   :
 */
function pageInit() {

    var obj = '<li class="cm-col-5">'
        + '<a href="goods_detail.html?shopiid=10002&amp;goodsiid=11553">'
        + '<img src="//t-source.3pzs.com/goods/org/102/11553/1480333421.jpg">'
        + '<div class="cm-col-5-info"><h3 class="cm-col-5-info-name">猪心</h3>'
        + '<p class="cm-col-5-stall">膳品肉禽档</p>'
        + '<p class="cm-col-5-goods-price">￥1.47</p>'
        + '<span class="cm-col-5-cart">'
        + '<i class="cm-col-5-cart-minus iconfont">&#xe600;</i><i class="cm-col-5-cart-num">0</i>'
        + '<i class="cm-col-5-cart-plus iconfont">&#xe61e;</i></span></div></a></li>';

    var html = '';
    var n = 16;
    while (n > 0) {
        html += obj;
        n--;
    }

    $('.cm-list').html(html);
}