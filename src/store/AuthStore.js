import { observable, action } from 'mobx'

class AuthStore {
    @observable
    userInfo = {}

    @action
    setUserInfo = (userInfo) => {
        this.userInfo = userInfo
    }
}

export default new AuthStore()
