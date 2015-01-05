

var FreeformatSettings = {
    itemcnt: 0,
    tabcnt: 0,
    Remark: '', //最末多項註釋
    xmlcount:1,
    xmlcount2: 1
};

var indexdata;


//xml RULE 規則執行進入點
function rule00(rulestr, tr, colModel) {
    var list = rulestr.replace('  ', ' ').replace('  ', ' ').split(' ');
    var comparestr = rulestr;
    var result = false;
    for (var i = 0; i < list.length; i++) {
        if (list[i] == '(' || list[i] == ')' || list[i] == '==' || list[i] == '!=' || list[i] == '>' || list[i] == '<' || list[i] == '>=' || list[i] == '<=')
        { continue; }

        var obj, val;
        if (list[i] == 'AND') {
            val = '&&';
            comparestr = comparestr.replace(' ' + list[i] + ' ', ' ' + val + ' ');
        }
        else if (list[i] == 'OR') {
            val = '||';
            comparestr = comparestr.replace(' ' + list[i] + ' ', ' ' + val + ' ');
        }
        else if (list[i].indexOf('{') < 0)
        { continue; }
        else {
            var target_name = list[i].replace("{", "").replace("}", "").replace("#","");
            var $target = $("#" + target_name);
            if (tr == null) {
                val = $target.getLiarVal();
            }
//            else {
//                var target_mcu = $target.attr('id');
//                if (target_name == "AF_CHANGE_STATUS") {
//                    val = $(tr).find("td:eq(0)").text();
//                }
//            }
           
            if ($.trim(val) == '') {
                comparestr = comparestr.replace(list[i], '\'\'');
            }
            else if (jQuery.type(val) == "array") {
                var arrstr = val.join(',');
                comparestr = comparestr.replace(list[i], '\'' + arrstr.replace(/,/g,"','") + '\'');
            }
            else if (jQuery.type(val) == "string") {
                comparestr = comparestr.replace(list[i], '\'' + val + '\'');
            }
            else {
                comparestr = comparestr.replace(list[i], val);
            }
        }
    }
    if (eval(comparestr) == true) {
        result = true;
    }
    else {
        result = false;
    }
    return result;
}

//FORMAT 輸出格式客製化
function generateFormat(val,formatCode){
    var result = "",
    formatCode = formatCode.toUpperCase();

    if (formatCode === "MONEY") {
        //convert 1000 to 1,000
        result = $.formatMoneyBack(val);
        result = $.formatMoney(result, 0);
    }
    else if (formatCode === "DATE") {
        //convet 20141020 to 2014/10/20
        var intTmp = 0;
        intTmp = 8 - val.length;

        var intYear = val.substr(0, 4 - intTmp);
        var intMonth = val.substr(4 - intTmp, 2);
        var intDay = val.substr(6 - intTmp, 2);

        result = intYear + "/" + intMonth.padLeft(2, '0') + "/" + intDay.padLeft(2, '0');

    }
    else if (formatCode === "NUMBER") {
        result = parseInt(val,10);
    }
    else{
        result = val;
    }
    return result;

}


var freeFormat;

