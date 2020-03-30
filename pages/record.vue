<template>
	<view class="rc">
		<view class="rcList" v-if="data_list.length > 0">
			<view class="rcItem rcItem1">
				<view class="rce">
					用户
				</view>
				<view class="rce">
					预订时间
				</view>
				<view class="rce">
					预订数量
				</view>
				<view class="rce">
					订单状态
				</view>
			</view>
			<view class="rcItem rcItem2" v-for="(item,index) in data_list" :key="index">
				<view class="rce">
					<image class="rceIcon" :src="item.avatarUrl" mode=""></image>
					<view class="rceName">
						{{item.nickName}}
					</view>
				</view>
				<view class="rce">
					{{item.createTime.split(" ")[0]}}
				</view>
				<view class="rce">
					{{item.num}}片
				</view>
				<view class="rce">
					<text v-if="item.orderStatus == -1">已取消</text>
					<text v-if="item.orderStatus == 0">预定中</text>
					<text v-if="item.orderStatus == 1">待支付</text>
					<text v-if="item.orderStatus == 2">已支付</text>
					<text v-if="item.orderStatus == 3">已发货</text>
				</view>
			</view>
			<view class="rcMore" @tap="getMore" v-if="hasMore">
				<view class="rcm1">
					加载更多
				</view>
				<image class="rcm1img" src="../static/img/down.png" mode="widthFix"></image>
			</view>
		</view>
		<view class="olcEmpty" v-else>
			<image src="../static/img/nodata.png" class="oe1" mode="widthFix"></image>
			<view class="oe2">- 你还没有这类信息哦 -</view>
		</view>
	</view>
</template>

<script>
	export default{
		data(){
			return{
				page:1,
				hasMore:true,
				data_list:[]
			}
			
		},
		methods:{
			getMore(){
				this.page ++;
				this.getList()
			},
			async getList(){
				let res = await this.$http({
					apiName:"referList",
					data:{
						page:this.page,
					}
				})
				try{
					this.data_list = this.data_list.concat(res.list);
					this.hasMore = res.hasNextPage
				}catch(e){}
			},
		},
		async onPullDownRefresh() {
			uni.showLoading({
				title:"数据加载中..."
			})
			this.page = 1;
			this.data_list = [];
			await this.getList()
			uni.stopPullDownRefresh();
			uni.hideLoading();
		},
	 	async onLoad() {
			uni.showLoading({
				title:"数据加载中..."
			})
			await this.getList()
			uni.hideLoading();
		}
	}
</script>

<style lang="scss">
	.rc{
		min-height: 100vh;
		background-color: #F3F4F5;
		padding: 32rpx;
		box-sizing: border-box;
		.olcEmpty{
			text-align: center;
			padding-top: 176rpx;
			.oe1{
				width: 220rpx;
				height: auto;
			}
			.oe2{
				color: #C0C4CC;
				font-size: 28rpx;
				margin-top: 40rpx;
			}
		}
		.rcList{
			border-radius: 12rpx;
			overflow: hidden;
			.rcItem{
				display: flex;
				height: 100rpx;
				align-items: stretch;
				justify-content: space-between;
				line-height: 100rpx;
				color: #fff;
				.rce{
					width: 25%;
					text-align: center;
					font-size: 30rpx;
					border-right: 2rpx solid #fff;
					box-sizing: border-box;
					.rceIcon{
						width: 40rpx;
						height: 40rpx;
						border-radius: 50%;
						margin-bottom: 10rpx;
					}
				}
				.rce:last-child{
					border-right: none;
				}
			}
			.rcItem1{
				background-color: #4395c5;
			}
			.rcItem2{
				color: #606266;
				.rce{
					font-size: 28rpx;
					position: relative;
					.rceName{
						font-size: 26rpx;
						height: 36rpx;
						line-height: 36rpx;
						position: absolute;
						bottom: 10rpx;
						width: 100%;
						text-align: center;
						text-overflow: ellipsis;
						overflow: hidden;
						white-space: nowrap;
					}
				}
			}
			.rcItem2:nth-child(even){
				background-color: #fff;
			}
			.rcItem2:nth-child(odd){
				background-color: #EDFCF7;
			}
			.rcMore{
				background-color: #fff;
				display: flex;
				justify-content: center;
				align-items: center;
				color: #4395c5;
				font-size: 30rpx;
				line-height: 90rpx;
				.rcm1img{
					width: 28rpx;
					height: auto;
					margin-left: 10rpx;
				}
			}
		}
	}
</style>
