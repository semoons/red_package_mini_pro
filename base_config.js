const config = {
    "interfaceDomin": "https://miniptapi.innourl.com/", // 测试环境接口域名
	"imgUrl": "http://inno.mo2o.com.cn:8092/images/red_package_min_pro/", // 测试环境图片地址
    "pageSize": 20,
    "reqMethod": "GET",
    "header": {
        'content-type': 'application/json'
    },
    "interfaceList": {
		/**
		 * 代理到合法域名下接口
		 * {url}
		 */
		"PROXY_GET": "Proxy/Get",
		/**
         * 获取小程序分享二维码接口
         * {path}&{width}
         */
		"CREATE_QR_CODE": "WxSupport/CreateQRCode",
    }
}

module.exports.config = config;