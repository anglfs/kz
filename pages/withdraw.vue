<template>
	<view class="rbox">
		<view class="m2ib2">
			您现在是普通推广大使，推广总获取的收益为：<text class="m2ib2t">¥{{info.totalProfit}}</text>，可提现收益为：<text class="m2ib2t">¥{{info.EnableProfit}}</text>，冻结收益：<text class="m2ib2t">¥{{info.freezeProfit}}</text>。
		</view>
		<view class="rb1">
			<view class="rb1i">
				<view class="rb1i1">
					提现金额(元)
				</view>
				<view class="rb1i2">
					<input class="rb1i2in" placeholder-class type="text" v-model="amount" placeholder="请输入提现金额" />
				</view>
			</view>
			<view class="rb1i">
				<view class="rb1i1">
					支付宝账号
				</view>
				<view class="rb1i2">
					<input class="rb1i2in" placeholder-class type="text" v-model="zfbAccount" placeholder="请填写支付宝账号，如：list@163.cor" />
				</view>
			</view>
			<view class="rb1i">
				<view class="rb1i1">
					支付宝姓名
				</view>
				<view class="rb1i2">
					<input class="rb1i2in" placeholder-class type="text" v-model="zfbName" placeholder="请填写支付宝账号姓名，如：李四" />
				</view>
			</view>
			<view class="rb1i">
				<view class="rb1i1">
					手机号码
				</view>
				<view class="rb1i2 rb1i3">
					<input class="rb1i2in" placeholder-class type="text" v-model="phoneNumber" placeholder="请填写手机号" />
					<!-- <view class="rb1i2in2">
						获取手机号
					</view> -->
				</view>
			</view>
		</view>
		<view class="rb2">
			<view class="rb2h" @tap="withDraw">
				提交申请
			</view>
		</view>
	</view>
</template>

<script>
	import utils from '../utils/method.js'
	export default{
		data(){
			return{
				amount:"",
				phoneNumber:"",
				zfbAccount:"",
				zfbName:"",
				info:null,
			}
		},
		methods:{
			async withDraw(){
				let _data = [
					{
						data:this.amount.trim(),
						info:'提现金额不能为空'
					},
					{
						data:isNaN(this.amount.trim()) ? "" : 1,
						info:'提现金额格式不正确'
					},
					{
						data:this.amount.trim() > this.info.EnableProfit ? "" : 1,
						info:'可提现金额不足'
					},
					{
						data:this.zfbAccount.trim(),
						info:'支付宝账号不能为空'
					},
					{
						data:this.zfbName.trim(),
						info:'支付宝姓名不能为空'
					},
					{
						data:this.phoneNumber.trim(),
						info:'手机号不能为空'
					},
					{
						data:/^[1][3,4,5,7,8][0-9]{9}$/.test(this.phoneNumber.trim()) ? "1" : "",
						info:'手机号格式不正确'
					},
				]
				let jres = await utils.judgeData(_data);
				if(jres){
					await this.$http({
						apiName:"withdraw",
						method:"POST",
						data:{
							amount:this.amount,
							phoneNumber:this.phoneNumber,
							zfbAccount:this.zfbAccount,
							zfbName:this.zfbName,
						}
					}).then(res => {
						uni.showModal({
						    title: '提示',
						    content: '提现申请提交成功，请注意短信通知',
							showCancel:false,
						    success: function (res) {
						        if (res.confirm) {
						            uni.navigateBack({
						            	delta:2,
						            })
						        }
						    }
						});
						
					}).catch(e=>{})
				}
				
			},
			async getPromoteInfo(){
				let res = await this.$http({
					apiName:"getPromoteInfo",
				})
				try{
					this.info = res;
				}catch(e){}
			},
		},
		async onLoad() {
			uni.showLoading({
				title:"数据加载中..."
			})
			await this.getPromoteInfo();
			uni.hideLoading()
		}
	}
</script>

<style lang="less" scoped>
	.rbox{
		min-height: 100vh;
		padding: 32rpx;
		padding-bottom: 100rpx;
		background-color: #fff;
		padding-top: 20rpx;
		box-sizing: border-box;
		.m2ib2{
			color: #909399;
			font-size: 30rpx;
			.m2ib2t{
				color: #ED5D5D;
			}
		}
		.rb1{
			.rb1i{
				padding-top: 30rpx;
				.rb1i1{
					color: #303133;
					font-size: 40rpx;
				}
				.rb1i2{
					.rb1i2in{
						font-size: 32rpx;
						color: #303133;
						height: 80rpx;
						line-height: 80rpx;
						border-bottom: 2rpx solid #EAECF0;
					}
					.input-placeholder{
						color: #C0C4CC;
					}
				}
				.rb1i3{
					position: relative;
					.rb1i2in2{
						position: absolute;
						right: 0;
						bottom: 26rpx;
						color: #4395c5;
						border: 2rpx solid #4395c5;
						border-radius: 6rpx;
						padding-left: 12rpx;
						padding-right: 12rpx;
						font-size: 26rpx;
					}
					.rb1i2in3{
						position: absolute;
						right: 0;
						bottom: 26rpx;
						color: #606266;
						font-size: 24rpx;
					}
				}
				.rb1i4{
					margin-top: 26rpx;
					display: flex;
					align-items: flex-end;
					.rb1i4t1{
						/deep/ .uni-numbox{
							border: 2rpx solid #DBE0E8;
							border-radius: 8rpx;
							height: 56rpx;
							.uni-numbox__minus,
							.uni-numbox__plus{
								background: none;
								border: none;
								width: 80rpx;
								height: 56rpx;
								.uni-numtext{
									height: 56rpx;
									line-height: 40rpx;
									font-size: 40rpx;
								}
							}
							.uni-numbox__value{
								border: none;
								height: 56rpx;
								line-height: 56rpx;
								color: #303133;
								font-size: 28rpx;
								border-left: 2rpx solid #D8D8D8;
								border-right: 2rpx solid #D8D8D8;
							}
						}
					}
					.rb1i4t2{
						margin-left: 40rpx;
						color: #ED5D5D;
						font-size: 32rpx;
					}
				}
			}
		}
		.rb2{
			margin-top: 80rpx;
			box-sizing: border-box;
			width: 100%;
			.rb2h{
				height:88rpx;
				background:linear-gradient(133deg,#55bdf9 0%,#4395c5 100%);
				border-radius:40rpx;
				width: 100%;
				text-align: center;
				line-height: 88rpx;
				color: #fff;
				font-size: 32rpx;
				border-radius: 40rpx;
				width: 100%;
			}
		}
	}
</style>
