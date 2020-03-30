<template>
	<view class="detail">
	   <navBar :showBack="true" backColor="#303133" />
	   <view class="b1">
		 <view class="" v-if="info.picUrl1">
		 	<swiper v-if="info.banners.length > 1" class="swiper" :autoplay="true" indicator-dots indicator-active-color="rgba(255, 255, 255, .7)">
		 		<swiper-item class="swiper-item" v-for="(item,index) in info.banners" :key="index">
					<image class="sbgk" :src="item"></image>
		 		</swiper-item>
		 	</swiper>
			<view class="" v-else>
				<image mode="widthFix" class="bgk" :src="info.banners[0]"></image>
			</view>
		 </view>
		 <view class="bgk2" v-else>
		 	图片加载中...
		 </view>
	   </view>
	   <view class="b2">
			<view class="b2d1">
				<view class="b2d1p1">
					¥{{config.maxPrice}}/片
				</view>
				<view class="b2d1p2">
					已订购
					<view class="b2d1p2t">
						{{info.reserveNum || 0}}
					</view>
					片
				</view>
			</view>
			<view class="b2d2">
				{{info.title || ""}}
			</view>
			<view class="b2d3" v-if="info">
				<view class="b2d3i1" v-if="info.buyUserNum < 11">
					<image class="b2d3i1img" v-for="item in info.buyUserNum" :key="item" :src="'../static/img/pics/' + item + '.jpeg'" mode=""></image>
				</view>
				<view class="b2d3i1" v-else>
					<image class="b2d3i1img" v-for="item in 10" :key="item" :src="'../static/img/pics/' + item + '.jpeg'" mode=""></image>
					<image class="b2d3i1img b2d3i1img2" src="../static/img/slh.png" mode=""></image>
				</view>
				<view class="b2d3i2">
					{{info.buyUserNum || 0}}人已订购
				</view>
			</view>
	   </view>
	   <view class="b3">
			<view class="b3t1">
				—商品详情—
			</view>
			<rich-text :nodes="info.descriptionHtml"></rich-text>
	   </view>
	   <view class="b4">
			<button class="b4r1 sharebtn" open-type="contact" @contact="handleContact">
				<text class="iconfont iconxiangqingye-kefuicon"></text>
				<view class="b4r1tetxt">
					客服
				</view>
			</button>
			<button class="b4r1 sharebtn" open-type="share" @ShareAppMessage="onShareAppMessage ">
				<text class="iconfont iconxiangqingye-fenxiangicon"></text>
				<view class="b4r1tetxt">
					分享
				</view>
			</button>
			<view class="b4r1b2 b4r1b" @tap="submit">
				<view class="b4r1btext">
					¥{{config.maxPrice}}/片
				</view>
				<view class="b4r1btext">
					立即预约订购
				</view>
			</view>
	   </view>
	   <neil-modal
	       :auto-close="false"
	       :show="showModal" 
	       :title="modalTitle" 
	       :content="modalCont"
			@confirm="bindBtn('confirm')"
	       :show-cancel="false">
	   </neil-modal>
	</view>
</template>

<script>
	import navBar from "@/components/nav-bar";
	import { mapState } from 'vuex';
	import utils from '../utils/method.js'
	export default {
		components: {navBar},
		data() {
			return {
				showModal:false,
				modalTitle:"",
				modalCont:"",
				productId:"",
				info:null,
				buyType:0,  //购买类型，0预约，1购买
			}
		},
		computed:{
			...mapState(['hasLogin','config','shareImg','myInviteCode'])
		},
		methods:{
			bindBtn(e){
				if(e == 'confirm'){
					this.showModal = false;
					uni.navigateTo({
						url:`/pages/reserve?id=${this.productId}&buyType=${this.buyType}`
					})
				}
			},
			async getInfo(){
				try{
					let res = await this.$http({
						apiName:"productDetail",
						data:{
							productId:this.productId
						}
					})
					this.info = res;
					this.info["descriptionHtml"] = this.info["descriptionHtml"].replace(/\<img/gi, '<img class="html_img" ');
					this.info["banners"] = [this.info.picUrl1,this.info.picUrl2,this.info.picUrl3,this.info.picUrl4];
					let _banners = this.info.banners.filter(function (s) {
					    return s && s.trim();
					});
					this.info.banners = _banners;
					this.buyType = this.info.productType
				}catch(e){
					if(e.data.code == 400000){
						uni.showToast({
							icon: 'none',
							title: e.data.message,
							duration: 2000
						});
					}
					setTimeout(()=>{
						uni.navigateBack()
					},2000)
				}
			},
			onShareAppMessage (){
				return {
				  title: this.info.title,
				  path: "/pages/index?productId=" + this.productId + "&inviteCode" + this.myInviteCode,
				  imageUrl:this.config.BIZ_SHARE_URL + "?temp=" + Date.parse(new Date()),
				}
			},
			submit(){
				this.$store.commit("setshareProTitle",this.info.title);
				if(this.config.BIZ_EJECT_FLAG == 1){
					this.modalTitle = "商品预约订购说明";
					this.modalCont = "当前正值疫情防控的关键时期，疫情防控的相关医疗和物资供应十分紧张。我们千方百计加大疫情防控医疗和防控物资采购筹集力度，联系多家医疗机构和厂家，在确保医疗救治和防控一线基础上，为满足广大市民需求，平抑市场价格，向市民提供尽可能多的医用外科口罩。\n该批口罩将以接近厂价平价投放，市民可通过本小程序进行在线预约定购。预约成功者会收到支付通知，并在24小时内进行支付，支付成功后将免费统一快递到家。否则视为弃购。\n由于目前筹集和生产的口罩数量有限，每人有限购数量，请理解。";
					this.showModal = true;
				}else{
					uni.navigateTo({
						url:`/pages/reserve?id=${this.productId}&buyType=${this.buyType}`
					})
				}
				
			},
		},
		async onLoad(opt) {
			this.productId = opt.id
			uni.showLoading({
				title:"数据加载中..."
			})
			await this.getInfo();
			uni.hideLoading();
		}
	}
