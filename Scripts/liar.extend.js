
$.format = function () {
    if (!!!arguments.length) {
        return '';
    }
    var a = arguments;
    if (typeof arguments[0] == 'object') {
        a = arguments[0];
    }

    for (var c = a[0], b = 1; b < a.length; b++) {
        c = c.replace(new RegExp('\\{' + (b - 1) + '\\}', 'gm'), a[b]);
    }
    return c;
};


$.formatMoneyBack = function (value) {
    return parseFloat(value.replace(/[^0-9-.]/g, ''));
}

$.formatMoney = function (number, places, symbol, thousand, decimal) {
    number = number || 0;
    places = !isNaN(places = Math.abs(places)) ? places : 2;
    symbol = symbol !== undefined ? symbol : "";
    thousand = thousand || ",";
    decimal = decimal || ".";
    var negative = number < 0 ? "-" : "",
	    i = parseInt(number = Math.abs(+number || 0).toFixed(places), 10) + "",
	    j = (j = i.length) > 3 ? j % 3 : 0;
    return symbol + negative + (j ? i.substr(0, j) + thousand : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousand) + (places ? decimal + Math.abs(number - i).toFixed(places).slice(2) : "");

}

String.prototype.padRight = function (l, c) { return this + Array(l - this.length + 1).join(c || " ") }

String.prototype.padLeft = function (l, c) { return Array(l - this.length + 1).join(c || " ") + this }


var is_array = function (v) {
    return Object.prototype.toString.call(v) === '[object Array]';
}
