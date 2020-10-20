import React, { createContext, useState, useCallback, useContext, FC, useMemo } from 'react'

interface IModalList {
	Comp: React.ComponentType<any>
	props: React.ReactPropTypes
	_id: number
}

interface ModalContextValue {
	showModal: (Component: React.ComponentType<any>, props: React.ReactPropTypes) => void
	hideModal: () => void
}

const ModalContext = createContext<ModalContextValue>({
	showModal: () => {
		throw new Error('useModal 必须是 ModalRender 组件的子级')
	},
	hideModal: () => {},
})

const ModalRender: FC = (props) => {
	const [modalList, setModalList] = useState<IModalList[]>([])

	const hideModal = useCallback(() => {
		setModalList((prev) => {
			let arr = prev.slice()
			arr.pop()
			return arr
		})
	}, [])

	const showModal = useCallback((Comp, props) => {
		setModalList((prev) => {
			if (prev.length > 0) {
				return [...prev, { Comp, props, _id: prev[prev.length - 1]._id + 1 }]
			} else {
				return [{ Comp, props, _id: 1 }]
			}
		})
	}, [])

	const value = useMemo(() => ({ showModal, hideModal }), [hideModal, showModal])

	return (
		<ModalContext.Provider value={value}>
			{props.children}
			<>
				{modalList.map((x) => (
					<x.Comp {...x.props} hideModal={hideModal} key={x._id} />
				))}
			</>
		</ModalContext.Provider>
	)
}

export function useModal(Modal: React.ComponentType<any>) {
	const renderer = useContext(ModalContext)

	return [
		useCallback(
			(props) => {
				renderer.showModal(Modal, props || {})
			},
			[Modal, renderer]
		),
		renderer.hideModal,
	]
}

export default ModalRender
