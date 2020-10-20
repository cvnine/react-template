import styled from 'styled-components'
import logo from '@/assets/logo.png'

export const LayoutWrap = styled.div`
	width: 100%;
	height: 100%;
	min-height: 650px;
	overflow: hidden;
	display: flex;
	flex-direction: column;
	background: ${(props) => props.theme.main};
	.wrap-content {
		flex: auto;
		min-height: 500px;
		padding: 0px 50px;
		position: relative;
	}
`

export const Header = styled.div`
	flex: 0 0 52px;
	height: 52px;
	padding: 0 50px;
	display: flex;
	flex-direction: row;
	background-color: #373d41;
	align-items: center;
	.logo {
		background-image: url(${logo});
		width: 118px;
		height: 18px;
	}
`

export const Footer = styled.div`
	flex: 0 0 34px;
	height: 34px;
	padding: 16px 0 0 0;
	text-align: center;
	background: #373d41;
	color: #ffffff;
	.organization {
		margin-right: 20px;
	}
`