function GenerateFixedColumn($ele) {
    
    var result = '';

    //不設Target表示直接顯示Content即可
    //原本註解 (每個變更項目底下註解)
    //if ($ele.attr("TARGET") == undefined || $ele.attr("TARGET") == '') {
     
    //    return result;
    //}

    var targetstr = $ele.attr("TARGET");
    var targetList = targetstr.split(',');
    var targetValuestr = $ele.attr("TARGET_VALUE");
    var targetValuestrList = (!!targetValuestr) ? targetValuestr.split(',') : null;
    var targetbr = $ele.attr("IS_BR");
    var space = $ele.parent().attr("SPACE_COUNT") == null ? 0 : parseInt($ele.parent().attr("SPACE_COUNT"),10);
    var valList = [];
    var isNull = true;
    for (var i = 0; i < targetList.length; i++) {
        var val = "";
        //checkgroup 可以多個勾選,其顯示文字需要使用TEXT2
        if (!!targetValuestrList && !!targetValuestrList[i] && targetValuestrList[i] == "TEXT2") {
            var target = $("#" + targetList[i]);
            val = $(target).getLiarText2();
        }
        else if (!!targetValuestrList && !!targetValuestrList[i] && targetValuestrList[i] == "VALUE") {
            var target = $("#" + targetList[i]);
            val = $(target).getLiarVal();
        }
        else if (targetList[i][0] == '@') {
            var target_userid = "";
            var target_useridname = "";
            var targetarr = targetList[i].replace('@','').replace("(", "{").replace(")", "}").split(/{|}/);
            var target_useridcontrol;
            var target_useridmcu;
            var target_useridcontrol;
            var target_useridmcu;
            if (targetarr.length > 2) {
                if ($.trim(targetarr[1]) != "") { //參數區域
                    var targetStr = "";
                    var targetarr2 = targetarr[1].split(" ");
                    for (var j = 0; j <= targetarr2.length - 1; j++) {
                        target_useridname = targetarr2[j];
                        if (target_useridname.indexOf("'") == 0) {
                            target_userid = target_useridname.replace("'", "").replace("'", "");
                        } else {
                            $target_useridcontrol = $("#" + target_useridname);
                            target_useridmcu = $target_useridcontrol.attr('id');
                            target_userid = $target_useridcontrol.attr('id');
                        }
                        targetStr = j == 0 ? target_userid : targetStr + "','" + target_userid;
                    }
                    targetStr = targetStr == "','" ? "" : targetStr;
                }

                if ($.trim(targetStr) != "") {
                    val = eval(targetarr[0].replace("@", "") + "('" + targetStr + "')");
                } else {
                    val = eval(targetarr[0].replace("@", "") + "('','')");
                }
            }
        }
        else {
            var target = $("#" + targetList[i]);
            val = $(target).getLiarText();
        }

        valList[i] = val;
        if (val != undefined && val != '') {
            isNull = false;
        }
    }

    var musthave_name = $ele.attr("MUST_HAVE");
    if (!!musthave_name) {
        var $musthave = $("#" + musthave_name);
        var musthave_val = $musthave.getLiarText();
        if (musthave_val == undefined || musthave_val == '') {
            isNull = true;
        }
    }

    var rule = $ele.attr("RULE");
    //有規則,做檢查
    var ruleResult = true;
    if (rule != undefined && rule != '') {
        ruleResult = rule00(rule, null, null);
    }
    //空值不用秀
    if (isNull) { return result; }

    //項目序號
    FreeformatSettings.itemcnt = FreeformatSettings.itemcnt + 1;
    var content = $ele.attr("CONTENT");
    var format = $ele.attr("FORMAT");
    var formatlist = (!!format) ? format.split(',') : null;
    for (var i = 0; i < valList.length; i++) {
        if (is_array(valList[i])) {
            var final_val = "";
            for (j = 0; j < valList[i].length; j++) {
                final_val = valList[i][j] + ((!!targetbr && targetbr == "N") ? '' : '\n');
            }
            if (!!formatlist && !!formatlist[i]) { final_val = generateFormat(final_val, formatlist[i]); }
            content = content.replace("{" + i + "}", final_val);
        }
        else {
            if (!!formatlist && !!formatlist[i]) { valList[i] = generateFormat(valList[i], formatlist[i]); }
            content = content.replace("{" + i + "}", valList[i]);
        }

    }
    if (ruleResult == true) {
        if (content.indexOf("[br]") > 0) {
            content = content.replace(/\[br]/g, '\n' + ''.padLeft(space, '　'));
        }
        FreeformatSettings.itemcnt = FreeformatSettings.itemcnt + 1;

        if (!!targetbr && targetbr == "N") {
            result += $.format("{0}", content);
        }
        else {
            result += ''.padLeft(space, '　') + $.format("{0}" + '\n', content);
        }

    }
    return result;
}


