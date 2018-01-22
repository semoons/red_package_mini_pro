const Base64 = require('../encode_helper/base64.js');


/**
 * 判断中文字符
 * 根据后台要求~请求参数若是中文字符~在进行base64编码前要经过urlencode转码
 */
function _isChineseChar(str) {
	var reg = /[\u4E00-\u9FA5\uF900-\uFA2D]/;
	return reg.test(str);
}

function queryEncoded(params) {
	var resultStr = '';
	for (let item in params) {
		let value = params[item];
		value = _isChineseChar(value) ? encodeURI(value).toLowerCase() : value;
		resultStr = resultStr + '&' + Base64.encode(value);
	}
	return resultStr.substr(1);
}

module.exports = {
	queryEncoded: queryEncoded
}