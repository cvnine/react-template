import React, { FC } from 'react'
import { DetailWrap, HeaderWrap } from './style'
import { Icon, Button, SpaceWraper as SpaceWrapper, ButtonProps } from '@kedacom-new/react-base'

export interface IButtonList extends ButtonProps {
	text: string
}

export interface DetailProps {
	title: string
	buttonList: IButtonList[]
	backClick?: () => void
	className?: string
	style?: React.CSSProperties
}

export const Detail: FC<DetailProps> = (props) => {
	const { title, buttonList, backClick, className, children, style } = props
	return (
		<DetailWrap className={className} style={style}>
			<HeaderWrap className="header">
				<div className="header-left">
					<Icon className="back" title="返回" onClick={() => backClick && backClick()}></Icon>
					<span className="title">{title}</span>
				</div>
				<div className="header-right">
					<SpaceWrapper>
						{buttonList?.map(({ text, ...rest }, index) => (
							<Button key={index} {...rest}>
								{text}
							</Button>
						))}
					</SpaceWrapper>
				</div>
			</HeaderWrap>
			<div className="content">{children}</div>
		</DetailWrap>
	)
}
