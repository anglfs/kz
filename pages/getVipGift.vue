<template>
	<view class="rbox">
		<view class="m2ib2">
			您于{{vipTime || 0}}支付推广费{{vipAmount || 0}}元成为VIP推广大使，可优先领用{{vipMaskNum || 0}}片一次性民用口罩，请完善收件信息，以方面我们安排快递：
		</view>
		<view class="rb1">
			<view class="rb1i">
				<view class="rb1i1">
					收件人
				</view>
				<view class="rb1i2">
					<input class="rb1i2in" placeholder-class type="text" v-model="receiverName" placeholder="请输入收货人姓名" :disabled="status == 2 || status == 3"/>
				</view>
			</view>
			<view class="rb1i">
				<view class="rb1i1">
					手机号码
				</view>
				<view class="rb1i2 rb1i3">
					<input class="rb1i2in rb1i2inwBtn" placeholder-class type="text" v-model="receiverPhone" placeholder="请输入收货人手机号码" :disabled="status == 2 || status == 3" />
					<button class="rb1i2in2" v-if="status != 2 && status != 3" open-type="getPhoneNumber" @getphonenumber="getPhoneNumber">获取手机号</button>
				</view>
			</view>
			<view class="rb1i">
				<view class="rb1i1">
					所在地区
				</view>
				<view class="rb1i2 rb1i3"  @tap="openAddres">
					<input class="rb1i2in rb1i2inwBtn" placeholder-class type="text" v-model="addr" placeholder="请选择收货地所在的省市区/乡镇" disabled />
					<text class="iconfont iconwode-gengduoicon rb1i2in3"></text>
				</view>
			</view>
			<view class="rb1i">
				<view class="rb1i1">
					详细地址
				</view>
				<view class="rb1i2">
					<input class="rb1i2in" placeholder-class type="text" v-model="receiverDetailAddress" placeholder="填写所在街道/门牌号"  :disabled="status == 2 || status == 3"/>
				</view>
			</view>
		</view>
		<view class="rb2" v-if="orderId">
			<view class="" v-if="status == 2 || status == 3">
				<view class="rb2h rb2h1">
					保存并领取
				</view>
				<view class="rb2h2" @tap="copy">
					<text class="rb2h2t1">已发货，{{deliveryCompany}}：</text>
					<text class="rb2h2t2">{{deliverySn}}</text>
					<image class="rb2h2t3" src="../static/img/copy.png" mode="widthFix"></image>
				</view>
			</view>
			<view class="rb2h" v-else @tap="submit">
				修改地址
			</view>
		</view>
		<view class="rb2" v-else>
			<view class="rb2h" @tap="submit">
				保存并领取
			</view>
		</view>
		<simple-address ref="simpleAddress" :pickerValueDefault="cityPickerValueDefault" @onConfirm="onConfirm" themeColor='#4395c5'></simple-address>
	</view>
</template>

