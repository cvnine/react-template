import React from 'react'
import Routes from '@/route'
import { Icon } from '@kedacom-new/react-base'
import { LayoutWrap, Header, Footer } from './style'
import { SWRConfig } from 'swr'
import ModalRender from '@/components/ModalRender'
import { ThemeProvider } from 'styled-components'
import { themeDark } from '@/theme'
import { hasFull } from '@/utils/utils'

const Layout = () => {
	return (
		<ThemeProvider theme={themeDark}>
			<LayoutWrap>
				{hasFull && (
					<Header>
						<Icon className="logo" />
					</Header>
				)}
				<section className="wrap-content">
					<SWRConfig
						value={{
							revalidateOnFocus: false,
							shouldRetryOnError: false,
						}}
					>
						<ModalRender>
							<Routes />
						</ModalRender>
					</SWRConfig>
				</section>
				{hasFull && (
					<Footer>
						<span className="organization">科达视讯云平台产品部</span>
						<span>Copyright © 2020 KEDACOM. All rights reserved.</span>
					</Footer>
				)}
			</LayoutWrap>
		</ThemeProvider>
	)
}

export default Layout
