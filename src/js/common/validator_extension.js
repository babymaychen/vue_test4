// 定义错误消息
var messages = {
    "error.required": "请输入",
    "error.required.select": "请选择",
    "error.format.digits": "请输入半角数字",
    "error.format.number": "请输入数值",
    "error.format.alphanumber": "请输入半角英文或者数字",
    "error.format.decimal": "请输入整数{0}位以内，小数{1}位以内的数字",
    "error.format.onlydecimal": "请输入小数{0}位以内的数字",
    "error.format.mail": "请输入正确的邮件地址",
    "error.format.half": "请输入半角符号",

    "error.maxlength": "请输入{0}字符以下的文字",
    "error.minlength": "请输入{0}字符以上的文字",
    "error.rangelength": "{0}文字以上、{1}文字以下で入力してください。",

    "error.max": "{0} 以下の値を入力してください。",
    "error.min": "{0} 以上の値を入力してください。",
    "error.range": "{0}から{1}の範囲以内で数値を入力してください。",

    "error.max2": "{0}桁以内で入力してください。",
    "error.min2": "{0}桁以上で入力してください。",
    "error.range2": "{0}桁以上、{1}桁以下で入力してください。",

    "error.time.compare": "{0}以降の時間を選択してください。",
    "error.record.deleted": "他のユーザによって削除されました。",
    "error.record.updated": "他のユーザによって更新されました。",
    "error.user.deleted": "他のユーザによって選択したユーザーが削除されました。",
    "error.existsuser.updated": "他のユーザによって既存ユーザIDが登録されました。",
    "error.existsuser.deleted": "他のユーザによって既存ユーザIDが削除されました。",
    "error.not.exists": "存在していません。",
    "error.db.exists": "既にDBに登録しています。",

    "message.delete": "削除が成功しました。",
    "message.insert": "登録が成功しました。",
    "message.update": "更新が成功しました。",
    "message.user.comfirm.delete": "選択したユーザを削除してよろしいですか。"
}


/**
 * 扩展默认的校验方法
 * jquery validator extension
 */
function extendsValidator() {

    // 必須
    // required

    // セレクトボックス - 必須選択
    // requiredSelect
    jQuery.validator.addMethod("requiredSelect", function(value, element) {
        var val = $( element ).val();
        return val && val.length > 0;
    }, messages["error.required.select"]);

    // セレクトボックス - 必須選択
    // requiredCheckbox
    jQuery.validator.addMethod("requiredCheckbox", function(value, element) {
        var name = $( element ).attr("name");
        return $("[name='" + name + "']:checked").length > 0;
    }, messages["error.required.select"]);

    // メールアドレス
    // email

    // 半角数字
    // digits
    // digits: true -> no allow for minus
    // digits: [true] -> allow minus
    jQuery.validator.addMethod("digits", function(value, element, params) {
        var minus = params[0];
        var regStr = "";
        if(minus === true){
            regStr = "^(-)?\\d+$";
        }else{
            regStr = "^\\d+$";
        }
        return this.optional( element ) || new RegExp(regStr).test( value );
    }, messages["error.format.number"]);

    // 数値（小数可）
    // number
    // number: true -> no allow for minus
    // number: [true] -> allow minus
    jQuery.validator.addMethod("number", function(value, element, params) {
        var minus = params[0];
        var regStr = "";
        if(minus === true){
            regStr = "^(-)?\\d{1,}(\\.\\d{1,})?$";
        }else{
            regStr = "^\\d{1,}(\\.\\d{1,})?$";
        }
        return this.optional( element ) || new RegExp(regStr).test( value );
    }, messages["error.format.number"]);

    // 半角英数字
    // alphanumeric
    jQuery.validator.addMethod("alphanumeric", function(value, element) {
        return this.optional(element) || /^[0-9a-zA-Z]+$/.test(value);
    }, messages["error.format.alphanumber"]);

    // 整数 + 小数フォーマット
    // decimal
    // decimal: [2,8] -> no allow for minus
    // decimal: [2,8, true] -> allow for minus
    jQuery.validator.addMethod("decimal", function(value, element, param) {
        var intMax = param[0];
        var decimalMax = param[1];
        var minus = param[2];
        var regStr = "";
        if(minus === true){
            regStr = "^(-)?\\d{1,intMax}(\\.\\d{1,decimalMax})?$";
        }else{
            regStr = "^\\d{1,intMax}(\\.\\d{1,decimalMax})?$";
        }
        regStr = regStr.replace("intMax", intMax);
        regStr = regStr.replace("decimalMax", decimalMax);
        var regExp = new RegExp(regStr);
        return this.optional(element) || regExp.test(value);
    }, messages["error.format.decimal"]);

    // 小数フォーマット
    // onlydecimal
    // onlydecimal: [6, true]
    // onlydecimal: [6]
    jQuery.validator.addMethod("onlydecimal", function(value, element, param) {
        var decimalMax = param[0];
        var minus = param[1];
        var regStr = "";
        if(minus === true){
            regStr = "^(-)?\\d{1,}(\\.\\d{1,decimalMax})?$";
        }else{
            regStr = "^\\d{1,}(\\.\\d{1,decimalMax})?$";
        }
        regStr = regStr.replace("decimalMax", decimalMax);
        var regExp = new RegExp(regStr);
        return this.optional(element) || regExp.test(value);
    }, messages["error.format.onlydecimal"]);

    // 数値の最大値
    // max

    // 数値の最小値
    // min

    // 数値の範囲
    // range

    // 文字列の長さ最大値
    // maxlength

    // 文字列の長さの最小値
    // minlength

    // 文字列の長さ範囲
    // rangelength

    // 半角記号
    // half
    // [ascii 0 - 254 + ｱ-ﾝ]
    jQuery.validator.addMethod("half", function(value, element) {
        var reg = /^[\x00-\xFFｱ-ﾝ]*$/;
        return this.optional(element) || reg.test(value);
    }, messages["error.format.half"]);

    jQuery.validator.addMethod("dateJa", function(value, element) {
        var check = false, re = /^\d{4}\/\d{2}\/\d{2}$/, adata, gg, mm, aaaa, xdata;
        if (re.test(value)) {
            adata = value.split("/");
            gg = parseInt(adata[2], 10);
            mm = parseInt(adata[1], 10);
            aaaa = parseInt(adata[0], 10);
            xdata = new Date(aaaa, mm - 1, gg, 12, 0, 0, 0);
            if ((xdata.getFullYear() === aaaa) && (xdata.getMonth() === mm - 1) && (xdata.getDate() === gg)) {
                check = true;
            } else {
                check = false;
            }
        } else {
            check = false;
        }
        return this.optional(element) || check;
    }, messages["validator.format.date"]);

    jQuery.validator.addMethod("isUrl", function(value, element) {
        var urlReg = /^(http|https):\/\/[\x00-\x7F]*$/i;
        return this.optional(element) || urlReg.test(value);
    }, messages["validator.url.format"]);

    // 日付を比較する endDate >= startDate
    jQuery.validator.addMethod("dateGreaterThan", function(value, element, param) {
        var startDate = $(param).val();
        if (!value) {
            // 終了日付入力なしの場合
            return true;
        } else if (!startDate || new Date(startDate) == "Invalid Date") {
            // 開始日付入力なし、開始日付チェックNGの場合
            return true;
        } else {
            return new Date(value) >= new Date(startDate);
        }
    }, messages["validator.dateGreaterThan.input"]);

    // 数字を比較する endNumber >= startNumber
    jQuery.validator.addMethod("numberGreaterThan", function(value, element, param) {
        var startNumber = $(param).val();
        if (!value) {
            // 終了数字入力なしの場合
            return true;
        } else if (!startNumber || !parseInt(startNumber) || !parseInt(value)) {
            // 開始日付入力なし、開始日付チェックNGの場合
            return true;
        } else {
            return parseInt(value) >= parseInt(startNumber);
        }
    }, messages["validator.input.invalid"]);

    jQuery.validator.setDefaults({
        ignore: ":hidden:not(.forValidate)",
        errorPlacement: function(error, element) {
            var $td = null;
            if (element.get(0).type === "checkbox") {
                $td = element.closest("td");
                error.appendTo($td);
            } else if(element.closest(".msSelect").length > 0){
                $td = element.closest("td");
                error.appendTo($td);
            }else {
                error.insertAfter(element);
            }
        }
    });

    extendDefaultMessages();
    supportWhiteSpaceTrim();
}