function GenerateFixedGridColumn($ele) {

    //Go To FlexiGrid
    var result = '';
    var rowCount = 0;
    var loopmcu = $ele.attr("TARGET");

    var space = $ele.attr("SPACE_COUNT") == null ? 0 : parseInt($ele.attr("SPACE_COUNT"),10);
    var $flexigrid = $("#" + loopmcu),
                colModel = $flexigrid.data('colModel');
    var $grid = $flexigrid.find('.grid');
    if (!!!$grid.length) {
        $grid = $flexigrid.find('table');
    }
    var tr = $grid.find('tbody tr');
    rowCount = tr.length;
    var needComon = false;
    for (var x = 0; x < rowCount; x++) {
        $ele.find("ELE2").each(function (c) {
            var $ele2 = $($ele.find("ELE2")[c]);
            var targetbr = $ele2.attr("IS_BR");
            if ($ele2.attr("TARGET") == undefined || $ele2.attr("TARGET") == '') {
                //console.info('　　' + $ele2.attr("CONTENT"));
                //freeFormat += '　　' + $ele2.attr("CONTENT") + '\n';
                result += padLeft('', '　', space) + $ele2.attr("CONTENT") + '\n';
                return;
            }

            var targetstr = $ele2.attr("TARGET");
            var targetList = targetstr.split(',');
            var targetContstr = $ele2.attr("TARGET_CONTENT");
            var targetContList = (targetContstr == null) ? null : targetContstr.split(',');
            var format = $ele2.attr("FORMAT");
            var formatlist = (!!format) ? format.split(',') : null;
            var valList = [];
            var isNull = true;

            //如果Ignore_index值為空，則忽略下一項目
            var Ignore_index = [],
                SET_NONE_BEFORE = [],
                IGNORE = false;
            if ($ele2.attr("IGNORE_NEXT") != undefined) { Ignore_index = $ele2.attr("IGNORE_NEXT").split(","); }
            if ($ele2.attr("SET_NONE_BEFORE") != undefined) { SET_NONE_BEFORE = $ele2.attr("SET_NONE_BEFORE").split(","); }

            for (var i = 0; i < targetList.length; i++) {
                var target = getMcuByFieldName(targetList[i]);
                var target_mcu = $(target.$mcu).attr('id');
                var target_value = "";
                if (targetList[i] == "AF_CHANGE_STATUS")
                { target_value = $(tr[x]).find("td:eq(0)").text(); }
                else if (targetList[i].indexOf("@") == 0) {
                    var target_userid = "";
                    var target_useridname = "";
                    var targetarr = targetList[i].replace("(", "{").replace(")", "}").split(/{|}/);
                    var target_useridcontrol;
                    var target_useridmcu;
                    var target_useridcontrol;
                    var target_useridmcu;
                    if (targetarr.length > 2) {
                        var targetStr = "";
                        var targetarr2 = targetarr[1].split(" ");
                        for (var j = 0; j <= targetarr2.length - 1; j++) {
                            target_useridname = targetarr2[j];
                            target_useridcontrol = getMcuByFieldName(target_useridname);
                            target_useridmcu = $(target_useridcontrol.$mcu).attr('id');
                            target_userid = (!!target_useridcontrol.$mcu.ignore && target_useridcontrol.$mcu.ignore == 1) ? GetValueByColModel(tr[x], colModel, target_useridmcu) : target.$mcu.getLiarVal();
                            targetStr = j == 0 ? target_userid : targetStr + "','" + target_userid;
                        }
                        targetStr = targetStr == "','" ? "" : targetStr;
                        if ($.trim(targetStr) != "") {
                            target_value = eval(targetarr[0].replace("@", "") + "('" + targetStr + "')");
                        } else {
                            target_value = eval(targetarr[0].replace("@", "") + "('','')");
                        }
                    }

                }
                else {
                    if (!!target) {
                        target_value = (!!target.$mcu.ignore && target.$mcu.ignore == 1) ? GetValueByColModel(tr[x], colModel, target_mcu) : target.$mcu.getLiarVal();

                    }
                }
                //var target_value = GetValueByColModel(tr[x], colModel, target_mcu);

                if (!!formatlist && !!formatlist[i]) { target_value = generateFormat(target_value, formatlist[i]); }
                valList[i] = target_value;
                if (target_value != undefined && target_value != '') {
                    isNull = false;
                }

                //符合忽略條件，跳過下一個迴圈。
                IGNORE = Ignore_index.indexOf(i.toString()) != -1 ? true : false;
                if (target_value == "" && IGNORE) {
                    i++;
                    if (targetList.length >= i) { valList[i] = ""; IGNORE = false; }
                    continue;
                }

                //符合前一項目為空條件，將前一項目值設為空
                if (i != 0 && SET_NONE_BEFORE.indexOf(i.toString()) != -1 && valList[i] == "") {
                    valList[i - 1] = "";
                }
            }
            var musthave_name = $ele2.attr("MUST_HAVE");
            var musthave = getMcuByFieldName(musthave_name);
            var musthave_mcu = $(musthave.$mcu).attr('id');
            var musthave_val = "";
            if (musthave_name == "AF_CHANGE_STATUS")
            { musthave_val = $(tr[x]).find("td:eq(0)").text(); }
            else if (!!musthave) { musthave_val = (!!musthave.$mcu.ignore && musthave.$mcu.ignore == 1) ? GetValueByColModel(tr[x], colModel, musthave_mcu) : musthave.$mcu.getLiarVal(); }
            if (!!musthave_name) {
                if (musthave_val == undefined || musthave_val == '') {
                    isNull = true;
                }

            }


            var rule = $ele2.attr("RULE");
            //有規則,做檢查
            var ruleResult = true;
            if (rule != undefined && rule != '') {
                ruleResult = rule00(rule, tr[x], colModel);
            }
            //空值不用秀
            if (isNull) {
            }
            else {
                var content = $ele2.attr("CONTENT");
                for (var i = 0; i < valList.length; i++) {
                    if (!!targetContList && !!targetContList[i]) {
                        if (valList[i] == '') {
                            content = content.replace("{" + i + "}", '');
                        }
                        else {
                            var mytargetStr = targetContList[i].replace("{0}", valList[i]);
                            if (mytargetStr.indexOf("{") >= 0) {
                                var tempvar = targetContList[i].replace("{0}", "").replace("{", "").replace("}", "");
                                var tempval = getMcuByFieldName(tempvar).$mcu.getLiarVal();
                                mytargetStr = valList[i] + tempval;
                            }
                            //if (needComon == true) { mytargetStr = "," + mytargetStr };
                            if (needComon == true) { mytargetStr = mytargetStr };
                            content = content.replace("{" + i + "}", mytargetStr);
                            needComon = true;
                        }

                    }
                    else {
                        //if (needComon == true) { content = content.replace("{" + i + "}", "," + valList[i]); }
                        if (needComon == true) { content = content.replace("{" + i + "}", valList[i]); }
                        else { content = content.replace("{" + i + "}", valList[i]); }

                    }

                }
                if (ruleResult == true) {
                    if (content.indexOf("[br]") > 0) {
                        content = content.replace(/\[br]/g, '\n' + ''.padLeft(space, '　'));
                    }
                    FreeformatSettings.itemcnt = FreeformatSettings.itemcnt + 1;

                    //console.info('　　' + content);
                    if (!!targetbr && targetbr == "N") {
                        result += $.format("{0}", content);
                    }
                    else {
                        result += ''.padLeft(space, '　') + $.format("{0}" + '\n', content);
                    }

                }
            }


        })

    }
    return result;
}

