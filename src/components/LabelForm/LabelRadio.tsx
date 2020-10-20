import React, { useState, useCallback, useEffect, FC } from 'react'
import { LabelWrap } from './LabelWrap'
import { Checkbox, CheckboxProps } from '@kedacom-new/react-base'

export interface LabelRadioProps extends CheckboxProps {
	label: string
	labelWidth?: number
	width?: number
	required?: boolean
}

export const LabelRadio: FC<LabelRadioProps> = (props) => {
	const { label, labelWidth, width, required, ...restProps } = props

	return (
		<LabelWrap labelWidth={labelWidth} label={label} required={required}>
			<Checkbox {...restProps} width={width || 300} />
		</LabelWrap>
	)
}

export const useRadio = ({ initValue = '', helper = '', validator = (value: string) => true, ...handles }) => {
	const [value, setValue] = useState(initValue)
	const [flag, setFlag] = useState({ error: false, helper: '' })

	const onChange = useCallback(
		(x) => {
			setValue(x.value)

			if (handles['onChange'] && typeof handles['onChange'] === 'function') {
				handles['onChange'](x)
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
