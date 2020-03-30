<template>
	<view class="ctbWarp" :style="{top:top,lineHeight:lineHeight}">
		<view class="mtb_side mtb_side1" @tap="back" :style={height:lineHeight}>
			<span v-if="showBack" class="iconfont iconfanhuiicon" :style="{width:lineHeight,height:lineHeight,lineHeight:lineHeight}"></span>
		</view>
		<view class="mtb_center">{{name}}</view>
		<view class="mtb_side"></view>
	</view>
</template>

<script>
	import { mapState } from 'vuex'
	export default {
		props:{
			name:{
				type: String,
				default:"",
			},
			showBack:{
				type: Boolean,
				default:false
			}
		},
		data(){
			return{
				pre:"<",
				top:"",
				lineHeight:"",
				lineHeight2:""
			}
		},
		methods:{
			back(){
				console.log(getCurrentPages())
				uni.navigateBack()
			}
		},
		created() {
			// #ifdef MP-WEIXIN
			let menuButton = uni.getMenuButtonBoundingClientRect();
			this.top = menuButton.top + 'px';
			this.lineHeight = menuButton.height + 'px';
			this.lineHeight2 = menuButton.height - 3 + 'px';
			// #endif
		}
	}
</script>

<style lang="less">
	.ctbWarp{
		width: 100%;
		position: fixed;
		top: var(--status-bar-height);
		left: 0;
		display: flex;
		align-items: center;
		color: #fff;
		z-index: 99999;
		.mtb_side{
			width: 20%;
		}
		.mtb_side1{
			padding-left: 24rpx;
			box-sizing: border-box;
			margin-top: -3px;
			.iconfont{
				display: inline-block;
				// width: 60rpx;
				// line-height: 60rpx;
				text-align: center;
				// height: 60rpx;
				background-color: rgba(0,0,0,0.5);
				color: #fff;
				border-radius: 50%;
				font-size: 22rpx;
			}
		}
		.mtb_center{
			flex: 1;
			text-align: center;
			font-size: 32rpx;
		}
	}
</style>