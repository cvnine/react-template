import styled from 'styled-components'
import back from '@/assets/DetailForm/back_normal.png'
import backHover from '@/assets/DetailForm/back_hover.png'

export const DetailWrap = styled.div`
	overflow: auto;
	position: absolute;
	top: ${(props) => props?.style?.top ?? 0};
	left: ${(props) => props?.style?.left ?? 0};
	bottom: ${(props) => props?.style?.bottom ?? 0};
	right: ${(props) => props?.style?.right ?? 0};
	width: ${(props) => props?.style?.width ?? 'auto'};
	height: ${(props) => props?.style?.height ?? 'auto'};
	display: flex;
	flex-direction: column;
	opacity: 100;
	z-index: ${(props) => props?.style?.zIndex ?? 1};
	flex: 1;
	background: ${(props) => props.theme.main};
	padding: 24px 50px;
	.content {
		padding-left: 46px;
	}
`
export const HeaderWrap = styled.div`
	display: flex;
	align-items: center;
	justify-content: space-between;
	margin-bottom: 20px;
	.header-left {
		display: flex;
		align-items: center;
		.back {
			background: url(${back}) no-repeat;
			width: 26px;
			height: 26px;
			margin-right: 20px;
			cursor: pointer;
			&:hover {
				background: url(${backHover}) no-repeat;
			}
		}
		.title {
			color: ${(props) => props.theme.fontColor};
		}
	}
	.header-right {
		margin-right: -10px;
	}
`
