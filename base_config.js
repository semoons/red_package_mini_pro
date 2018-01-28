const config = {
	"interfaceDomin": "https://miniptapi.innourl.com/Redpacket/", // 测试环境接口域名
	// "imgUrl": "http://10.1.1.5:8092/images/red_package_min_pro/", // 测试环境图片地址
	"imgUrl": "http://inno.mo2o.com.cn:8092/images/red_package_min_pro/", // 测试环境图片地址
	"pageSize": 20,
	"reqMethod": "GET",
	"header": {
		'content-type': 'application/json'
	},
	"interfaceList": {
		/**
		 * 根据brand_code获取品牌信息
		 * {brandCode}
		 */
		"GET_BRAND_INFO": "GetBrandInfo",
		/**
		 * 登陆注册
		 * {brandId}
		 */
		"LOGIN": "User/Login",
		/**
		 * 代理到合法域名下接口
		 * {url}
		 */
		"PROXY_GET": "Proxy/Get",
		/**
		 * 根据用户获取发送的红包列表
		 * {userId}&{pageIndex}&{pageSize}
		 */
		"GET_SEND_RED_PACKAGE": "GetSendRedpacketListByUserId",
		/**
		 * 根据用户获取收到的红包列表
		 * {userId}&{pageIndex}&{pageSize}
		 */
		"GET_RECEIVED_RED_PACKAGE": "GetReceivedRedpacketListByUserId",
		/**
		 * 获取用户创建红包所需的信息
		 * {userId}&{brandId}
		 */
		"GET_USER_PLAY_INFO": "User/GetUserPlayInfo",
		/**
		 * 生成一个红包
		 */
		"CREATE_REDPACKET": "CreateRedpacketActivity",
		/**
		 * 取消红包
		 * {redpacketSendId}
		 */
		"CANCEL_REDPACKET_ACTIVITY": "CancelRedpacketActivity",
		/**
		 * 获取指定红包的领取情况
		 * {redpackageSendId}&{userId}
		 */
		"GET_REDPACKETrECEIVE_LIST": "GetRedpacketReceivedListById",
		/**
		 * 获取小程序码
		 * {path}&{width}&{scene}
		 */
		"CREATE_MINI_PRO_CODE": "WxSupport/CreateMiniProCode"
	}
}

module.exports.config = config;