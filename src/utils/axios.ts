import axios from 'axios'
import qs from 'qs'
import { Alert } from '@kedacom-new/react-base'

const service = axios.create({
	baseURL: './',
	timeout: 300000,
	headers: {
		'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
		'X-Requested-With': 'XMLHttpRequest',
	},
})

//请求拦截
service.interceptors.request.use(
	(config) => {
		return config
	},
	(error) => {
		return Promise.reject(error)
	}
)
let infoAlert: string = ''
//返回拦截
service.interceptors.response.use(
	(response) => {
		const res = response.data

		if (response.status !== 200 || res?.success !== 1) {
			//弹窗
			if (infoAlert) return Promise.reject('error')
			infoAlert = Alert.info({
				content: res?.description ?? '系统错误',
				onOk: () => {
					Alert.remove(infoAlert)
					infoAlert = ''
				},
			})
			return Promise.reject('error')
		} else {
			return res
		}
	},
	(error) => {
		if (infoAlert) return Promise.reject(error)
		//弹窗
		infoAlert = Alert.info({
			content: '系统错误',
			onOk: () => {
				Alert.remove(infoAlert)
				infoAlert = ''
			},
		})

		return Promise.reject(error)
	}
)

export default service

export const fetchGet = (url = '', data: any, config = {}) =>
	service.get(url, {
		params: data,
		...config,
	})

export const fetchPost = (url = '', data: any, config = {}) => service.post(url, qs.stringify(data), config)

export const fetchDelete = (url = '', data: any, config = {}) =>
	service.delete(url, {
		params: data,
		...config,
	})

export const fetchPut = (url = '', data: any, config = {}) => service.put(url, qs.stringify(data), config)
