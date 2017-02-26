/* Copyright (C) 2017
 * This file is part of my graduation project.
 *
 * filename : default.js
 * function :
 * action   :
 * version  : 1.0
 * author   : MarissaMan
 * date     : 2017/2/1
 * modify   :
 */
$(document).ready(function () {
    var height = $(window).height() - 36;
    console.log(height);
    $('.cm-side').height(height);
    $('.cm-cont').height(height);

    if ($.isFunction(window.pageInit)) {
        pageInit();
    }
});