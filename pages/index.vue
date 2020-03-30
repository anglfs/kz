<template>
	<view class="content">
		<navBar name="首页" />
		<view class="banner">
			<image mode="widthFix" class="bgk" v-if="config.BIZ_HOME_BANNER" :src="config.BIZ_HOME_BANNER"></image>
			<view class="bgklay" v-else>图片加载中......</view>
		</view>
		<view class="c1" v-if="notice && notice.length > 0">
			<image class="c1img" mode="widthFix" src="../static/img/tongzhi.png"></image>
			<swiper v-if="notice.length > 1" class="swiper" :autoplay="true" :vertical="true">
				<swiper-item class="swiper-item" v-for="(item,index) in notice" :key="index" @tap="showNotice(item)">
					<view class="swiper-item">{{item.title}}</view>
				</swiper-item>
			</swiper>
			<view class="swiper" v-else @tap="showNotice(notice[0])">{{notice[0].title}}</view>
		</view>
		<view class="c2">
			<view class="t1">
				<image class="img" mode="widthFix" src="../static/img/h1.png"></image>
				<view class="t1box">
					<view class="y1">
						<view class="q1" @tap="toPath('/pages/rules?vipAmount=' + promoteInfo.vipAmount + '&vipMaskNum=' + promoteInfo.vipMaskNum)">
							<image class="img" src="../static/img/h2.png"></image>
							<view class="q1text">了解活动规则</view>
						</view>
						<button class="q2 btn" v-if="!hasLogin" open-type="getUserInfo" lang="zh_CN" @getuserinfo="onGotUserInfo(1)">
							<view class="q2t1">
								邀请好友定购商品，单单返现
							</view>
							<view class="q2t2">
								成为VIP爱心推广大使
							</view>
						</button>
						<view class="q2" v-else @tap="Promote">
							<view class="q2t1">
								邀请好友定购商品，单单返现
							</view>
							<view class="q2t2">
								成为VIP爱心推广大使
							</view>
						</view>
					</view>
					<button v-if="!hasLogin" class="y2" open-type="getUserInfo" lang="zh_CN" @getuserinfo="onGotUserInfo(1)">
						<image class="imgy2" src="../static/img/go.png"></image>
					</button>
					<view class="y3" v-else @tap="Promote">
						<image class="imgy2" src="../static/img/go.png"></image>
					</view>
				</view>
			</view>
			<view class="c2t2" v-for="(item0,index0) in info" :key="index0">
				<view @tap="toDetail(item0.id)">
					<view class="t2">
						<view class="t2y1">
							<image class="t2y1img" :src="item0.picUrl1"></image>
							<view class="t2y1d1">
								已订{{item0.reserveNum || 0}}片
							</view>
						</view>
						<view class="t2y2">
							<view class="t2y2x1">{{item0.title}}</view>
							<view class="t2y2x2">
								<view class="t2y2x2p1">
									¥{{maxPrice}}/片
								</view>
								<view class="t2y2x2p2">
									<view class="t2y2x2p2imgs" v-if="item0.buyUserNum < 4">
										<image class="t2y2x2p2img" v-for="item in item0.buyUserNum" :key="item" :src="'../static/img/pics/' + item + '.jpeg'" mode=""></image>
									</view>
									<view class="t2y2x2p2imgs" v-else>
										<image class="t2y2x2p2img" v-for="item in 3" :key="item" :src="'../static/img/pics/' + item + '.jpeg'" mode=""></image>
									</view>
									<view class="t2y2x2p2text">
										<text v-if="item0.buyUserNum > 5">等</text>
										{{item0.buyUserNum || 0}}人订购
									</view>
								</view>
							</view>
						</view>
						
					</view>
					<view class="t3">立即预约订购</view>
				</view>
				<button v-if="!hasLogin" class="c2t2btn" open-type="getUserInfo" lang="zh_CN" @getuserinfo="onGotUserInfo(2,item0.id)">
				</button>
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
	import neilModal from '@/components/neil-modal/neil-modal.vue';
	import navBar from "@/components/nav-bar";
	import { mapState } from 'vuex';
	import utils from '../utils/method.js'
	export default {
		components: {navBar,neilModal},
		data() {
			return {
				showModal:false,
				modalTitle:"",
				modalCont:"",
				notice:[],
				info:null,
				promoteInfo:null,
				maxPrice:""
			}
		},
		computed:{
			...mapState(['hasLogin','config','isVip'])
		},
		async onPullDownRefresh() {
			uni.showLoading({
				title:"数据加载中..."
			})
			await this.judgeLogin();
			await this.getConfig();
			await this.getNotice();
			await this.getInfo();
			uni.stopPullDownRefresh();
			uni.hideLoading();
		},
		methods: {
			bindBtn(e){
				if(e == 'confirm'){
					this.showModal = false;
				}
			},
			judgeLogin(){
				 let _session = uni.getStorageSync('session');
				 let _userInfo = uni.getStorageSync('userInfo')
				 if(_session && _userInfo){
					utils.setSesion(_session,_userInfo)
				 }
			},
			async Promote(){
				if(this.isVip == 1){
					uni.navigateTo({
						url:"share"
					})
				}else{
					let _self = this;
					if(!this.promoteInfo){
						await _self.getPromoteInfo();
					}
					uni.showModal({
					    title: '提示',
					    content: '成为VIP爱心推广大使点击“我确认”，成为普通推广大使点击“去转发”',
						cancelText:'去转发',
						confirmText:'我确认',
					    success: function (res) {
					        if (res.confirm) {
					            uni.navigateTo({
					            	url:`join?showWd=-1&vipAmount=${_self.promoteInfo.vipAmount}&vipMaskNum=${_self.promoteInfo.vipMaskNum}`
					            })
					        } else if (res.cancel) {
					            uni.navigateTo({
					            	url:"share"
					            })
					        }
					    }
					});
				}
			},
			async onGotUserInfo(type,data) {
				let _self = this;
				uni.showLoading({
				    title: '请求中...'
				});
				let res1 = await utils.wxLogin();
				if(res1){
					let res2 = await this.$http({
						apiName:'userLogin',
						method:'POST',
						data:res1
					})
					try{
						utils.setSesion(res2,res1);
						await _self.getInvite();
						if(type == 1){
							_self.Promote()
						}
						if(type == 2){
							_self.toDetail(data)
						}
					}catch(e){}
				}else{
					uni.showToast({
						icon: 'none',
						title: "授权失败",
						duration: 1500
					});
				}
				uni.hideLoading()
			 },
			 async getInvite(){
				await this.$http({
					apiName:"userInfo",
				}).then(res => {
					this.$store.commit("setmyInviteCode",res.inviteCode);
					this.$store.commit("setIsVip",res.vip);
				}).catch(_=>{})
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
					this.$store.commit('setConfig',res);
				}catch(e){}
			 },
			 async getNotice(){
				let res = await this.$http({
					apiName:"notice"
				}) 
				try{
					this.notice = res
				}catch(e){}
			 },
			 async getInfo(){
				let res = await this.$http({
					apiName:"productInfo"
				}) 
				try{
					this.info = res;
					this.info.map(item => {
						item["reserveNum"] = utils.dealWan(item["reserveNum"])
					})
				}catch(e){}
			 },
			 async getPromoteInfo(){
			 	let res = await this.$http({
			 		apiName:"getPromoteInfo",
			 	})
			 	try{
			 		this.promoteInfo = res;
			 	}catch(e){}
			 },
			 showNotice(item){
				 this.modalTitle = item.title;
				 this.modalCont = item.content;
				 this.showModal = true;
			 },
			 toDetail(id){
				 uni.navigateTo({
				 	url:"/pages/detail?id=" + id
				 })
			 },
			 toPath(path){
				 uni.navigateTo({
				 	url:path
				 })
			 },
		},
		async onLoad(opt) {
			uni.showLoading({
				title:"数据加载中..."
			})
			await this.judgeLogin();
			await this.getConfig();
			await this.getNotice();
			await this.getInfo();
			if(this.hasLogin){
				this.getInvite();
				this.getPromoteInfo()
			}
			uni.hideLoading();
			if(opt.inviteCode){
				this.$store.commit('setinviteCode',opt.inviteCode)
			}
			if(opt.q){
				let q = decodeURIComponent(opt.q);
				let _i1 = q.split('?')[1];
				let _i2 = _i1.split('=')[1];
				this.$store.commit('setinviteCode',_i2)
			}
		}
	}