function GenerateFreeTab($item) {
    var resultAll = '';
    $item.find("TAB").each(function (b) {
        var $tab = $($item.find("TAB")[b]);
        //每個欄位
        var result = '';
        result = GenerateFreeColumn($tab);

        //若有element , ex:AF_ID , 才會去串接後面的註解 , 若某個變更只有註解是沒有辦法顯示的
        if (result != "") {
            if ($tab.attr("TITLE") != undefined && $tab.attr("TITLE") != '') {
                FreeformatSettings.tabcnt = FreeformatSettings.tabcnt + 1;
                resultAll += '　' + $.format("{0}.{1}\n", FreeformatSettings.tabcnt, $tab.attr("TITLE"));
            }
            //如有CONTAIN_AS_TITLE屬性則將內容套至TITLE。
            //＊注意：無法與TITLE屬性並存
            else if ($tab.attr("CONTAIN_AS_TITLE") != undefined && $tab.attr("CONTAIN_AS_TITLE") == 'Y') {
                FreeformatSettings.tabcnt = FreeformatSettings.tabcnt + 1;
                resultAll += '  ' + $.format("{0}.{1}\n", FreeformatSettings.tabcnt, result);
                //resultAll += '　' + $.format("{0}.{1}\n", FreeformatSettings.tabcnt, $.trim(result)) + '\n';
            }
            $tab.find("ELE[TARGET='']").each(function () {
                var rule = $(this).attr("RULE");
                //有規則,做檢查
                var ruleResult = true;
                if (rule != undefined && rule != '') {
                    ruleResult = rule00(rule, null, null);
                }
                if (ruleResult == true) {
                    var remark2 = $(this).attr("CONTENT");
                    if (remark2.indexOf('※') >= 0) {
                        remark2 = remark2.replace("※", chineseNumber(FreeformatSettings.xmlcount2, 'lower') + '、');
                        FreeformatSettings.xmlcount2 = FreeformatSettings.xmlcount2 + 1;
                    }
                    FreeformatSettings.Remark += remark2 + '\n';
                }
            });
            if ($tab.attr("CONTAIN_AS_TITLE") === undefined) {
                resultAll += result + '\n';
            }
        }
    });

    if ($.trim(resultAll) != '') {
        $item.find("ELE[TARGET='ALLSHOW']").each(function () {
            var rule = $(this).attr("RULE");
            //有規則,做檢查
            var ruleResult = true;
            if (rule != undefined && rule != '') {
                ruleResult = rule00(rule, null, null);
            }
            if (ruleResult == true) {
                var remark2 = $(this).attr("CONTENT");
                if (remark2.indexOf('※') >= 0) {
                    remark2 = remark2.replace("※", chineseNumber(FreeformatSettings.xmlcount2, 'lower') + '、');
                    FreeformatSettings.xmlcount2 = FreeformatSettings.xmlcount2 + 1;
                }

                FreeformatSettings.Remark += remark2 + '\n';
            }
        });
    }

    return resultAll;
}


