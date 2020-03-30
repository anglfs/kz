//接口
export default{
	userLogin:"/wxLogin",  //登录，返回session
	userInfo:"/get/userInfo",  //获取用户邀请码等信息
	loginOut:"/logout",
	sharePoster:"/getInviteImage",  //分享海报
	notice:"/get/message",  //首页通知
	config:"/getConfig",  //获取首页大图，最大最小预定，BIZ_EJECT_FLAG预定是是否弹窗1弹窗
	productInfo:"/get/product",  //获取商品信息（首页和详情页)
	productDetail:"/get/productInfo",  //根据id获取商品详情
	getOrder:"/get/orderList",  //获取订单,-1=已取消 0=预定中 1=待支付； 2=已支付 3=已发货
	makeOrder:"/add/ordinary/order",  //下单
	getPromoteInfo:"/get/referHome",  //推广首页数据
	referList:"/get/referList",  //获取我的推广记录
	orderInfo:"/get/orderInfo",  //获取订单详情
	editOrder:"/updat/orderAddress",  //修改订单
	cancelOrder:"/cancel/order",//用户取消订单
	orderList:"/get/orderList",  //获取订单列表
	wxPay:"/wx/unifiedOrder",  //请求支付信息
	withdraw:"/add/withdraw",  //提现申请
	vipGift:"/add/vip/order",  //领取vip礼物
	becomVip:"/becomeToVip",  //支付vip
	getPhone:"/getWuserMobile",  //获取手机号
}