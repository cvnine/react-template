import React, { useState, useCallback, useEffect, FC } from 'react'
import dayjs from 'dayjs'
import { LabelWrap } from './LabelWrap'
import { EDatePicker, EDatePickerProps } from '@kedacom-new/react-base'

export interface LabelRangePickerProps extends EDatePickerProps {
	label: string
	labelWidth?: number
	required?: boolean
}

export interface IUseRangePicker {
	initValue: [string | null, string | null]
	helper: string
	validator: (value: [string | null, string | null]) => boolean
	[params: string]: any
}

export const RangePicker = (props: EDatePickerProps) => {
	const {
		width = 400,
		placeholder = ['请选择开始时间和结束时间'],
		format = 'yyyy-MM-dd HH:mm',
		rangeSeparator = ' 至 ',
		value = [null, null],
		hasClearBtn = false,
		...restProps
	} = props

	let valueArr = [value[0] !== null ? new Date(value[0]) : null, value[1] !== null ? new Date(value[1]) : null]

	return (
		<EDatePicker.DateRangePicker
			{...restProps}
			value={valueArr}
			width={width}
			format={format}
			placeholder={placeholder}
			hasClearBtn={hasClearBtn}
			rangeSeparator={rangeSeparator}
		/>
	)
}
export const LabelRangePicker: FC<LabelRangePickerProps> = (props) => {
	const { label, labelWidth, required = false, children, ...restProps } = props

	return (
		<LabelWrap labelWidth={labelWidth} label={label} required={required}>
			<RangePicker {...restProps}></RangePicker>
			{children}
		</LabelWrap>
	)
}

export const useRangePicker = ({
	initValue = [null, null],
	helper = '',
	validator = () => true,
	...handles
}: IUseRangePicker) => {
	const [value, setValue] = useState<[string | null, string | null]>(initValue)
	const [flag, setFlag] = useState({ error: false, helper: '' })

	const onChange = useCallback(
		(v) => {
			const TIME_FORMAT = 'YYYY-MM-DD HH:mm:ss'

			const startTime = v == null || v.length === 0 ? null : dayjs(v[0]).format(TIME_FORMAT)
			const endTime = v == null || v.length === 0 ? null : dayjs(v[1]).format(TIME_FORMAT)

			setValue([startTime, endTime])

			if (handles['onChange'] && typeof handles['onChange'] === 'function') {
				handles['onChange']({ date: v, ...value })
			}
		},
		[handles, value]
	)

	useEffect(() => {
		if (!validator(value)) {
			setFlag({ error: true, helper: helper })
		} else {
			setFlag({ error: false, helper: '' })
		}
	}, [helper, validator, value])

	return {
		...flag,
		setValue,
		bind: {
			value,
			...handles,
			onChange,
		},
	}
}
