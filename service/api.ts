import * as Koa from 'koa'
import * as koaBody from 'koa-body'
import * as cors from 'koa2-cors'
import router from './routes'

const app = new Koa()

// 处理跨域问题
app.use(
	cors({
		exposeHeaders: ['WWW-Authenticate', 'Server-Authorization', 'Date'],
		maxAge: 100,
		credentials: true,
		allowMethods: ['GET', 'POST', 'OPTIONS'],
		allowHeaders: ['Content-Type', 'Authorization', 'Accept', 'X-Custom-Header', 'anonymous'],
	})
)

// middlewares
app.use(koaBody())

// routes
// 加载路由中间件
app.use(router.routes()).use(router.allowedMethods())

app.listen('3001', () => {
	console.log('监听端口 3001')
})
