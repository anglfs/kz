<template>
	<view class="pro">
		<navBar name="推广" :showBack="true" backColor="#fff" />
		<view class="p1">
			<view class="p1i">
				<image class="p1img" src="../static/img/prbgk.png" mode=""></image>
			</view>
			<view class="p1i2">
				<view class="p1i2r1">
					<image class="p1i2r1img" :src="userInfo.avatarUrl" mode=""></image>
					<view class="p1i2r1b1">
						<view class="p1i2r1b1t1">
							{{userInfo.nickName}}
						</view>
						<view class="p1i2r1b1t3" v-if="info.isVip == 1">
							<image class="p1i2r1b1t3img" src="../static/img/vip.png" mode="widthFix"></image>
							<view class="p1i2r1b1t3text">
								VIP推广大使
							</view>
						</view>
						<view class="p1i2r1b1t2" v-else>
							普通推广大使
						</view>
					</view>
				</view>
				<view class="p1i2r2" @tap="toPath('/pages/rules?vipAmount=' + info.vipAmount + '&vipMaskNum=' + info.vipMaskNum)">
					<image class="p1i2r2img" src="../static/img/qs.png" mode="widthFix"></image>
					<view class="p1i2r2t">
						活动规则
					</view>
				</view>
			</view>
		</view>
		<view class="p2" v-if="info.viewFlag == 0" @tap="toPath('/pages/join?showWd=-1' + '&vipAmount=' + info.vipAmount + '&vipMaskNum=' + info.vipMaskNum)">
			<view class="p2f">
				您有推广权益待领取
			</view>
			<text class="iconfont iconwode-gengduoicon f1"></text>
			<text class="iconfont iconwode-gengduoicon f2"></text>
		</view>
		<view class="p2" v-if="info.viewFlag == 1" @tap="toPath('/pages/getVipGift?vipTime=' + info.vipTime + '&vipAmount=' + info.vipAmount + '&vipMaskNum=' + info.vipMaskNum)">
			<view class="p2f">
				您有推广权益待领取
			</view>
			<text class="iconfont iconwode-gengduoicon f1"></text>
			<text class="iconfont iconwode-gengduoicon f2"></text>
		</view>
		<view class="p2" v-if="info.viewFlag == 2" @tap="toPath('/pages/getVipGift?vipTime=' + info.vipTime + '&orderId=' + info.vipOrderId + '&vipAmount=' + info.vipAmount + '&vipMaskNum=' + info.vipMaskNum)">
			<view class="p2f">
				查看权益领取信息
			</view>
			<text class="iconfont iconwode-gengduoicon f1"></text>
			<text class="iconfont iconwode-gengduoicon f2"></text>
		</view>
		<view class="p3">
			<view class="p3b">
				<view class="p2bt1">
					<view class="p2bt1m1">
						我的推广
					</view>
					<view class="p2bt1m2" @tap="toPath('/pages/record')">
						<view class="p2bt1m2y1">
							推广记录
						</view>
						<text class="iconfont iconwode-gengduoicon"></text>
					</view>
				</view>
				<view class="p2bt2">
					<view class="p2bt2k1">
						<view class="p2bt2k1o1">
							{{info.ReferUserNum || 0}}
						</view>
						<view class="p2bt2k1o2">
							{{info.totalNum || 0}}
						</view>
					</view>
					<view class="p2bt2k2">
						<view class="p2bt2k2o1">
							邀请好友
						</view>
						<view class="p2bt2k2o2">
							总预定数
						</view>
					</view>
				</view>
			</view>
			<view class="p3b">
				<view class="p2bt1">
					<view class="p2bt1m1">
						我的收益
					</view>
					<view class="p2bt1m3" @tap="withDraw">
						收益提现
					</view>
				</view>
				<view class="p2bt2">
					<view class="p2bt2k1">
						<view class="p2bt2k1o1">
							<view class="te1">
								¥
							</view>
							<view class="te2">
								<text v-if="info.isVip == 1">{{info.preVipProfit || 0}}</text>
								<text v-else>{{info.preVipProfit || 0}}</text>
							</view>
						</view>
						<view class="p2bt2k1o2">
							<view class="te1">
								¥
							</view>
							<view class="te2">
								<text v-if="info.isVip == 1">{{info.totalProfit || 0}}</text>
								<text v-else>{{info.preOrdinaryProfit || 0}}</text>
							</view>
						</view>
					</view>
					<view class="p2bt2k2">
						<view class="p2bt2k2o1">
							<text v-if="info.isVip == 1">预计收益</text>
							<text v-else>VIP收益</text>
						</view>
						<view class="p2bt2k2o2">
							<text v-if="info.isVip == 1">当前收益</text>
							<text v-else>普通收益</text>
						</view>
					</view>
					<view class="p2bt2k3">
						<view class="p2bt2k3o1">
							
						</view>
						<view class="p2bt2k3o2">
							提现中：¥{{info.freezeProfit || 0}}
						</view>
					</view>
				</view>
			</view>
			
			<view class="p3b2" @tap="toPath('/pages/share')">
				下载专属海报
			</view>
		</view>
	</view>
</template>

