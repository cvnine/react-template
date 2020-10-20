import React, { FC } from 'react'
import styled from 'styled-components'

export const LoadingWarp = styled.div`
	height: 100%;
	width: 100%;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	color: ${(props) => props.theme.moreColor};
	font-size: 14px;
	.circular {
		height: 42px;
		width: 42px;
		animation: loading-rotate 2s linear infinite;
		margin-bottom: 10px;
		.path {
			animation: loading-dash 1.5s ease-in-out infinite;
			stroke-dasharray: 90, 150;
			stroke-dashoffset: 0;
			stroke-width: 2;
			stroke: #409eff;
			stroke-linecap: round;
		}
	}
`

const LoadingView: FC = () => {
	return (
		<LoadingWarp>
			<svg viewBox="25 25 50 50" className="circular">
				<circle cx="50" cy="50" r="20" fill="none" className="path"></circle>
			</svg>
			<span>正在加载，请稍后...</span>
		</LoadingWarp>
	)
}
export default LoadingView
