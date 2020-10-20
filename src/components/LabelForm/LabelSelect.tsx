import React, { useState, useCallback, useEffect, FC } from 'react'
import { LabelWrap } from './LabelWrap'

export interface ISelectOptionsData {
	optionValueKey: string
	optionTextKey: string
	[params: string]: any
}

export interface SelectBusProps  {
	style: React.CSSProperties
	height: number | string
	width: number | string
	optionsData: ISelectOptionsData[]
	optionValueKey: string
	optionTextKey: string
	virtual: boolean
}

export interface LabelSelectProps {
	label: string
	labelWidth?: number
	optionValueKey?: string
	optionTextKey?: string
	required?: boolean
}

export const SelectBus = (props: Partial<SelectBusProps>) => {
	const {
		style,
		height = 'auto',
		width,
		optionsData,
		optionValueKey = 'key',
		optionTextKey = 'text',
		virtual = false,
		...restProps
	} = props
	return (
		<select
			{...restProps}
			style={{ ...style, flex: `0 0 ${width || 180}` }}
			width={width || 160}
			dropdownStyle={{ height }}
			virtual={virtual}
		>
			{optionsData?.map((item) => {
				return (
					<Select.Option
						key={item[optionValueKey]}
						value={item[optionValueKey]}
						data={item} //onchange时返回数据
					>
						{item[optionTextKey]}
					</Select.Option>
				)
			})}
		</select>
	)
}

export const LabelSelect: FC<LabelSelectProps> = (props) => {
	const {
		label,
		labelWidth,
		optionValueKey = 'key',
		optionTextKey = 'text',
		required = false,
		children,
		...restProps
	} = props

	return (
		<LabelWrap labelWidth={labelWidth} label={label} required={required}>
			<SelectBus optionValueKey={optionValueKey} optionTextKey={optionTextKey} {...restProps}></SelectBus>
			{children}
		</LabelWrap>
	)
}

export const useSelect = ({
	initValue = '',
	helper = '',
	optionValueKey = 'key',
	validator = (value: string) => true,
	...handles
}) => {
	const [value, setValue] = useState(initValue)
	const [flag, setFlag] = useState({ error: false, helper: '' })

	const onChange = useCallback(
		(v, x) => {
			setValue(v)
			if (handles['onChange'] && typeof handles['onChange'] === 'function') {
				handles['onChange']({ ...x, ...x.data })
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
