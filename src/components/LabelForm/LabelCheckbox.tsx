import React, { useState, useCallback, useEffect, FC } from 'react'
import { LabelWrap } from './LabelWrap'
import { SpaceWraper as SpaceWrapper, Checkbox, CheckboxProps } from '@kedacom-new/react-base'

export interface ICheckboxOptionsData {
	optionValueKey: string
	optionTextKey: string
	[params: string]: any
}

export interface CheckboxBusProps extends CheckboxProps {
	value: string[]
	optionsData: ICheckboxOptionsData[]
	optionValueKey: string
	optionTextKey: string
	width?: number | string
}

export interface LabelCheckboxProps extends CheckboxBusProps {
	label: string
	labelWidth?: number
	required?: boolean
}

export const CheckboxBus: FC<CheckboxBusProps> = (props) => {
	const { value, optionsData, width, optionValueKey = 'key', optionTextKey = 'text', ...restProps } = props
	return (
		<SpaceWrapper width={width || '100%'}>
			{optionsData?.map((item, index) => {
				return (
					<Checkbox
						{...restProps}
						key={index}
						disabled={item.disabled}
						labelText={item[optionTextKey]}
						value={item[optionValueKey]}
						checked={value.includes(item[optionValueKey])}
					></Checkbox>
				)
			})}
		</SpaceWrapper>
	)
}

export const LabelCheckbox: FC<LabelCheckboxProps> = (props) => {
	const { label, labelWidth, required, ...restProps } = props

	return (
		<LabelWrap labelWidth={labelWidth} label={label} required={required}>
			<CheckboxBus {...restProps}></CheckboxBus>
		</LabelWrap>
	)
}

export interface IUseCheckbox {
	initValue?: string[]
	helper?: string
	validator?: (value: string[]) => boolean
	[params: string]: any
}

export const useCheckbox = ({ initValue = [], helper = '', validator = () => true, ...handles }: IUseCheckbox) => {
	const [value, setValue] = useState(initValue)
	const [flag, setFlag] = useState({ error: false, helper: '' })

	const onClick = useCallback(
		(c, v) => {
			if (c) {
				setValue([...value, v])
			} else {
				setValue([
					...value.splice(
						value.findIndex((item) => item === v),
						1
					),
				])
			}

			if (handles['onClick'] && typeof handles['onClick'] === 'function') {
				handles['onClick'](c, v)
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
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [value])

	return {
		...flag,
		setValue,
		bind: {
			value,
			...handles,
			onClick,
		},
	}
}
