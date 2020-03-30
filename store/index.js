import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
	state: {
		hasLogin: false,
		userInfo:null,
		config:null,
		inviteCode:"",  //别人的邀请码
		myInviteCode:"",  //我的邀请码
		// shareImg:"https://xlpyg.cctouch.cn/profile/upload/share/share.png",  //下次更新改掉
		shareImg:"https://192.168.5.203:9107/profile/upload/share/share.png",
		shareProTitle:"",
		isVip:""
	},
	mutations: {
		setIsVip(state,data){
			state.isVip = data
		},
		setLogin(state,data){
			state.hasLogin = data
		},
		setUserInfo(state,data){
			state.userInfo = data
		},
		setConfig(state,data){
			state.config = data
		},
		setinviteCode(state,data){
			state.inviteCode = data
		},
		setshareProTitle(state,data){
			state.shareProTitle = data
		},
		setmyInviteCode(state,data){
			state.myInviteCode = data
		}
	}
})

export default store
