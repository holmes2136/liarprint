(function ($) {
    'use strict';
    $.fn.getLiarText = function () {
        var $ctl = this,
            liartype = $ctl.data('liartype'),
            value = $ctl.find(':text,input[type=number],input[type=email]').val() || $ctl.find('textarea').val() || '';
        if (liartype === 'select2') {
            value = $ctl.find('select').find("option:selected").text() || '';
        } else if (liartype === 'checkgroup') {
            value = [];
            $ctl.find(':checkbox:checked,:radio:checked').each(function (i, ele) {
                value[i] = $(ele).parent().text();
            });
        } else if (liartype === 'date') {
            value = value.replace(/\//ig, '');
        } else if (liartype === 'label') {
            value = $ctl.text();
        } else if (liartype === 'hiddenbox') {
            value = $ctl.children('.span').text();
        }

        return value;
    };

    //特殊使用
    $.fn.getLiarText2 = function () {
        var $ctl = this,
            liartype = $ctl.data('liartype'),
            value = $ctl.find(':text,input[type=number],input[type=email]').val() || $ctl.find('textarea').val() || '';
        if (liartype === 'select2') {
            value = $ctl.find('select').find("option:selected").text() || '';
        } else if (liartype === 'checkgroup') {
            value = "";
            $ctl.find(':checkbox:checked,:radio:checked').each(function (i, ele) {
                var $ele = $(ele);
                if (value == "") { value = $.trim($ele.parent().text()).replace("1.", "").replace("2.", "").replace("3.", "").replace("4.", "").replace("5.", ""); }
                else { value = value + "," + $.trim($ele.parent().text()).replace("1.", "").replace("2.", "").replace("3.", "").replace("4.", "").replace("5.", ""); }

            });
        } else if (mcutype === 'date') {
            value = value.replace(/\//ig, '');
        } else if (mcutype === 'label') {
            value = $ctl.text();
        } else if (mcutype === 'hiddenbox') {
            value = $ctl.children('.span').text();
        }

        return value;
    };


    $.fn.getLiarVal = function () {
        var $ctl = this,
            liartype = $ctl.data('liartype'),
            value = $ctl.find(':text,input[type=number],input[type=email]').val() || $ctl.find('textarea').val() || '';

        if (liartype === 'select2') {
            value = $ctl.find('select').val() || '';
        } else if (liartype === 'checkgroup') {
            value = [];
            $ctl.find(':checkbox:checked,:radio:checked').each(function (i, ele) {
                value[i] = ele.value;
            });
        } else if (liartype === 'date') {
            value = value.replace(/\//ig, '');
        } else if (liartype === 'label') {
            value = $ctl.text();
        }

        if (value === "") { value = $ctl.val(); }

        return value;
    };


    $.fn.setLiarVal = function (val) {
        var $ctl = this,
            liartype = $ctl.data('liartype');

        val = val === undefined ? '' : val;

        if (liartype === 'select2') {
            $ctl.find('select').select2('val', val);
        } else if (liartype === 'select') {
            $ctl.find('select').val(val);
        }
        else if (liartype === 'checkgroup') {
            $ctl.find(':checkbox,:radio').prop('checked', 0);
            if ($.isArray(val)) {
                $.each(val, function (i, v) {
                    $ctl.find(':checkbox[value="' + v + '"],:radio[value="' + v + '"]').prop('checked', 1);
                });
            } else {
                val = val.indexOf('.') === val.length - 1 ? val.substring(0, val.length - 1) : val;
                if (!!val && val != "") {
                    $ctl.find(':checkbox[value="' + val + '"],:radio[value="' + val + '"]').prop('checked', 1);
                }
            }
        } else if (liartype === 'date') {
            $ctl.find(':text').val(val.length === 8 ? val.substring(0, 4) + '/' + val.substring(4, 6) + '/' + val.substring(6, 8) : val);
        } else if (liartype === 'label') {
            $ctl.text(val);
        } else {
            $ctl.find(':text,input[type=number],input[type=email], textarea').val(val);
        }

        return this;
    };

    $.fn.setLiarText = function (val) {
        var $ctl = this,
            liartype = $ctl.data('liartype');

        val = val === undefined ? '' : val;

        if (liartype === 'select2') {

        } else if (liartype === 'checkgroup') {

        } else if (liartype === 'date') {
            $ctl.find(':text').val(val.length === 8 ? val.substring(0, 4) + '/' + val.substring(4, 6) + '/' + val.substring(6, 8) : val);
        } else if (liartype === 'label') {
            $ctl.text(val);
        } else {
            $ctl.find(':text,input[type=number],input[type=email], textarea').val(val);
        }

        return this;
    };

    $.fn.enable = function (b) {
        if (!!b) b = true;
        return this.each(function () {
            this.disabled = !b;
        });
    };

    $.fn.ifElse = function (condition, ifCb, elseCb) {
        if (condition == undefined) return this;
        return this.each(condition == '' || !!condition ? $.isFunction(ifCb) ? ifCb : $.noop : $.isFunction(elseCb) ? elseCb : $.noop);
    };

    $.fn.enableLiar = function (clearVal) {
        return this.find(':input').enable(1);
    };

    $.fn.disableLiar = function (clearVal) {
        return this.find(':input').enable(0);
    };



})(jQuery);