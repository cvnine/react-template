import React from 'react'
import styled from 'styled-components'

export interface WrapProps {
	labelWidth: number
	required: boolean
}

const Wrap = styled.div<Partial<WrapProps>>`
	display: flex;
	align-items: center;
	margin-bottom: 20px;
	.label {
		flex: ${(props) => (props.labelWidth ? `0 0 ${props.labelWidth}px` : `0 0 110px`)};
		text-align: left;
	}
	&::after {
		content: '*';
		margin-left: 2px;
		display: ${(props) => (props.required ? 'inline' : 'none')};
		color: red;
	}
`

export function LabelWrap(props: React.PropsWithChildren<Partial<WrapProps> & { label: string }>) {
	return (
		<Wrap labelWidth={props.labelWidth} required={props.required}>
			<div className="label">{props.label}</div>
			{props.children}
		</Wrap>
	)
}
