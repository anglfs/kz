<template>
	<view class="rule">
		<view class="rItem">
			<view class="ri1">
				<image class="ri1i" src="../static/img/rule.png" mode=""></image>
				<view class="ri1t">
					怎么有效推广
				</view>
			</view>
			<view class="ri2">
				<view class="ri2b1">
					1.进入小程序，授权用户信息后，将小程序分享给任何好友，群聊。
				</view>
				<view class="ri2b1">
					2.进入小程序，点击“我的->加入推广大使-推广海报”，保存生成的海报可分享微信好友，群聊，朋友圈，订阅号。
				</view>
				<view class="ri2b1">
					3.分享次数不受限制。
				</view>
			</view>
		</view>
		<view class="rItem">
			<view class="ri1">
				<image class="ri1i" src="../static/img/rule.png" mode=""></image>
				<view class="ri1t">
					推广收益规则
				</view>
			</view>
			<view class="ri2">
				<view class="ri2b1">
					1.推广收益获取分为：普通推广大使和VIP推广大使。
				</view>
				<view class="ri2b1">
					2.普通推广大使每成功邀请好友预订并支付后一个商品可以获得<text class="rbtext">0.05元</text>收益。
				</view>
				<view class="ri2b1">
					3.VIP推广大使每成功邀请好友预订并支付后一个商品可获得<text class="rbtext">0.1元</text>收益。
				</view>
				<view class="ri2b1">
					4.支付推广费{{vipAmount}}元成为VIP推广大使，可领用{{vipMaskNum}}片一次民用口罩，并优先派发。
				</view>
			</view>
		</view>
		<view class="rItem">
			<view class="ri1">
				<image class="ri1i" src="../static/img/rule.png" mode=""></image>
				<view class="ri1t">
					收益如何提现
				</view>
			</view>
			<view class="ri2">
				<view class="ri2b1">
					1.进入小程序，点击我的，填写提现信息后进行提现申请，系统审核通过后进行转账。
				</view>
				<view class="ri2b1">
					2.用户每次提现的收益要大于10元。
				</view>
			</view>
		</view>
		<view class="right">
			本活动最终解释权归活动方所有。
		</view>
	</view>
</template>

<script>
	export default{
		data(){
			return{
				vipAmount:"99",
				vipMaskNum:"50"
			}
		},
		onLoad(opt){
			if(opt.vipAmount && opt.vipAmount != "undefined"){
				this.vipAmount = opt.vipAmount;
			}
			if(opt.vipMaskNum && opt.vipMaskNum != "undefined"){
				this.vipMaskNum = opt.vipMaskNum;
			}
		}
	}
</script>

<style lang="less" scoped>
	.rule{
		min-height: 100vh;
		background-color: #F3F4F5;
		padding-top: 40rpx;
		padding-bottom: 40rpx;
		box-sizing: border-box;
		.rItem{
			margin-bottom: 30rpx;
			.ri1{
				position: relative;
				.ri1i{
					width: 286rpx;
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
					.rbtext{
						color: #ED5D5D;
					}
				}
			}
		}
		.right{
			padding-left: 32rpx;
			margin-top: 10rpx;
			color: #C0C4CC;
			font-size: 22rpx;
		}
	}
</style>