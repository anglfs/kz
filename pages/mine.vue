<template>
	<view class="mine">
		<navBar name="我的" />
		<view class="m1">
			<div class="m1img">
				<image mode="widthFix" class="bgk" src="../static/img/mbgk.png"></image>
			</div>
			<div class="md1">
				<button v-if="!hasLogin" class="md1n" open-type="getUserInfo" lang="zh_CN" @getuserinfo="onGotUserInfo">
					<view class="md1d1">
						<image class="md1d1img" src="../static/img/user.png" mode="widthFix"></image>
					</view>
					<view class="md1d2">
						点击登录
					</view>
				</button>
				<view class="md1y" v-else>
					<image class="md1yimg" :src="userInfo.avatarUrl" mode=""></image>
					<view class="md1md3">
						{{userInfo.nickName}}
					</view>
				</view>
			</div>
		</view>
		<view class="m2">
			<button v-if="!hasLogin" class="m2itembtn m2item" open-type="getUserInfo" lang="zh_CN" @getuserinfo="onGotUserInfo">
				<view class="m2ib">
					<view class="m2ibw1">
						<view class="m2ibw1d1">
							<image class="m2ibw1d1img1" src="../static/img/m1.png" mode="widthFix"></image>
						</view>
						<view class="m2ibw1d2">
							我的订单
						</view>
					</view>
					<view class="m2ibw1o1">
						<view class="m2ibw1d3">
							全部订单
						</view>
						<image class="m2ibw2" src="../static/img/m4.png" mode="widthFix"></image>
					</view>
				</view>
				<view class="m2ib1">
					您还没有预约订购的订单，返回首页参与订购吧
				</view>
			</button>
			<view class="m2item" v-else>
				<view class="m2ib" @tap="toPath('/pages/orderList')">
					<view class="m2ibw1">
						<view class="m2ibw1d1">
							<image class="m2ibw1d1img1" src="../static/img/m1.png" mode="widthFix"></image>
						</view>
						<view class="m2ibw1d2">
							我的订单
						</view>
					</view>
					<view class="m2ibw1o1">
						<view class="m2ibw1d3">
							全部订单
						</view>
						<image class="m2ibw2" src="../static/img/m4.png" mode="widthFix"></image>
					</view>
				</view>
				<view class="m2ib2" v-if="order">
					<view class="d1">
						<view class="d1t1">
							预约单号：{{order.orderSn}}
						</view>
						<view class="d1t2">
							<text v-if="order.status == -1">已取消</text>
							<text v-if="order.status == 0">预定中</text>
							<text v-if="order.status == 1">待支付</text>
							<text v-if="order.status == 2">已支付</text>
							<text v-if="order.status == 3">已发货</text>
						</view>
					</view>
					<view class="d2">
						<view class="d2r1">
							<view class="d2r2j1">
								下单时间：{{order.createTime}}
							</view>
							<view class="d2r2j2">
								数量：{{order.num}}片
							</view>
						</view>
						<view class="d2r2">
							<image class="d2r2f1" src="../static/img/m5.png"></image>
							<view class="d2r2f2">{{order.receiverName}}</view>
							<view class="d2r2f3">{{order.receiverPhone}}</view>
						</view>
						<view class="d2r3">
							{{order.receiverProvince}}{{order.receiverCity}}{{order.receiverRegion}}{{order.receiverDetailAddress}}
						</view>
					</view>
					<view class="d3">
						<view class="d3r1"  v-if="order.orderType == 1">
							VIP推广领取
						</view>
						<view class="d3r1" v-else>
							<text v-if="order.status == 2 || order.status == 3">已支付：¥{{order.amount}}</text>
							<text v-else>待支付：¥{{order.amount}}</text>
						</view>
						<view class="d3r2">
							<view class="d3r2b1" v-if="order.status == 0" @tap="cancelOrder(order.id)">
								取消
							</view>
							<view class="d3r2b2" v-if="order.status == 0 || order.status == 1" @tap="toPath('/pages/editaddr?id=' + order.id + '&from=mine')">
								修改地址
							</view>
							<view class="d3r2b3" v-if="order.status == 1" @tap="pay(order.id)">
								去支付
							</view>
							<!-- vip领取不可再次预约 -->
							<view class="" v-if="order.orderType != 1">
								<view class="d3r2b2" v-if="order.status == -1 || order.status == 3" @tap="toPath('/pages/detail?id=' + order.productId)">
									再次预定
								</view>
							</view>
						</view>
					</view>
					<view class="d4" v-if="order.status == -1">
						<text v-if="order.cancelType == 1">用户取消</text>
						<text v-else-if="order.cancelType == 2">超过{{config.BIZ_ORDER_OVER_TIME}}小时未支付自动取消</text>
						<text v-else>管理员取消</text>
					</view>
					<view class="d4 d5" v-if="order.status == 2 && order.preDeliveryTime">
						预计{{order.preDeliveryTime}}前发货
					</view>
					<view class="d4" v-if="order.status == 3" @tap="copy(order.orderSn)">
						{{order.deliveryCompany}}：
						<text v-if="order.deliverySn">{{order.deliverySn}}</text>
						<text v-else>单号数据同步中</text>
						<image class="rb2h2t3" src="../static/img/copy.png" mode="widthFix"></image>
					</view>
				</view>
				<view class="m2ib1" v-else @tap="toPath('/pages/reserve')">
					您还没有预约订购的订单，返回首页参与订购吧
				</view>
			</view>
			<button v-if="!hasLogin" class="m2itembtn m2item" open-type="getUserInfo" lang="zh_CN" @getuserinfo="onGotUserInfo">
				<view class="m2ib">
					<view class="m2ibw1">
						<view class="m2ibw1d1">
							<image class="m2ibw1d1img2" src="../static/img/m2.png" mode="widthFix"></image>
						</view>
						<view class="m2ibw1d2">
							我的推广
						</view>
					</view>
					<view class="m2ibw1o1">
						<view class="m2ibw1d3">
							下载海报
						</view>
						<image class="m2ibw2" src="../static/img/m4.png" mode="widthFix"></image>
					</view>
				</view>
			</button>
			<view class="m2item" v-else @tap="toPath('/pages/promote')">
				<view class="m2ib">
					<view class="m2ibw1">
						<view class="m2ibw1d1">
							<image class="m2ibw1d1img2" src="../static/img/m2.png" mode="widthFix"></image>
						</view>
						<view class="m2ibw1d2">
							我的推广
						</view>
					</view>
					<view class="m2ibw1o1">
						<view class="m2ibw1d3">
							下载海报
						</view>
						<image class="m2ibw2" src="../static/img/m4.png" mode="widthFix"></image>
					</view>
				</view>
			</view>
			<button class="m2item m2itemWbtn" open-type="contact" @contact="handleContact">
				<view class="m2ib">
					<view class="m2ibw1">
						<view class="m2ibw1d1">
							<image class="m2ibw1d1img3" src="../static/img/m3.png" mode="widthFix"></image>
						</view>
						<view class="m2ibw1d2">
							客服咨询
						</view>
					</view>
					<image class="m2ibw2" src="../static/img/m4.png" mode="widthFix"></image>
				</view>
			</button>
			<view class="m2item2" @tap="logOut" v-if="hasLogin">
				退出登录
			</view>
		</view>
	</view>
