<template>
	<view class="rbox">
		<image v-if="poster" class="rb1" :src="poster" mode="widthFix"></image>
		<view class="rb1 rb3" v-else>
			图片加载中......
		</view>
		<view class="rb2">
			<view class="rb2h" @tap="savePoster">
				保存图片到相册
			</view>
		</view>
	</view>
</template>

<script>
	export default{
		data(){
			return{
				poster:"",
			}
		},
		methods:{
			async getPoster(){
				try{
					let res = await this.$http({
						apiName:"sharePoster"
					})
					this.poster = res + "?temp=" + Date.parse(new Date());
				}catch(e){}
			},
			savePoster(){
				uni.showLoading({
					title:"保存中..."
				})
				let that = this
				uni.downloadFile({
					url: that.poster,
					success:function (res) {
						//图片保存到本地
						uni.saveImageToPhotosAlbum({
							filePath: res.tempFilePath,
							success:function (data) {
								uni.showToast({
								    title: "保存成功",
								    duration: 1000
								});
							},
							fail:function (err) {
								if (err.errMsg === "saveImageToPhotosAlbum:fail:auth denied" || err.errMsg === "saveImageToPhotosAlbum:fail auth deny" || err.errMsg === "saveImageToPhotosAlbum:fail authorize no response") {
									uni.showModal({
										title: '提示',
										content: '需要您授权保存相册',
										showCancel: false,
										success: modalSuccess => {
										uni.openSetting({
											success(settingdata) {
												if (settingdata.authSetting['scope.writePhotosAlbum']) {
													uni.showModal({
														title: '提示',
														content: '获取权限成功,再次点击保存',
														showCancel: false,
													})
												} else {
													uni.showModal({
														title: '提示',
														content: '获取权限失败，将无法保存到相册哦~',
														showCancel: false,
													})
												}
											},
											fail(failData) {
												console.log("failData", failData)
											},
											complete(finishData) {
												console.log("finishData", finishData)
											}
										})
										}
									})
								}
							}
						})
					},
					complete(){
						uni.hideLoading()
					}
				});
			}
		},
		async onLoad() {
			await this.getPoster()
		}
	}
</script>

<style lang="less" scoped>
	.rbox{
		min-height: 100vh;
		padding: 32rpx;
		padding-bottom: 100rpx;
		background-color: #F3F4F5;
		box-sizing: border-box;
		.rb1{
			width: 100%;
			height: auto;
			border-radius: 12rpx;
		}
		.rb3{
			height: calc(100vh - 200rpx);
			background-color: #fff;
			color: #808080;
			font-size: 40rpx;
			text-align: center;
			line-height: calc(100vh - 200rpx);
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
