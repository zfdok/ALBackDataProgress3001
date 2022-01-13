const router = require('koa-router')()
var mysqlAPI = require('../mysql/mysqlAIP');
var sms = require("../sms/smsAPI")

router.prefix('/users')

router.get('/', function (ctx, next) {
  ctx.body = 'this is a users response!'
})

router.get('/bar', function (ctx, next) {
  ctx.body = 'this is a users/bar response'
})

//发送验证短信
router.get('/get_sms_code', async (ctx, next) => {
  let username = ctx.request.query.username
  let phoneNum = ctx.request.query.phoneNum
  let a_random = randomNum(1000, 9000)
  sms.sendSMSCode(phoneNum, a_random, 1276738)
  let res = await mysqlAPI.update_sms_code(username, a_random)
  console.log(res);
  ctx.body = {
    code: 200, message: "发送成功!", data: "发送成功!", success: phoneNum
  }
})

//验证短信
router.get('/check_sms_code', async (ctx, next) => {
  let username = ctx.request.query.username
  let phoneNum = ctx.request.query.phoneNum
  let code = ctx.request.query.code
  let res2 = await mysqlAPI.sql_sms_code(username)
  if (code == res2) {
    ctx.body = {
      code: 200, message: "验证成功!", data: "验证成功!", success: phoneNum
    }
  } else {
    ctx.body = {
      code: 400, message: "验证失败!!", data: "验证失败!", success: phoneNum
    }
  }
})

function randomNum(minNum, maxNum) {
  switch (arguments.length) {
    case 1:
      return parseInt(Math.random() * minNum + 1, 10);
      break;
    case 2:
      return parseInt(Math.random() * (maxNum - minNum + 1) + minNum, 10);
      break;
    default:
      return 0;
      break;
  }
}
module.exports = router
