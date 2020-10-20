import { useState } from 'react'
import useSWR, { mutate } from 'swr'
import { fetcherFn } from 'swr/dist/types'

export const useRequest = (
	key: string,
	fetcher: fetcherFn<any>,
	{
		init = true,
		cache = false,
		showLoading = true,
		option = { dedupingInterval: 1000, loadingTimeout: 5 * 60 * 1000 },
	}
) => {
	const [initFlag, setInitFlag] = useState<boolean>(init)
	const [loading, setLoading] = useState<boolean>(true)
	let SWR = useSWR(
		(initFlag && key) || null,
		() => {
			setLoading(true)
			return fetcher()
				.then((data: any) => {
					setLoading(false)
					return data
				})
				.catch((err: Error) => {
					setLoading(false)
					return err
				})
		},
		{ ...option }
	)
	const startInit = () => setInitFlag(true)
	const mutateSwr = () => {
		if (!initFlag) startInit()
		mutate(key)
	}
	return [SWR, mutateSwr, loading, startInit]
}
