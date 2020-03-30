<template>
	<view class="rbox">
		<view class="m2ib2">
			<view class="d1">
				<view class="d1t1">
					预约单号：{{orderInfo.orderSn}}
				</view>
				<view class="d1t2">
					<text v-if="orderInfo.status == -1">已取消</text>
					<text v-if="orderInfo.status == 0">预定中</text>
					<text v-if="orderInfo.status == 1">待支付</text>
					<text v-if="orderInfo.status == 2">已支付</text>
					<text v-if="orderInfo.status == 3">已发货</text>
				</view>
			</view>
			<view class="d2">
				<view class="d2r1">
					<view class="d2r2j1">
						下单时间：{{orderInfo.createTime}}
					</view>
					<view class="d2r2j2">
						数量：{{orderInfo.num}}片
					</view>
					<view class="d2r2j2">
						应付金额：¥{{orderInfo.amount}}
					</view>
				</view>
			</view>
		</view>
		<view class="rb1">
			<view class="rb1i">
				<view class="rb1i1">
					收件人
				</view>
				<view class="rb1i2">
					<input class="rb1i2in" placeholder-class type="text" v-model="receiverName" placeholder="请输入收货人姓名" />
				</view>
			</view>
			<view class="rb1i">
				<view class="rb1i1">
					手机号码
				</view>
				<view class="rb1i2 rb1i3">
					<input class="rb1i2in rb1i2inwBtn" placeholder-class type="text" v-model="receiverPhone" placeholder="请输入收货人手机号码" />
					<button class="rb1i2in2" open-type="getPhoneNumber" @getphonenumber="getPhoneNumber">获取手机号</button>
				</view>
			</view>
			<view class="rb1i">
				<view class="rb1i1">
					所在地区
				</view>
				<view class="rb1i2 rb1i3"  @tap="openAddres">
					<input class="rb1i2in" placeholder-class type="text" v-model="addr" placeholder="请选择收货地所在的省市区/乡镇" disabled/>
					<text class="iconfont iconwode-gengduoicon rb1i2in3"></text>
				</view>
			</view>
			<view class="rb1i">
				<view class="rb1i1">
					详细地址
				</view>
				<view class="rb1i2">
					<input class="rb1i2in" placeholder-class type="text" v-model="receiverDetailAddress" placeholder="填写所在街道/门牌号" />
				</view>
			</view>
		</view>
		<view class="rb2">
			<view class="rb2h" @tap="submit">
				保存
			</view>
		</view>
		<simple-address ref="simpleAddress" :pickerValueDefault="cityPickerValueDefault" @onConfirm="onConfirm" themeColor='#4395c5'></simple-address>
	</view>
</template>

<script>
	import simpleAddress from "@/components/simple-address/simple-address.nvue"
	import utils from '../utils/method.js'
	import provinceData from '../components/simple-address/city-data/province.js';
	import cityData from '../components/simple-address/city-data/city.js';
	import areaData from '../components/simple-address/city-data/area.js';
	export default{
		components: {
			simpleAddress
		},
		data(){
			return{
				from:"",
				
				orderId:"",
				orderInfo:null,
				
				receiverName :"",
				receiverPhone:"",
				receiverProvince:"",
				receiverCity:"",
				receiverRegion:"",
				receiverDetailAddress:"",
				addr:"",
				cityPickerValueDefault: [0, 0, 1],
				// submiting:false,
				pList:[],
			}
		},
		methods:{
			setAddr(){
				let _pindex = this.getIndex(this.receiverProvince,provinceData);
				let _cindex = this.getIndex(this.receiverCity,cityData[_pindex]);
				let _aindex = this.getIndex(this.receiverRegion,areaData[_pindex][_cindex]);
				this.cityPickerValueDefault = [_pindex,_cindex,_aindex];
			},
			getIndex(val,arr){
				let _index = arr.findIndex((item,index) => {
					return item.label == val
				})
				return _index
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
					this.setAddr()
				}catch(e){}
			},
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
			openAddres() {
				this.$refs.simpleAddress.open();
			},
			onConfirm(e) {
				this.addr = e.label.replace(/-/g,'');
				let _add = e.label.split('-')
				this.receiverCity = _add[1]
				this.receiverProvince = _add[0]
				this.receiverRegion = _add[2]
			},
			async submit(){
				// if(this.submiting){
				// 	return
				// }
				uni.showLoading({
					title:"保存中...",
					mask:true,
				})
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
					try{
						let _data = {
							orderId:this.orderId,
							receiverCity:this.receiverCity,
							receiverDetailAddress:this.receiverDetailAddress,
							receiverName:this.receiverName,
							receiverPhone:this.receiverPhone,
							receiverProvince:this.receiverProvince,
							receiverRegion:this.receiverRegion
						}
						let res = await this.$http({
							apiName:"editOrder",
							method:"POST",
							data:_data
						})
						uni.showToast({
							title: "保存成功",
							duration: 2000
						});
						let _self = this;
						setTimeout(()=>{
							if(_self.from == "mine"){
								uni.switchTab({
									url:"/pages/mine"
								})
							}else if(_self.from == "orderList"){
								uni.navigateTo({
									url:'/pages/orderList'
								})
							}else{
								uni.navigateBack()
							}
							uni.hideLoading()
						},2000)
						
					}catch(e){
						uni.hideLoading()
					}
				}
				
			}
		},
		async onLoad(opt){
			this.orderId = opt.id;
			this.from = opt.from;
			uni.showLoading({
				title:"数据加载中..."
			})
			await this.getInfo();
			uni.hideLoading();
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
					font-size: 30rpx;
				}
				.d1t2{
					color: #ED5D5D;
					font-size: 32rpx;
				}
			}
			.d2{
				padding-top: 10rpx;
				padding-bottom: 14rpx;
				
				.d2r1{
					color: #606266;
					font-size: 30rpx;
					line-height: 40rpx;
				}
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
			position: fixed;
			bottom: 32rpx;
			left: 0;
			padding-left: 32rpx;
			padding-right: 32rpx;
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