function validateRemoteResponse(response) {
    if (!response || !response.code) {
        return true;
    }
    if (data.code == "error_csrf") {
        showErrorMsg(response.result, toLogout);
        return false;
    } else if (response.code == "error_system") {
        showErrorMsg(response.result, toSystemError);
        return false;
    } else if (response.code == "error_timeout") {
        showErrorMsg(response.result, toSystemError);
        return false;
    } else {
        return true;
    }
    return true;
}

/*
* 扩展默认消息
*/
function extendDefaultMessages(){
    $.extend($.validator.messages, {
        required: messages["error.required"],
        remote: "このフィールドを修正してください。",
        email: messages["error.format.mail"],
        url: "有効なURLを入力してください。",
        date: "有効な日付を入力してください。",
        dateISO: "有効な日付（ISO）を入力してください。",
        number: messages["error.format.number"],
        digits: messages["error.format.digits"],
        creditcard: "有効なクレジットカード番号を入力してください。",
        equalTo: "同じ値をもう一度入力してください。",
        extension: "有効な拡張子を含む値を入力してください。",
        maxlength: $.validator.format(messages["error.maxlength"]),
        minlength: $.validator.format(messages["error.minlength"]),
        rangelength: $.validator.format(messages["error.rangelength"]),
        range: $.validator.format(messages["error.range"]),
        max: $.validator.format(messages["error.max"]),
        min: $.validator.format(messages["error.min"])
    });
}

/**
 * 前後の半角空白をトリムする
 */
function supportWhiteSpaceTrim(){
    $.each($.validator.methods, function (key, value) {
        $.validator.methods[key] = function () {
            var args = [];
            if(arguments.length > 0) {
                args = Array.prototype.slice.call(arguments);
                var trimFlag = getTrimFlag(args);
                if(trimFlag) {
                    args[0] = $.trim(args[0]);
                }
            }
            return value.apply(this, args);
        };
    });
}

function getTrimFlag(args) {
    // args[0]  -> value
    // args[1] -> element
    // args[2] -> params
    var params = args[2];
    if (!$.isArray(params)) {
        return true;
    }
    var trimFlag = true;
    for (var i = 0; i < params.length; i++) {
        var param = params[i];
        if (typeof param === "object" && param.trim === false) {
            trimFlag = false;
            break;
        }
    }
    return trimFlag;
}

export default extendsValidator