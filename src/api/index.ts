import { fetchGet, fetchPost, fetchDelete, fetchPut } from '@/utils/axios'

export const fetchGetDetail = (params: object) =>
	fetchPost(`/requests`, {
		params: JSON.stringify(params),
	}).then((res) => {
		console.log(res)
		return res
	})
