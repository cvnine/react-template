import { observable, action } from 'mobx'

interface UserInfo {}

class Store {
	@observable
	userInfo: UserInfo = {}

	@action
	setUserInfo = (userInfo: UserInfo) => {
		this.userInfo = userInfo
	}
}

export default new Store()
