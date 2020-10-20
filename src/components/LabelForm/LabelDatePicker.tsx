import React, { useState, useCallback, useEffect, FC } from 'react'
import { LabelWrap } from './LabelWrap'
import { EDatePicker, EDatePickerProps } from '@kedacom-new/react-base'

export interface LabelDatePickerProps extends EDatePickerProps {
	label: string
	labelWidth?: number
	required?: boolean
}

export interface IUseDatePicker {
	initValue?: string | Date | null
	helper?: string
	validator?: (value: Date | null) => boolean
	[params: string]: any
}

export const DatePickerBus: FC<EDatePickerProps> = (props) => {
	const { placeholder = '选择日期', width = 200, ...restProps } = props
	return <EDatePicker width={width} placeholder={placeholder} {...restProps}></EDatePicker>
}
export const LabelDatePicker: FC<LabelDatePickerProps> = (props) => {
	const { label, labelWidth, required = false, children, ...restProps } = props

	return (
		<LabelWrap labelWidth={labelWidth} label={label} required={required}>
			<DatePickerBus {...restProps}></DatePickerBus>
			{children}
		</LabelWrap>
	)
}
export const useDatePicker = ({ initValue = '', helper = '', validator = () => true, ...handles }: IUseDatePicker) => {
	const [value, setValue] = useState<Date | null>(initValue ? new Date(initValue) : null)
	const [flag, setFlag] = useState({ error: false, helper: '' })

	const onChange = useCallback(
		(v, x) => {
			setValue(v)
			if (handles['onChange'] && typeof handles['onChange'] === 'function') {
				handles['onChange'](v)
			}
		},
		[handles]
	)

	useEffect(() => {
		if (!validator(value)) {
			setFlag({ error: true, helper: helper })
		} else {
			setFlag({ error: false, helper: '' })
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [value])

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