</template>

<script>
	import navBar from "@/components/nav-bar";
	import { mapState } from 'vuex';
	import utils from '../utils/method.js'
	export default {
		components: {navBar},
		data() {
			return {
				order:null,
			}
		},
		computed:{
			...mapState(['hasLogin','userInfo','config'])
		},
		async onPullDownRefresh() {
			uni.showLoading({
				title:"数据加载中..."
			})
			if(this.hasLogin){
				await this.getPromoteInfo()
			}
			uni.stopPullDownRefresh();
			uni.hideLoading();
		},
		methods: {
			handleContact (e) {
				console.log(e.detail.path)
				console.log(e.detail.query)
			},
			async pay(orderId){
				 var that = this
				await this.$http({
					apiName:"wxPay",
					method:"POST",
					data:{orderId:orderId}
				}).then(res => {
					let obj = {
						nonceStr: res.nonceStr,
						timeStamp: res.timeStamp,
						package:res.packageValue,
						signType:res.signType,
						paySign:res.paySign,
						appId: res.appId,
					}
					uni.requestPayment({
					    provider: 'wxpay',
					    ...obj,
					    success: function (res) {
							uni.showToast({
								title: "支付成功",
								duration: 1500,
							})
							setTimeout(()=>{
								that.getOrder()
							},1500)
					    },
					    fail: function (err) {
					       uni.showToast({
								title: "支付失败",
								duration: 1500,
								icon:"none"
					       })
					    }
					});
				}).catch(_ => {})
				
			},
			async onGotUserInfo(e) {
				uni.showLoading({
				    title: '请求中...'
				});
				let res1 = await utils.wxLogin();
				if(res1){
					let res2 = await this.$http({
						apiName:'userLogin',
						method:'POST',
						data:res1
					})
					try{
						utils.setSesion(res2,res1);
						this.getInvite();
						this.getOrder();
					}catch(e){}
				}else{
					uni.showToast({
						icon: 'none',
						title: "授权失败",
						duration: 1500
					});
				}
				uni.hideLoading()
			 },
			 async getInvite(){
				await this.$http({
					apiName:"userInfo",
				}).then(res => {
					this.$store.commit("setmyInviteCode",res.inviteCode)
				}).catch(_=>{})
			 },
			 async getPromoteInfo(){
			 	let res = await this.$http({
			 		apiName:"getPromoteInfo",
			 	})
			 	try{
					this.order = res.Order;
			 	}catch(e){}
			 },
			 toPath(path){
				uni.navigateTo({
					url:path
				})
			 },
			 async cancelOrder(orderId){
				 let _self = this;
				 uni.showModal({
				     title: '提示',
				     content: '确定取消该订单吗',
				     success: function (res) {
				         if (res.confirm) {
				             _self.cancelOrderOk(orderId)
				         } else if (res.cancel) {
				             
				         }
				     }
				 });
				 
			 },
			 async cancelOrderOk(orderId){
				 let _self = this;
				 let res = await this.$http({
					 apiName:"cancelOrder",
					 data:{orderId:orderId},
					 method:"POST"
				 })
				 try{
				 	uni.showToast({
				 		title: "订单已取消",
				 		duration: 1500
				 	})
				 	setTimeout(_=>{
				 		_self.getOrder()
				 	},1500)				
				 }catch(e){}
			 },
			 copy(data){
			 	let _self = this
			 	uni.setClipboardData({
			 		data: data,
			 		success() {
			 			uni.showToast({
			 				title: "复制成功",
			 			})
			 		}
			 	});
			 },
			 logOut(){
				 let _self = this;
				 uni.showModal({
					 title: '提示',
					 content: '确定退出登录吗',
					 success: function (res) {
						 if (res.confirm) {
							 _self.logOutok()
						 } else if (res.cancel) {
							 
						 }
					 }
				 });
			 },
			 async logOutok(){
				 await this.$http({
					 apiName:"loginOut",
				 }).then(res => {
					 utils.rmData()
					 uni.showToast({
					 	title: "退出成功",
					 })
				 }).catch(e=>{})
			 }
		},
		async onShow() {
			uni.showLoading({
				title:"数据加载中..."
			})
			if(this.hasLogin){
				await this.getPromoteInfo()
			}
			uni.hideLoading();
		}
	}
