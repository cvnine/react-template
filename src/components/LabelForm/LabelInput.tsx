import React, { useState, useCallback, useEffect, useMemo, FC } from 'react'
import { LabelWrap } from './LabelWrap'

export interface LabelInputProps {
	label: string
	labelWidth?: number
	width?: number | string
	required?: boolean
}

export const LabelInput: FC<LabelInputProps> = (props) => {
	const { label, labelWidth, width, required, ...restProps } = props

	return (
		<LabelWrap labelWidth={labelWidth} label={label} required={required}>
			<input {...restProps} width={width || 300} />
		</LabelWrap>
	)
}

interface IEvent {
	[params: string]: any
}

export const useInput = ({
	initValue = '',
	validate = [
		{
			handler: ['onChange'],
			validator: () => true,
			helper: '',
		},
	],
	...handles
}) => {
	const [value, setValue] = useState(initValue)
	const [flag, setFlag] = useState({ error: false, helper: '' })

	const justifyFlag = useCallback((list, value) => {
		for (const item of list) {
			if (!item.validator(value)) {
				setFlag({ error: true, helper: item.helper })
				break
			} else {
				setFlag({ error: false, helper: '' })
			}
		}
	}, [])

	const [_events, _eventHandlers] = useMemo(() => {
		let eventHandlers: IEvent = {},
			events: IEvent = {}
		for (const item of validate) {
			for (const handler of item.handler) {
				if (eventHandlers[handler]) {
					eventHandlers[handler].push({
						validator: item.validator,
						helper: item.helper,
					})
				} else {
					eventHandlers[handler] = [{ validator: item.validator, helper: item.helper }]
				}
			}
		}
		for (const [key, handlers] of Object.entries(eventHandlers)) {
			events[key] = (e: React.BaseSyntheticEvent) => {
				const { value } = e.target
				justifyFlag(handlers, value)
				if (handles[key] && typeof handles[key] === 'function') {
					handles[key](value)
				}
			}
		}
		return [events, eventHandlers]
	}, [handles, justifyFlag, validate])

	const onChange = useCallback(
		(e) => {
			const { value } = e.target
			setValue(value)

			if (handles['onChange'] && typeof handles['onChange'] === 'function') {
				handles['onChange'](value)
			}
		},
		[handles]
	)
	const onKeyDown = useCallback(
		(e) => {
			const { value } = e.target
			if (handles['onKeyDown'] && typeof handles['onKeyDown'] === 'function') {
				handles['onKeyDown'](e, value)
			}
		},
		[handles]
	)

	useEffect(() => {
		if (Object.keys(_eventHandlers).includes('onChange')) {
			justifyFlag(_eventHandlers['onChange'], value)
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [value])

	return {
		...flag,
		setValue,
		bind: {
			value,
			...handles,
			..._events,
			onChange,
			onKeyDown,
		},
	}
}
