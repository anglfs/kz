<template>
	<view class="ro">
		<image class="roimg" src="../static/img/resok.png" mode="widthFix"></image>
		<view class="ro1">
			<text v-if="buyType == 0">预约信息已提交成功，请留意手机通知</text>
			<text v-if="buyType == 1">购买信息已提交成功，请留意手机通知</text>
		</view>
		<view class="ro2">
			<text>预约单号：{{resn}}</text>
		</view>
		<button class="ro3 sharebtn" open-type="share" @ShareAppMessage="onShareAppMessage">
			分享给好友
		</button>
		<view class="ro4" @tap="toTab('/pages/index')">
			返回首页
		</view>
	</view>
</template>
<script>
	import { mapState } from 'vuex';
	export default{
		data(){
			return {
				resn:"",
				productId:"",
				buyType:0,  //购买类型，0预约，1购买
			}
		},
		computed:{
			...mapState(['shareImg','myInviteCode','shareProTitle','config'])
		},
		methods:{
			onShareAppMessage(){
				return {
				  title: this.shareProTitle,
				  path: "/pages/index?productId=" + this.productId + "&inviteCode" + this.myInviteCode,
				  imageUrl:this.config.BIZ_SHARE_URL + "?temp=" + Date.parse(new Date()),
				}
			},
			toPath(path){
				uni.navigateTo({
					url:path
				})
			},
			toTab(path){
				uni.switchTab({
					url:path
				})
			}
		},
		onLoad(opt) {
			this.resn = opt.resn;
			this.productId = opt.productId;
			this.buyType = opt.buyType;
		}
	}
</script>
<style lang="less" scoped>
	.ro{
		min-height: 100vh;
		background-color: #F3F4F5;
		padding-top: 96rpx;
		box-sizing: border-box;
		text-align: center;
		.roimg{
			width: 248rpx;
			height: auto;
		}
		.ro1{
			margin-top: 10rpx;
			color: #909399;
			font-size: 26rpx;
		}
		.ro2{
			margin-top: 10rpx;
			color: #909399;
			font-size: 26rpx;
		}
		.ro3{
			width:400rpx;
			height:80rpx;
			background:linear-gradient(133deg,#55bdf9 0%,#4395c5 100%);
			border-radius:40rpx;
			margin: auto;
			text-align: center;
			line-height: 80rpx;
			font-size: 26rpx;
			margin-bottom: 30rpx;
			color: #fff;
			margin-top: 80rpx;
		}
		.sharebtn{
			padding: 0;
		}
		.sharebtn::after{
			border: none;
		}
		.ro4{
			width:400rpx;
			height:80rpx;
			border-radius:40rpx;
			border:2rpx solid #4395c5;
			box-sizing: border-box;
			margin: auto;
			text-align: center;
			line-height: 80rpx;
			font-size: 26rpx;
			margin-bottom: 30rpx;
			color: #4395c5;
		}
	}
</style>