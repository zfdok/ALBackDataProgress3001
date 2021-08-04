const Koa = require('koa')
const app = new Koa()
const views = require('koa-views')
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
const logger = require('koa-logger')

const index = require('./routes/index')
const users = require('./routes/users')
const onenet = require('./routes/onenet')

const dailyTask = require('./dailytask/dailytask')
// error handler
onerror(app)

// middlewares
app.use(bodyparser({
  enableTypes:['json', 'form', 'text']
}))
app.use(json())
app.use(logger())
app.use(require('koa-static')(__dirname + '/public'))

app.use(views(__dirname + '/views', {
  extension: 'pug'
}))

// logger
app.use(async (ctx, next) => {
  const start = new Date()
  await next()
  const ms = new Date() - start
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
})


// 全局变量
app.use(async (ctx, next) => {
  ctx.state.projectID1 = '5ihtoF';
  ctx.state.projectID_zx = '4LwKzUwOpX';
  ctx.state.projectID_ly = 'TUqIt2dd20';
  ctx.state.projectID_znbwx = 'KytCaEItQL';
  ctx.state.projectID_llc = '89A3wY6lQy';
  ctx.state.projectID_zhlk = 'Ygy2xf0iYx';
  ctx.state.projectID_lcjzx = 'Z0P3ivtq9Z';
  ctx.state.projectID_ylbwx = 'F0Z9ecQd7i';
  ctx.state.userToken1 = 'version=2020-05-29&res=userid%2F163120&et=1763514709&method=sha1&sign=ftEhYGS5HqfRd7ubdLJ5JQGizkY%3D'
  await next();
})

// routes
app.use(index.routes(), index.allowedMethods())
app.use(users.routes(), users.allowedMethods())
app.use(onenet.routes(), onenet.allowedMethods())
// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
});

module.exports = app