</script>

<style lang="less" scoped>
	.mine{
		min-height: 100vh;
		background-color: #F3F4F5;
		.m1{
			.m1img{
				font-size: 0;
				.bgk{
					width: 100%;
					height: 438rpx;
				}
			}
			.md1{
				position: absolute;
				top: 180rpx;
				left: 0;
				width: 100%;
				.md1n{
					background: none;
					padding: 0;
					width: 146rpx;
					margin: auto;
					.md1d1{
						width: 128rpx;
						height: 128rpx;
						background-color: #E5FFF6;
						border-radius: 50%;
						text-align: center;
						margin: auto;
						.md1d1img{
							margin-top: 34rpx;
							width: 56rpx;
							height: auto;
						}
					}
					.md1d2{
						margin-top: 18rpx;
						background-color: #FFDE26;
						width: 146rpx;
						text-align: center;
						border-radius: 25rpx;
						color: #B0620C;
						font-size: 26rpx;
						height: 44rpx;
						line-height: 44rpx;
					}
				}
				.md1n::after{
				    border:none;
					border-radius: 0;
				}
				.md1y{
					margin: auto;
					text-align: center;
					.md1yimg{
						width: 130rpx;
						height: 130rpx;
						border: 2px solid #fff;
						border-radius: 50%;
						box-sizing: border-box;
					}
					.md1md3{
						color: #fff;
						font-size: 30rpx;
						margin-top: 18prx;
					}
				}
			}
		}
		.m2{
			padding-left: 32rpx;
			padding-right: 32rpx;
			margin-top:-32rpx;
			position: relative;
			.m2itembtn{
				padding: 0;
				.m2ibw1d1{
					display: flex;
					justify-content: center;
				}
			}
			.m2itembtn::after{
				border: none;
			}
			.m2itemWbtn{
				padding: 0;
				.m2ibw1d1{
					display: flex;
					justify-content: center;
				}
			}
			.m2itemWbtn::after{
				border: none;
			}
			.m2item{
				background-color: #fff;
				border-radius: 12rpx;
				padding: 24rpx 28rpx;
				margin-bottom: 32rpx;
				.m2ib{
					display: flex;
					justify-content: space-between;
					align-items: center;
					height: 56rpx;
					.m2ibw1{
						display: flex;
						align-items: center;
						.m2ibw1d1{
							width: 56rpx;
							height: 56rpx;
							background-color: #DCFFF3;
							text-align: center;
							border-radius: 50%;
							.m2ibw1d1img1{
								width: 32rpx;
								height: auto;
								margin-top: 10rpx;
							}
							.m2ibw1d1img2{
								width: 38rpx;
								height: auto;
								margin-top: 12rpx;
							}
							.m2ibw1d1img3{
								width: 40rpx;
								height: auto;
								margin-top: 10rpx;
							}
						}
						.m2ibw1d2{
							color: #303133;
							font-size: 30rpx;
							margin-left: 10rpx;
						}
					}
					.m2ibw2{
						width: 16rpx;
					}
					.m2ibw1o1{
						display: flex;
						align-items: center;
						.m2ibw1d3{
							color: #4395c5;
							font-size: 24rpx;
							margin-right: 10rpx;
						}
					}
				}
				.m2ib1{
					margin-top: 10rpx;
					color: #C0C4CC;
					font-size: 26rpx;
					text-align: left;
				}
				.m2ib2{
					margin-top: 10rpx;
					padding: 20rpx 24rpx;
					background-color: #EDFCF7;
					border-radius: 8rpx;
					.d1{
						display: flex;
						justify-content: space-between;
						align-items: center;
						padding-bottom: 18rpx;
						border-bottom: 2rpx solid #E9EBEF;
						.d1t1{
							color: #303133;
							font-size: 24rpx;
						}
						.d1t2{
							color: #ED5D5D;
							font-size: 26rpx;
						}
					}
					.d2{
						padding-top: 10rpx;
						padding-bottom: 14rpx;
						border-bottom: 2rpx solid #E9EBEF;
						.d2r1{
							display: flex;
							justify-content: space-between;
							align-items: center;
							color: #303133;
							font-size: 24rpx;
						}
						.d2r2{
							margin-top: 10rpx;
							display: flex;
							align-items: center;
							color: #909399;
							font-size: 24rpx;
							.d2r2f1{
								width: 20rpx;
								height: 20rpx;
							}
							.d2r2f2{
								margin-left: 10rpx;
							}
							.d2r2f3{
								margin-left: 10rpx;
							}
						}
						.d2r3{
							margin-top: 6rpx;
							color: #909399;
							font-size: 24rpx;
						}
					}
					.d3{
						padding-top: 18rpx;
						display: flex;
						justify-content: space-between;
						align-items: center;
						.d3r1{
							color: #303133;
							font-size: 24rpx;
						}
						.d3r2{
							display: flex;
							align-items: center;
							.d3r2b1{
								height: 38rpx;
								border: 2rpx solid #909399;
								border-radius: 20rpx;
								color: #909399;
								padding-left: 16rpx;
								padding-right: 16rpx;
								font-size: 24rpx;
								line-height: 38rpx;
							}
							.d3r2b2{
								margin-left: 16rpx;
								height: 38rpx;
								border: 2rpx solid #4395c5;
								border-radius: 20rpx;
								color: #4395c5;
								padding-left: 16rpx;
								padding-right: 16rpx;
								font-size: 24rpx;
								line-height: 38rpx;
							}
							.d3r2b3{
								margin-left: 16rpx;
								height: 38rpx;
								border: 2rpx solid #4395c5;
								border-radius: 20rpx;
								color: #fff;
								padding-left: 16rpx;
								padding-right: 16rpx;
								font-size: 24rpx;
								line-height: 38rpx;
								background-color: #4395c5;
							}
						}
					}
					.d4{
						color: #ED5D5D;
						font-size: 24rpx;
						display: flex;
						align-items: center;
						margin-top: 6rpx;
						.rb2h2t3{
							margin-left: 10rpx;
							width: 30rpx;
							height: auto;
						}
					}
					.d5{
						color: #303133;
					}
				}
			}
			.m2item2{
				line-height: 80rpx;
				border-radius: 40rpx;
				border: 2rpx solid #4395c5;
				text-align: center;
				font-size: 28rpx;
				color: #4395c5;
			}
		}
	}
</style>
