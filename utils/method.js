import store from '../store'
export default{
	wxLogin(){
		return new Promise((resolve,reject) => {
			uni.login({
			  provider: 'weixin',
			  success: function (res) {
				if (res.code) {
				    uni.getUserInfo({
				    	provider: 'weixin',
				    	success: function(infoRes) {
							let result = {}
							Object.assign(result,infoRes.userInfo,{jsCode:res.code},{inviteCode:store.state.inviteCode});
							resolve(result);
				    	},
				    	fail(res) {
							resolve(false)
						}
				    });
				}else{
					resolve(false)
				}
			  },
			  fail:function(res){resolve(false)}
			})
		})
	},
	//登录成功设置
	setSesion(session,userInfo){
		store.commit('setLogin',true)
		store.commit('setUserInfo',userInfo)
		uni.setStorageSync('session',session)
		uni.setStorageSync('userInfo',userInfo)
	},
	//退出登录
	rmData(){
		store.commit('setLogin',false)
		store.commit('setUserInfo',null)
		uni.removeStorageSync('session');
		uni.removeStorageSync('userInfo');
	},
	//数据校验
	judgeData(arr) {
		let res = true;
		for (let item of arr) {
			if (item.data.length == 0) {
				res = false;
				uni.hideLoading();
				setTimeout(_=>{
					uni.showToast({
						icon: 'none',
						title: item.info,
						duration: 2000
					});
				})
				break
			}
		}
		return res
	},
	//过万处理
	dealWan(data){
		let _data = Number(data);
		if(_data > 10000){
			return parseInt(_data / 10000) + "w+"
		}else{
			return _data
		}
	},
	//将时间戳转化为格式化日期和时间
	unixToDatetime(unix,x=1){
		  var date = null;
		  if(unix){
		    date = new Date(unix);
		  }else {
		    date = new Date;
		  }
		  let Y = date.getFullYear() + '-';
		  let M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1);
		  let D = date.getDate() < 10 ? '0' + date.getDate() + ' ' : date.getDate() + ' ';
		  let h = date.getHours() < 10 ? '0' + date.getHours()  + ':' : date.getHours() + ':';
		  let m = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();
		  let s = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();
		  if(x === 1){return (Y+M+'-'+D+h+m);}//2017-09-29 21:30
		  if(x === 4){return (Y+M+'-'+D+h+"00");}//2017-09-29 21:00
		  if(x === 2){return (Y+M+'-'+D+"00"+":"+"00");}//2019-09-29 00:00
		  if(x === 3){return (Y+M+'-'+D);}//2019-09-29
		  if(x === 5){return (Y+M+'-'+"01");}//2019-09-01
		  if(x === 6){return (Y+M);}//2019-09
		  if(x === 7){return (Y+M+'-'+D+h+m+':'+s);}//精确到秒
		  if(x === 0){//取上一个月
		    var Y2 = date.getFullYear(); //获取当前日期的年份
		    var M2 = parseInt(date.getMonth());
		    if (M2 === 1) {//如果是1月份，则取上一年的12月份
		      Y2 = parseInt(Y2) - 1;
		      month2 = 12;
		    }
		    return (Y2+'-'+M2);
		  }
	},
}