function GenerateFreeFormat(ID) {
    if ($compareXml == null) {
        GetFreeFormatData();
    }
    var result = '';

    $compareXml.find("POS[ID=" + ID + "]").each(function (a) {

        //if ($("#for-" + ID).length == 0) { return; }

        //表頭
        var $item = $($compareXml.find("POS[ID=" + ID + "]")[a]);
        var title = $item.attr("TITLE").replace("{N}", chineseNumber(FreeformatSettings.xmlcount, 'lower'));
        var titleOnly = $($compareXml.find("POS[ID=" + ID + "]")[a]).attr("TITLE_ONLY");
        var TITLE_WITH_CONTAIN = $($compareXml.find("POS[ID=" + ID + "]")[a]).attr("TITLE_WITH_CONTAIN"), 
            SPACE_COUNT = parseInt($($compareXml.find("POS[ID=" + ID + "]")[a]).attr("SPACE"), 10) || 0;
        //result += title + '\n';

        //子頁簽
        var temp = GenerateFreeTab($item);

        if (temp != '') {
         
            if (titleOnly == "Y") {
                result += title + '\n' + '\n';
            }
            else if (TITLE_WITH_CONTAIN == "Y") {  //boyliu 20140922
                var SPACE = "";
                for (var i = 0; i < SPACE_COUNT; i++) { SPACE += "　"; }
                result += SPACE + title + $.trim(temp).substring(2) + '\n';
            }
            else {
                result += title + '\n';
                result += temp;
            }

            FreeformatSettings.xmlcount = FreeformatSettings.xmlcount + 1;
        }

    })

    FreeformatSettings.tabcnt = 0;

    return result;
}


function GenerateFreeColumn($tab) {
    var result = '';
    $tab.find("ELE").each(function (c) {
        var $ele = $($tab.find("ELE")[c]);
        if ($ele.attr("LOOP") != undefined && $ele.attr("LOOP") == "Y") {
            result += GenerateFixedGridColumn($ele);
        }
        else {
            //Go TO FixedColumn
            result += GenerateFixedColumn($ele);
        }
    })

    //global value
    FreeformatSettings.itemcnt = 0;


    return result;

}




var $compareXml;
GetFreeFormatData();
function GetFreeFormatData() {
    $.ajax({
        url: 'ajax/POS02004.ashx',
        type: 'post',
        success: function (result) {
            $compareXml = $($.parseXML(result.Data));
            if (result.Code != 200) {
                console.info(result.Code);
                console.info(result.Msg);
            }
        },
        error: function () {
        },
        complete: function (jqXHR) {

            jqXHR = null;
        }
    });

}


