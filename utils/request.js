import Api from './api.js'
// import store from '../store'
import utils from "./method.js"
var test = false;
var _baseUrl = '';
if (test) {
	_baseUrl = 'http://183.236.93.154:9701/api';  //客户地址
} else {
	//_baseUrl = 'http://192.168.5.203:9701/api';  //客户地址
	_baseUrl = 'http://183.236.93.154:9701/api';  //客户地址	// _baseUrl = 'https://cyoupgy.gzcyou.com/api';  //辰悠地址
}
var baseUrl = _baseUrl;
// 请求loading交给页面处理
// 页面中第一个需要使用登录的请求需要加await,若同一个页面多个请求需要避免多次loading

// 单次请求
export function http(opt){
	let _data = Object.assign({},opt.data || {})
	return new Promise((resolve, reject)=>{
		uni.request({
			header:{
				"Content-Type":"application/x-www-form-urlencoded",
				"Xlkz-SessionId":uni.getStorageSync("session") || "",
				"Xlkz-Version":"v1.2.3",
			},
			url: baseUrl + Api[opt.apiName],
			method:opt.method || 'GET',
			data:_data,
			success:res => {
				if(res.statusCode == 200){
					if(res.data && res.data.code == 200000){
						resolve(res.data.data)
					}else if(res.data && res.data.code == 300000){
						uni.hideLoading()
						utils.rmData()
						uni.showToast({
							icon: 'none',
							title: res.data.message,
							duration: 1500
						});
						reject(res.message)
					}else{
						uni.hideLoading()
						uni.showToast({
							icon: 'none',
							title: res.data.message,
							duration: 1500
						});
						reject(res)
					}
				}else{
					uni.hideLoading()
					reject('服务器错误')
				}
			},
			fail:err => {
				uni.hideLoading()
				reject('请求错误')
			}
		})
	})
}

export function httpAll(opts){
	let promiseList = [];
	for (let i = 0; i < opts.length; i++) {
		let opt = opts[i];
		promiseList.push(http(opt,true))
	}
	var ret = Promise.all(promiseList);
	return ret;
}