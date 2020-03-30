<template>
	<view class="ol">
		<view class="olt">
			<view @tap="changeTab(index)" :class="{active:activeTab == index}" v-for="(item,index) in tabs" :key="index">
				<view class="oltext">
					{{item}}
				</view>
				<view class="oltLine"></view>
			</view>
		</view>
		<view class="olc" v-if="data_list.length > 0">
			<view class="olci" v-for="(item,index) in data_list" :key="index">
				<view class="d1">
					<view class="d1t1">
						预约单号：{{item.orderSn}}
					</view>
					<view class="d1t2">
						<text v-if="item.status == -1">已取消</text>
						<text v-if="item.status == 0">预定中</text>
						<text v-if="item.status == 1">待支付</text>
						<text v-if="item.status == 2">已支付</text>
						<text v-if="item.status == 3">已发货</text>
					</view>
				</view>
				<view class="d2">
					<view class="d2r1">
						<view class="d2r2j1">
							下单时间：{{item.createTime}}
						</view>
						<view class="d2r2j2">
							数量：{{item.num}}片
						</view>
					</view>
					<view class="d2r2">
						<image class="d2r2f1" src="../static/img/m5.png"></image>
						<view class="d2r2f2">{{item.receiverName}}</view>
						<view class="d2r2f3">{{item.receiverPhone}}</view>
					</view>
					<view class="d2r3">
						{{item.receiverProvince}}{{item.receiverCity}}{{item.receiverRegion}}{{item.receiverDetailAddress}}
					</view>
				</view>
				<view class="d3">
					<view class="d3r1"  v-if="item.orderType == 1">
						VIP推广领取
					</view>
					<view class="d3r1" v-else>
						<text v-if="item.status == 2 || item.status == 3">已支付：¥{{item.amount}}</text>
						<text v-else>待支付：¥{{item.amount}}</text>
					</view>
					<view class="d3r2">
						<view class="d3r2b1" v-if="item.status == 0" @tap="cancelOrder(item.id)">
							取消
						</view>
						<view class="d3r2b2" v-if="item.status == 0 || item.status == 1" @tap="toPath('/pages/editaddr?id=' + item.id + '&from=orderList')">
							修改地址
						</view>
						<view class="d3r2b3" v-if="item.status == 1" @tap="pay(item.id)">
							去支付
						</view>
						<view class="" v-if="item.orderType != 1">
							<view class="d3r2b2" v-if="item.status == -1 || item.status == 3" @tap="toPath('/pages/detail?id=' + item.productId)">
								再次预定
							</view>
						</view>
					</view>
				</view>
				<view class="d4" v-if="item.status == -1">
					<text v-if="item.cancelType == 1">用户取消</text>
					<text v-else-if="item.cancelType == 2">超过{{config.BIZ_ORDER_OVER_TIME}}小时未支付自动取消</text>
					<text v-else>管理员取消</text>
				</view>
				<view class="d4 d5" v-if="item.status == 2 && item.preDeliveryTime">
					预计{{item.preDeliveryTime}}前发货
				</view>
				<view class="d4" v-if="item.status == 3" @tap="copy(item.deliverySn)">
					{{item.deliveryCompany}}：
					<text v-if="item.deliverySn">{{item.deliverySn}}</text>
					<text v-else>单号数据同步中</text>
					<image class="rb2h2t3" src="../static/img/copy.png" mode="widthFix"></image>
				</view>
			</view>
			<view class="olcim" v-if="hasMore" @tap="getMore">
				<view class="rcm1">
					加载更多
				</view>
				<image class="rcm1img" src="../static/img/down.png" mode="widthFix"></image>
			</view>
		</view>
		<view class="olc" v-else>
			<view class="olcEmpty">
				<image src="../static/img/nodata.png" class="oe1" mode="widthFix"></image>
				<view class="oe2">- 你还没有这类信息哦 -</view>
			</view>
		</view>
	</view>
</template>

<script>
	import { mapState } from 'vuex';
	export default{
		data(){
			return{
				activeTab:0,
				status:"",
				page:1,
				size:10,
				hasMore:true,
				tabs:["全部","预定中","待支付","已支付","已发货","已取消"],
				data_list:[]
			}
		},
		computed:{
			...mapState(['config'])
		},
		methods:{
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
								that.changeTab(3)
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
			changeTab(tab){
				if(this.activeTab == tab){
					return
				}else{
					this.activeTab = tab;
					this.hasMore = true;
					this.data_list = [];
					this.page = 1;
					if(tab == 0){this.status = ""}
					if(tab == 1){this.status = 0}
					if(tab == 2){this.status = 1}
					if(tab == 3){this.status = 2}
					if(tab == 4){this.status = 3}
					if(tab == 5){this.status = -1}
					this.getList()
				}
			},
			async getList(){
				let res = await this.$http({
					apiName:"orderList",
					data:{
						page:this.page,
						size:this.size,
						status:this.status
					}
				})
				try{
					this.data_list = this.data_list.concat(res.list);
					this.hasMore = res.hasNextPage
				}catch(e){}
			},
			getMore(){
				this.page ++;
				this.getList()
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
				await this.$http({
					 apiName:"cancelOrder",
					 method:"POST",
					 data:{orderId:orderId}
				}).then(()=>{
					uni.showToast({
						title: "订单已取消",
						duration: 1500
					})
					setTimeout(_=>{
						_self.hasMore = true;
						_self.data_list = [];
						_self.page = 1;
						_self.getList()
					},1500)
				}).catch(e=>{console.log()})
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
			toPath(path){
				uni.navigateTo({
					url:path
				})
			},
		},
		async onPullDownRefresh() {
			uni.showLoading({
				title:"数据加载中..."
			})
			this.hasMore = true;
			this.data_list = [];
			this.page = 1;
			await this.getList();
			uni.stopPullDownRefresh();
			uni.hideLoading();
		},
		async onShow() {
			this.hasMore = true;
			this.data_list = [];
			this.page = 1;
			uni.showLoading({
				title:"数据加载中..."
			})
			await this.getList();
			uni.hideLoading();
		}
	}
</script>

<style lang="less">
	.ol{
		min-height: calc(100vh - 88rpx);
		background-color: #F3F4F5;
		.olt{
			position: fixed;
			width: 100%;
			top: 0;
			left: 0;
			background-color: #fff;
			height: 88rpx;
			padding-left: 32rpx;
			padding-right: 32rpx;
			font-size: 26rpx;
			color: #303133;
			display: flex;
			justify-content: space-between;
			padding-top: 26rpx;
			box-sizing: border-box;
			.active{
				color: #4395c5;
				.oltLine{
					background-color: #4395c5;
				}
			}
			.oltLine{
				margin: auto;
				margin-top: 10rpx;
				width: 20rpx;
				height: 4rpx;
				background-color: #fff;
				border-radius: 2rpx;
			}
		}
		.olc{
			margin-top: 88rpx;
			padding: 20rpx 32rpx;
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
			.olcim{
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
			.olci{
				margin-bottom: 40rpx;
				padding: 20rpx 24rpx;
				background-color: #fff;
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
	}
</style>