//套印主要進入點
function createFreeFormatData(tab) {

    if (!!!tab) {
        console.error('need tab name');
        return;
    }

    var result = '';
//    $('#mapp-tab li').filter(function () { return $(this).css("display") != "none"; }).slice(1).find("a").each(function (i, a) {
//        var tabHash = a.hash,
//			tmpFormID = tabHash.replace('for-', '').replace('#', '');
//        result += GenerateFreeFormat(tmpFormID);

    //    })

    result += GenerateFreeFormat(tab);


    if (result != "") { result = "壹、本次申請事項暨填寫之變更內容：\n" + result; }
    
    //append 最末端註釋
    if (FreeformatSettings.Remark != "") { FreeformatSettings.Remark = "貳、本次變更權利義務說明及相關注意事項：\n" + FreeformatSettings.Remark; }
    result = result + FreeformatSettings.Remark;

    FreeformatSettings.Remark = '';
    FreeformatSettings.xmlcount = 1;
    FreeformatSettings.xmlcount2 = 1;
    return result;
}


//數字轉中文
function chineseNumber(number, lowerorsupper, tail) {
    //轉換值是否為整數  
    if (!isNaN(parseInt(number * 1,10))) {
        //--------------  
        // 定義變數  
        //--------------  
        //小寫的中文數字  
        var chineseNumber_lower = ('〇一二三四五六七八九').split('');
        //大寫的中文數字  
        var chineseNumber_upper = ('零壹貳參肆伍陸柒捌玖').split('');
        //數詞單位陣列  
        var chineseOrder = ('十百千 萬億兆京垓秭穰溝澗正載').split('');
        if (tail == null) {
            //chineseOrder[3] = '元整';
        } else {
            //chineseOrder[3] = tail;
        }
        //定義儲存轉換後的數字結果陣列  
        var transformNumber = new Array();
        //逆轉數字後的數字陣列  
        var numberAsString = new Array();
        //用來記錄移動位數的索引(從tail開始)  
        var orderFlag = 3;
        //--------------  
        // 數字處理  
        //--------------  
        //將數字字串化  
        number = number + '';
        //逆轉數字後儲入陣列  
        for (var i = number.length - 1; i >= 0; i--) {
            numberAsString[numberAsString.length++] = number.charAt(i);
        }
        //針對每個英文數字處理  
        for (var i = 0; i < numberAsString.length; i++) {
            //產生對應的中文數字，並且依大小寫有所不同  
            if (lowerorsupper == 'upper') {
                numberAsString[i] = chineseNumber_upper[numberAsString[i]];
                chineseOrder[0] = '拾';
                chineseOrder[1] = '佰';
                chineseOrder[2] = '仟';
            } else {
                numberAsString[i] = chineseNumber_lower[numberAsString[i]];
                chineseOrder[0] = '十';
                chineseOrder[1] = '百';
                chineseOrder[2] = '千';
            }
            //添加數詞  
            switch ((i + 1) % 4) {
                case 1:
                    transformNumber[numberAsString.length - i] = numberAsString[i]; //+ chineseOrder[orderFlag];
                    break;
                case 2:
                    transformNumber[numberAsString.length - i] = numberAsString[i] + chineseOrder[0];
                    break;
                case 3:
                    transformNumber[numberAsString.length - i] = numberAsString[i] + chineseOrder[1];
                    break
                case 0:
                    transformNumber[numberAsString.length - i] = numberAsString[i] + chineseOrder[2];
                    break;
            }
            //每處理四個數字後移動位數索引  
            if ((i + 1) % 4 == 0) {
                orderFlag++;
            }
        }
        //回傳轉換後的中文數字
        return transformNumber.join('').replace("十〇", "十").replace("一十", "十");
        //return transformNumber;//.join('');
    } else {
        return '數字必需為整數';
    }
}


//套印時判斷 checkgroup val
function ArrayIndexOf(arr, val) {
    if (!Array.prototype.indexOf) {
        Array.prototype.indexOf = function (elt /*, from*/) {
            var len = this.length >>> 0;

            var from = Number(arguments[1]) || 0;
            from = (from < 0)
         ? Math.ceil(from)
         : Math.floor(from);
            if (from < 0)
                from += len;

            for (; from < len; from++) {
                if (from in this &&
          this[from] === elt)
                    return from;
            }
            return -1;
        };
    }
    else {
        return arr.indexOf(val);
    }

}




