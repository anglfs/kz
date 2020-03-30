<template>
	<view class="rbox">
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
			<view class="rb1i">
				<view class="rb1i1">
					预定数量
				</view>
				<view class="rb1i4">
					<view class="rb1i4t1">
						<uni-number-box :step="1" :min="config.BIZ_ORDER_MIN_NUM" :max="config.BIZ_ORDER_MAX_NUM" @change="bindChange" :value="num"></uni-number-box>
					</view>
					<view class="rb1i4t2">
						预计支付¥{{price}}
					</view>
				</view>
			</view>
		</view>
		<view class="rb2">
			<view class="rb2h" @tap="getTmplID" v-if="buyType == 0">
				提交预约
			</view>
			<view class="rb2h" @tap="getTmplID" v-if="buyType == 1">
				提交购买
			</view>
		</view>
		<simple-address ref="simpleAddress" :pickerValueDefault="cityPickerValueDefault" @onConfirm="onConfirm" themeColor='#4395c5'></simple-address>
	</view>
</template>

<script>
	import simpleAddress from "@/components/simple-address/simple-address.nvue"
	import uniNumberBox from "@/components/uni-number-box/uni-number-box.vue"
	import utils from '../utils/method.js'
	import { mapState } from 'vuex';
	export default{
		components: {
			simpleAddress,
			uniNumberBox
		},
		data(){
			return{
				productId:"",
				info:null,
				receiverName :"",
				receiverPhone:"",
				receiverProvince:"",
				receiverCity:"",
				receiverRegion:"",
				receiverDetailAddress:"",
				addr:"",
				price:"",
				num:"",
				cityPickerValueDefault: [0, 0, 1],
				// submiting:false,
				buyType:0,  //购买类型，0预约，1购买
			}
		},
		computed:{
			...mapState(['config'])
		},
		methods:{
			async getInfo(){
				let res = await this.$http({
					apiName:"productDetail",
					data:{
						productId:this.productId
					}
				}) 
				try{
					this.info = res;
					this.price = (this.info.promotionPrice * this.num).toFixed(2)
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
			dealPrice(num){
				let _level = 99999999;
				let _minX = _level;
				let _key = "";
				for(let key in this.config.BIZ_PRICE_LADDER){
					let _xPrice = num - key;
					if(_xPrice >= 0 && _xPrice < _minX){
						_minX = _xPrice;
						_key = key
					}
				}
				if(_minX < _level){
					return this.config.BIZ_PRICE_LADDER[_key]
				}else{
					return this.info.promotionPrice;
				}
			},
			bindChange(e){
				if(!isNaN(e) && this.info){
					this.num = e;
					let _price = this.dealPrice(this.num)
					if(this.info){
						if(Number(this.num) > Number(this.config.BIZ_ORDER_MAX_NUM)){
							this.price = (_price * this.config.BIZ_ORDER_MAX_NUM).toFixed(2)
						}else{
							this.price = (_price * this.num).toFixed(2)
						}
						
					}else{
						this.price = this.num
					}
					
				}
			},
			async getTmplID() {
				// if(this.submiting){
				// 	return
				// }
				uni.showLoading({
					title:"提交中...",
					mask:true,
				})
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
					  _self.submit();
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
					},
					{
						data:(this.num < Number(this.config.BIZ_ORDER_MIN_NUM)) ? "" : "1",
						info:`${this.config.BIZ_ORDER_MIN_NUM}片起订`
					},
					{
						data:(this.num > Number(this.config.BIZ_ORDER_MAX_NUM)) ? "" : "1",
						info:`起订最多不能超过${this.config.BIZ_ORDER_MIN_NUM}片`
					}
				]
				
				let jres = await utils.judgeData(_data);
				if(jres){
					try{
						// this.submiting = false;
						let _data = {
							num:this.num,
							productId:this.productId,
							receiverCity:this.receiverCity,
							receiverDetailAddress:this.receiverDetailAddress,
							receiverName:this.receiverName,
							receiverPhone:this.receiverPhone,
							receiverProvince:this.receiverProvince,
							receiverRegion:this.receiverRegion
						}
						let res = await this.$http({
							apiName:"makeOrder",
							method:"POST",
							data:_data
						})
						let resn = res.orderSn;
						let orderId = res.id
						if(this.buyType == 0){
							uni.navigateTo({
								url:'/pages/reserveok?&buyType=0&resn=' + resn + '&productId=' + this.productId
							})
						}else if(this.buyType == 1){
							this.pay(orderId,resn)
						}
						uni.hideLoading()
					}catch(e){
						// this.submiting = false;
						uni.hideLoading();
					}
				}else{
					// uni.hideLoading()
				}
				
				
			},
			async pay(orderId,resn){
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
								uni.navigateTo({
									url:`/pages/reserveok?resn=${resn}&productId=${that.productId}&buyType=1`
								})
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
			async getConfig(){
				let res = await this.$http({
					apiName:"config"
				})
				try{
					var _prices = [];
					for(let key in res.BIZ_PRICE_LADDER){
						_prices.push(res.BIZ_PRICE_LADDER[key])
					}
					this.maxPrice = Math.max(..._prices);
					res["maxPrice"] = this.maxPrice;
					this.$store.commit('setConfig',res)
				}catch(e){}
			},
		},
		async onLoad(opt) {
			this.buyType = opt.buyType;
			this.productId = opt.id;
			this.num = this.config.BIZ_ORDER_MIN_NUM;
			uni.showLoading({
				title:"数据加载中..."
			})
			await this.getInfo();
			await this.getConfig();
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
		padding-top: 0;
		box-sizing: border-box;
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
								width: 200rpx;
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