<script>
	import simpleAddress from "@/components/simple-address/simple-address.nvue"
	import utils from '../utils/method.js'
	export default{
		components: {
			simpleAddress
		},
		data(){
			return{
				receiverName :"",
				receiverPhone:"",
				receiverProvince:"",
				receiverCity:"",
				receiverRegion:"",
				receiverDetailAddress:"",
				addr:"",
				cityPickerValueDefault: [0, 0, 1],
				vipTime:"",  //成为vip时间
				vipAmount:"",
				vipMaskNum:"",
				orderId:"",  //已领取的订单id，没有则为空
				deliveryCompany:"",
				deliverySn:"",
				status:"",
			}
		},
		methods:{
			async getPhoneNumber (e) {
				let _self = this;
				if(e.detail.encryptedData){
					await _self.$http({
						apiName:"getPhone",
						method:"POST",
						data:{
							encryptedData: e.detail.encryptedData,
							iv: e.detail.iv
						}
					}).then(res => {
						this.receiverPhone = res;
					}).catch(e => {})
				}
				
			 },
			copy(data){
				let _self = this
				uni.setClipboardData({
					data: _self.deliverySn,
					success() {
						uni.showToast({
							title: "复制成功",
						})
					}
				});
			},
			openAddres() {
				if(this.status == 2 || this.status == 3){
					return
				}else{
					this.$refs.simpleAddress.open();
				}
			},
			onConfirm(e) {
				this.addr = e.label;
				let _add = e.label.split('-')
				this.receiverCity = _add[1]
				this.receiverProvince = _add[0]
				this.receiverRegion = _add[2]
			},
			async getInfo(){
				let res = await this.$http({
					apiName:"orderInfo",
					data:{
						orderId:this.orderId
					}
				});
				try{
					this.orderInfo = res;
					this.receiverName = res.receiverName;
					this.receiverPhone= res.receiverPhone;
					this.receiverProvince= res.receiverProvince;
					this.receiverCity= res.receiverCity;
					this.receiverRegion= res.receiverRegion;
					this.receiverDetailAddress= res.receiverDetailAddress;
					this.addr = this.receiverProvince + this.receiverCity + this.receiverRegion;
					this.status = res.status;
					this.deliveryCompany = res.deliveryCompany;
					this.deliverySn = res.deliverySn;
				}catch(e){}
			},
			async getTmplID() {
				let _self = this;
				uni.requestSubscribeMessage({
					tmplIds: _self.config.wxTemplateId,
					success(res) {
						 console.log(res)
						 // if (res['模板ID'] === 'accept') {
						 //   console.log('用户同意了')
						 // }
						 // _self.submit()
					},
				   fail(err) {
					 console.error(err);
				   },
				   complete(){
					  _self.submit()
				   }
				 })
			},
			async submit(){
				let _data = [
					{
						data:this.receiverName.trim(),
						info:'收货人姓名不能为空'
					},
					{
						data:this.receiverPhone.trim(),
						info:'手机号不能为空'
					},
					{
						data:/^[1][3,4,5,7,8][0-9]{9}$/.test(this.receiverPhone.trim()) ? "1" : "",
						info:'手机号格式不正确'
					},
					{
						data:this.addr,
						info:'所在地区不能为空'
					},
					{
						data:this.receiverDetailAddress.trim(),
						info:'详细地址不能为空'
					}
				]
				let jres = await utils.judgeData(_data);
				if(jres){
					
					let _data = {
						receiverCity:this.receiverCity,
						receiverDetailAddress:this.receiverDetailAddress,
						receiverName:this.receiverName,
						receiverPhone:this.receiverPhone,
						receiverProvince:this.receiverProvince,
						receiverRegion:this.receiverRegion
					}
					let _api = "vipGift"
					if(this.orderId){
						_api = "editOrder";
						_data["orderId"] = this.orderId;
					}
					try{
						let res = await this.$http({
							apiName:_api,
							method:"POST",
							data:_data
						})
						if(this.orderId){
							uni.showModal({
							    title: '提示',
							    content: '修改成功！',
								showCancel:false,
							    success: function (res) {
							        if (res.confirm) {
							            uni.navigateBack()
							        }
							    }
							});
						}else{
							uni.showModal({
							    title: '提示',
							    content: '提交成功，请等待发货通知。',
								showCancel:false,
							    success: function (res) {
							        if (res.confirm) {
							            uni.navigateBack()
							        }
							    }
							});
						}
					}catch(e){}
				}
				
			}
		},
		async onLoad(opt) {
			this.vipTime = opt.vipTime;
			this.orderId = opt.orderId;
			this.vipAmount = opt.vipAmount;
			this.vipMaskNum = opt.vipMaskNum;
			if(this.orderId){
				await this.getInfo()
			}
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
			font-size: 28rpx;
		}
		.rb1{
			.rb1i{
				padding-top: 30rpx;
				.rb1i1{
					color: #303133;
					font-size: 32rpx;
				}
				.rb1i2{
					.rb1i2in{
						font-size: 26rpx;
						color: #303133;
						height: 80rpx;
						line-height: 80rpx;
						border-bottom: 2rpx solid #EAECF0;
					}
					.rb1i2inwBtn{
						padding-right: 200rpx;
						box-sizing: border-box;
					}
					.input-placeholder{
						color: #C0C4CC;
					}
				}
				.rb1i3{
					position: relative;
					z-index: 1;
					.rb1i2in2{
						padding: 0;
						background: none;
						position: absolute;
						right: 0;
						bottom: 26rpx;
						color: #4395c5;
						border: 2rpx solid #4395c5;
						border-radius: 6rpx;
						padding-left: 12rpx;
						padding-right: 12rpx;
						font-size: 26rpx;
						z-index: 2;
						line-height: 40rpx;
					}
					.rb1i2in2::after{
						border: none;
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
			.rb2h1{
				background:rgba(192,196,204,1);
				color: #fff;
				border: none;
			}
			.rb2h2{
				color: #909399;
				font-size: 26rpx;
				display: flex;
				align-items: center;
				justify-content: center;
				margin-top: 32rpx;
				.rb2h2t2{
					color: #ED5D5D;
				}
				.rb2h2t3{
					margin-left: 10rpx;
					width: 30rpx;
					height: auto;
				}
			}
		}
	}
</style>
