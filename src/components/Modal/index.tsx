import React, { FC } from 'react'
import { Modal, ModalProps } from '@kedacom-new/react-base'
import styled from 'styled-components'

const ReModal: FC<ModalProps> = ({ children, ...rest }) => {
	return (
		<Modal {...rest}>
			<div className="modal">{children}</div>
		</Modal>
	)
}
export default styled(ReModal)`
	.modal {
		padding: 0 25px;
	}
`
