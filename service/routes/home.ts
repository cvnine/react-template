import * as Router from 'koa-router'
import * as Mock from 'mockjs'

const router = new Router()

router.get('/home', async (ctx) => {
	ctx.body = Mock.mock({
		success: 1,
	})
})

export default router