</script>

<style lang="less" scoped>
	.detail{
		min-height: 100vh;
		padding-bottom: 100rpx;
		.b1{
			font-size: 0;
			.swiper{
				height: 750rpx;
				font-size: 0;
				.sbgk{
					width: 100%;
					height: 100%;
				}
			}
			.bgk{
				width: 100%;
				height: auto;
				
			}
			.bgk2{
				height: 600rpx;
				background-color: #999999;
				text-align: center;
				line-height: 600rpx;
				font-size: 40rpx;
				color: #333333;
			}
		}
		.b2{
			background-color: #fff;
			padding: 32rpx;
			.b2d1{
				display: flex;
				align-items: center;
				.b2d1p1{
					color: #ED5D5D;
					font-size: 35rpx;
				}
				.b2d1p2{
					margin-left: 40rpx;
					font-size: 26rpx;
					display: flex;
					.b2d1p2t{
						color: #4395c5;
					}
				}
			}
			.b2d2{
				margin-top: 10rpx;
				color: #303133;
				font-size: 30rpx;
			}
			.b2d3{
				margin-top: 30rpx;
				display: flex;
				align-items: center;
				.b2d3i1{
					.b2d3i1img{
						width: 50rpx;
						height: 50rpx;
						border: 2rpx solid #fff;
						margin-left: -12rpx;
						border-radius: 50%;
					}
					.b2d3i1img2{
						margin-left: 0;
					}
				}
				.b2d3i2{
					color: #909399;
					font-size: 26rpx;
					margin-left: 8rpx;
				}
			}
		}
		.b3{
			font-size: 0;
			border-top: 40rpx solid #F3F4F5;
			.b3t1{
				padding-top: 38rpx;
				padding-bottom: 40rpx;
				text-align: center;
				color: #606266;
				font-size: 32rpx;
			}
		}
		.b4{
			position: fixed;
			bottom: 0;
			left: 0;
			width: 100%;
			height: 100rpx;
			padding-top: 10rpx;
			padding-bottom: 10rpx;
			padding-left: 32rpx;
			padding-right: 32rpx;
			background-color: #fff;
			display: flex;
			justify-content: space-between;
			align-items: center;
			box-sizing: border-box;
			border-top: 2rpx solid #dadfe6;
			.b4r1{
				color: #909399;
				margin-right: 48rpx;
				.iconfont{
					font-size: 40rpx;
				}
				.b4r1tetxt{
					font-size: 24rpx;
					// margin-top: 6rpx;
				}
			}
			.sharebtn{
				padding: 0;
				background: none;
				border-radius: 0;
				line-height: unset;
			}
			.sharebtn::after{
				border: none;
			}
			.b4r1b{
				flex: 1;
				background:linear-gradient(133deg,#55bdf9 0%,#4395c5 100%);
				border-radius:34px;
				color: #fff;
				line-height: 70rpx;
				display: flex;
				align-items: center;
				justify-content: center;
				font-size: 32rpx;
				padding: 0;
				.b4r1btext{
					margin-left: 10rpx;
				}
			}
			.b4r1b1{
				
			}
			.b4r1b1::after{
				border:none;
			}
			.b4r1b2{
				
			}
		}
	}
</style>
