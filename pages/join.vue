<template>
	<view class="rule">
		<view class="rItem">
			<view class="rih">
				<view class="ri1">
					<image class="ri1i" src="../static/img/rule.png" mode=""></image>
					<view class="ri1t">
						成为VIP推广大使后：
					</view>
				</view>
				<view class="rih2" @tap="toPath('/pages/rules')">
					活动规则
				</view>
			</view>
			<view class="ri2">
				<view class="ri2b1">
					1、成功邀请好友预约购买并支付后，每片商品获得0.1元的推广收益。
				</view>
				<view class="ri2b1">
					2、支付的¥{{vipAmount}}推广费直接兑换同等价值的LIVE MI一次性民用口罩{{vipMaskNum}}片，并优先发货。
				</view>
			</view>
		</view>
		<view class="re1">
			<view class="p3b2" @tap="payVip">
				确定支付¥{{vipAmount}}，成为VIP推广员
			</view>
			<view class="p3b3" @tap="toPath('/pages/withdraw')" v-if="showWd != -1">
				普通提现
			</view>
		</view>
		
	</view>
</template>

<script>
	export default{
		data(){
			return{
				vipAmount:"",
				vipMaskNum:"",
				showWd:-1,
				paying:false,
			}
		},
		methods:{
			async payVip(){
				if(this.paying){
					return
				}
				this.paying = true;
				uni.showLoading({
					title:"请求中...",
					mask:true
				})
				var that = this
				await this.$http({
					apiName:"becomVip",
					method:"POST",
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
							uni.hideLoading()
							that.paying = false;
							that.$store.commit("setIsVip",1);
							uni.showToast({
								title: "支付成功",
								duration: 1500,
							})
							setTimeout(()=>{
								// uni.navigateBack()
								uni.redirectTo({
									url:'getVipGift'
								})
							},1500)
					    },
					    fail: function (err) {
							uni.hideLoading()
							that.paying = false;
					        uni.showToast({
								title: "支付失败",
								duration: 1500,
								icon:"none"
					       })
					    }
					});
				}).catch(_ => {
					uni.hideLoading();
					this.paying = false;
				})
				
			},
			toPath(path){
				uni.navigateTo({
					url:path
				})
			}
		},
		onLoad(opt) {
			this.vipAmount = opt.vipAmount;
			this.vipMaskNum = opt.vipMaskNum;
			this.showWd = opt.showWd;
		}
	}
</script>

<style lang="less" scoped>
	.rule{
		min-height: 100vh;
		background-color: #F3F4F5;
		box-sizing: border-box;
		.rItem{
			padding-top: 40rpx;
			padding-bottom: 40rpx;
			background-color: #fff;
			.rih{
				display: flex;
				justify-content: space-between;
				align-items: center;
				padding-right: 32rpx;
				.rih2{
					color: #ED5D5D;
					font-size: 28rpx;
				}
			}
			.ri1{
				position: relative;
				.ri1i{
					width: 374rpx;
					height: 60rpx;
				}
				.ri1t{
					position: absolute;
					left: 32rpx;
					line-height: 60rpx;
					top: 0;
					color: #B0620C;
					font-size: 32rpx;
				}
			}
			.ri2{
				padding-left: 32rpx;
				padding-right: 32rpx;
				margin-top: 20rpx;
				color: #606266;
				font-size: 32rpx;
				line-height: 45rpx;
				.ri2b1{
					margin-bottom: 10rpx;
				}
			}
		}
		.re1{
			padding-left: 32rpx;
			padding-right: 32rpx;
			box-sizing: border-box;
			padding: 60rpx;
		}
		.p3b2{
			background:linear-gradient(133deg,#55bdf9 0%,#4395c5 100%);
			border-radius:40rpx;
			text-align: center;
			line-height: 88rpx;
			color: #fff;
			font-size: 32rpx;
		}
		.p3b3{
			text-align: center;
			margin-top: 40rpx;
			color: #606266;
			font-size: 30rpx;
		}
	}
</style>