<script>
	import navBar from "@/components/nav-bar";
	import { mapState } from 'vuex';
	export default {
		components: {navBar},
		data() {
			return {
				info:null
			}
		},
		computed:{
			...mapState(['hasLogin','userInfo','config'])
		},
		async onPullDownRefresh() {
			uni.showLoading({
				title:"数据加载中..."
			})
			await this.getPromoteInfo();
			uni.stopPullDownRefresh();
			uni.hideLoading();
		},
		methods: {
			async getPromoteInfo(){
				let res = await this.$http({
					apiName:"getPromoteInfo",
				})
				try{
					this.info = res;
				}catch(e){}
			},
			toPath(path){
				uni.navigateTo({
					url:path
				})
			},
			withDraw(){
				if(this.info.isVip == 1){
					uni.navigateTo({
						url:"/pages/withdraw"
					})
				}else{
					uni.navigateTo({
						url:'/pages/join?showWd=1&vipAmount=' + this.info.vipAmount + '&vipMaskNum=' + this.info.vipMaskNum
					})
				}
			}
		},
		async onShow(){
			uni.showLoading({
				title:"数据加载中..."
			})
			await this.getPromoteInfo();
			uni.hideLoading();
		}
	}
</script>

<style lang="less">
	.pro{
		min-height: 100vh;
		background-color: #F3F4F5;
		.p1{
			.p1i{
				font-size: 0;
				.p1img{
					width: 100%;
					height: 312rpx;
				}
			}
			.p1i2{
				position: absolute;
				top: 164rpx;
				left: 0;
				width: 100%;
				padding-left: 32rpx;
				padding-right: 32rpx;
				display: flex;
				justify-content: space-between;
				box-sizing: border-box;
				.p1i2r1{
					display: flex;
					align-items: center;
					flex: 1;
					.p1i2r1img{
						width: 108rpx;
						height: 108rpx;
						border-radius: 50%;
						border: 2rpx solid #fff;
					}
					.p1i2r1b1{
						margin-left: 20rpx;
						color: #fff;
						flex: 1;
						.p1i2r1b1t1{
							font-size: 36rpx;
							text-align: left;
							text-overflow: ellipsis;
							overflow: hidden;
							white-space: nowrap;
							width: 400rpx;
						}
						.p1i2r1b1t2{
							margin-top: 10rpx;
							font-size: 26rpx;
						}
						.p1i2r1b1t3{
							padding-left: 0;
							padding-right: 16rpx;
							position: relative;
							margin-top: 10rpx;
							width: 180rpx;
							text-align: center;
							.p1i2r1b1t3img{
								width: 100%;
								height: auto;
							}
							.p1i2r1b1t3text{
								position: absolute;
								top: 0;
								left: 0;
								width: 100%;
								height: 100%;
								line-height: 48rpx;
								text-align: center;
								color: #B0620C;
								font-size: 26rpx;
							}
						}
					}
				}
				.p1i2r2{
					display: flex;
					align-self: flex-end;
					margin-bottom: 20rpx;
					display: flex;
					align-items: center;
					.p1i2r2img{
						width: 26rpx;
						height: auto;
					}
					.p1i2r2t{
						margin-left: 12rpx;
						color: #fff;
						font-size: 26rpx;
					}
				}
			}
		}
		.p2{
			background:linear-gradient(133deg,rgba(67,149,197,0.3) 0%,rgba(67,149,197,0.1) 100%);
			height: 80rpx;
			line-height: 80rpx;
			display: flex;
			align-items: center;
			padding-left: 32rpx;
			padding-right: 32rpx;
			.p2f{
				color: #4395c5;
				font-size: 30rpx;
			}
			.f1{
				color: #4395c5;
				font-size: 20rpx;
				margin-left: 10rpx;
			}
			.f2{
				color: #B2E9D6;
				font-size: 20rpx;
			}
		}
		.p3{
			padding: 32rpx;
			.p3b{
				background-color: #fff;
				border-radius: 12rpx;
				padding: 0 32rpx 28rpx;
				margin-bottom: 40rpx;
				.p2bt1{
					display: flex;
					align-items: center;
					justify-content: space-between;
					padding-top: 28rpx;
					padding-bottom: 28rpx;
					border-bottom: 2rpx solid #E9EBEF;
					.p2bt1m1{
						color: #303133;
						font-size: 30rpx;
					}
					.p2bt1m2{
						display: flex;
						align-items: center;
						.p2bt1m2y1{
							color: #4395c5;
							font-size: 24rpx;
						}
						.iconfont{
							color: #C0C4CC;
							font-size: 16rpx;
							margin-left: 16rpx;
						}
					}
					.p2bt1m3{
						line-height: 45rpx;
						border:2rpx solid #ED5D5D;
						border-radius: 27rpx;
						color: #ED5D5D;
						font-size: 24rpx;
						padding-left: 32rpx;
						padding-right: 32rpx;
					}
				}
				.p2bt2{
					padding-top: 42rpx;
					.p2bt2k1{
						display: flex;
						color: #303133;
						font-size: 48rpx;
						.p2bt2k1o1{
							width: 50%;
							justify-content: center;
							display: flex;
							align-items: center;
						}
						.p2bt2k1o2{
							display: flex;
							flex: 1;
							justify-content: center;
							align-items: center;
						}
						.te1{
							font-size: 28rpx;
							margin-right: 6rpx;
						}
					}
					.p2bt2k2{
						margin-top: 8rpx;
						display: flex;
						color: #909399;
						font-size: 28rpx;
						.p2bt2k2o1{
							width: 50%;
							text-align: center;
						}
						.p2bt2k2o2{
							flex: 1;
							text-align: center;
						}
					}
					.p2bt2k3{
						display: flex;
						justify-content: space-between;
						.p2bt2k3o1{
							width: 50%;
						}
						.p2bt2k3o2{
							flex: 1;
							text-align: center;
							color: #ED5D5D;
							font-size: 24rpx;
						}
					}
				}
			}
			.p3b2{
				margin-top: 20rpx;
				background:linear-gradient(133deg,#55bdf9 0%,#4395c5 100%);
				border-radius:40rpx;
				text-align: center;
				line-height: 88rpx;
				color: #fff;
				font-size: 32rpx;
			}
		}
	}
</style>