</script>

<style lang="less" scoped>
	.content {
		min-height: 100vh;
		background-color: #F3F4F5;
		.banner{
			font-size: 0;
			.bgk{
				width: 100%;
				height: auto;
			}
			.bgklay{
				height: 600rpx;
				background-color: #555555;
				text-align: center;
				line-height: 600rpx;
				font-size: 40rpx;
				color: #fff;
			}
		}
		.c1{
			background-color: #fff;
			padding-left: 32rpx;
			padding-right: 32rpx;
			display: flex;
			align-items: center;
			.c1img{
				width: 40rpx;
				height: auto;
				line-height: 80rpx;
			}
			.swiper{
				margin-left: 18rpx;
				flex: 1;
				width: 100rpx;
				height: 80rpx;
				line-height: 80rpx;
				color: #303133;
				font-size: 26rpx;
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
				.swiper-item{
					overflow: hidden;
					text-overflow: ellipsis;
					white-space: nowrap;
				}
			}
		}
		.c2{
			background-color: #F3F4F5;
			padding: 32rpx;
			.t1{
				position: relative;
				z-index: 0;
				.img{
					position: absolute;
					left: 0;
					top: 0;
					width: 100%;
					height: auto;
				}
				.t1box{
					z-index: 1;
					padding-left: 106rpx;
					padding-right: 26rpx;
					display: flex;
					justify-content: space-between;
					.y1{
						.q1{
							position: relative;
							font-size: 20rpx;
							z-index: 1;
							color: #fff;
							width: 140rpx;
							height: 36rpx;
							.img{
								position: absolute;
								top: -6rpx;
								left: 0;
								z-index: -1;
								width: 100%;
								height: 100%;
							}
							.q1text{
								z-index: 2;
								margin-left: 6rpx;
							}
						}
						.q2{
							position: relative;
							color: #fff;
							.q2t1{
								margin-top: 8rpx;
								font-size: 32rpx;
							}
							.q2t2{
								margin-top: 4rpx;
								font-size: 24rpx;
							}
						}
						.q2.btn{
							background: none;
							border: none;
							line-height: initial;
							padding: 0;
							text-align: left;
						}
						.q2.btn::after{
							border: none;
						}
					}
					.y2{
						width: 116rpx;
						height: 116rpx;
						background: none;
						margin-top: 16rpx;
						padding: 0;
						.imgy2{
							width: 100%;
							height: 100%;
						}
					}
					.y2::after{
					  border:none;
					}
					.y3{
						position: relative;
						.imgy2{
							width: 116rpx;
							height: 116rpx;
							margin-top: 16rpx;
						}
					}
				}
			}
			.c2t2{
				position: relative;
			}
			.t2{
				margin-top: 40rpx;
				background-color: #fff;
				border-top-left-radius: 12rpx;
				border-top-right-radius: 12rpx;
				padding: 32rpx 24rpx;
				display: flex;
				justify-content: space-between;
				align-items: center;
				.t2y1{
					position: relative;
					font-size: 0;
					border-radius: 8rpx;
					overflow: hidden;
					.t2y1img{
						width: 180rpx;
						height: 180rpx;
					}
					.t2y1d1{
						position: absolute;
						bottom: 0;
						left: 0;
						width: 100%;
						height: 44rpx;
						line-height: 44rpx;
						background-color: #FFDE26;
						color: #B0620C;
						font-size: 22rpx;
						text-align: center;
					}
				}
				.t2y2{
					margin-left: 20rpx;
					flex: 1;
					.t2y2x1{
						color: #303133;
						font-size: 30rpx;
					}
					.t2y2x2{
						margin-top: 30rpx;
						display: flex;
						justify-content: space-between;
						align-items: center;
						.t2y2x2p1{
							color: #ED5D5D;
							font-size: 28rpx;
						}
						.t2y2x2p2{
							display: flex;
							align-items: center;
							.t2y2x2p2imgs{
								.t2y2x2p2img{
									width: 40rpx;
									height: 40rpx;
									border: 2rpx solid #fff;
									border-radius: 50%;
									margin-left: -12rpx;
								}
							}
							.t2y2x2p2text{
								margin-left: 6rpx;
								color: #909399;
								font-size: 26rpx;
							}
						}
					}
				}
				
			}
			.c2t2btn{
				position: absolute;
				left: 0;
				top: 0;
				width: 100%;
				height: 100%;
				background: none;
				border: none;
			}
			.c2t2btn::after{
				border: none;
			}
			.t3{
				background-color: #4395c5;
				height: 96rpx;
				line-height: 96rpx;
				color: #fff;
				font-size: 42rpx;
				text-align: center;
				border-bottom-left-radius: 12rpx;
				border-bottom-right-radius: 12rpx;
			}
			
			
		}
	}
</style>
