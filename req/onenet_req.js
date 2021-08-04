var request = require('request');
//获取用户分组基本方法
var getGroupIDs = async (ctx, offset) => {
  let rsp = await new Promise((resolve, reject) => {
    request({
      method: 'GET',
      timeout: 5000,
      url:
        'http://openapi.heclouds.com/application',
      qs: {
        action: 'QueryGroupList',
        version: 1,
        project_id: ctx.state.projectID1,
        limit: 100,
        offset
      },
      headers: {
        Authorization: ctx.state.userToken1
      }
    }, function (error, response, body) {
      resolve(JSON.parse(body).data.list);
    })
  });
  let getGroupIDlist = new Array();
  rsp.forEach(element => {
    if (element.group_id) {
      getGroupIDlist.push(element.group_id)
    }
  });
  return getGroupIDlist
}
//获取全部用户分组
var getAllGroupIDs = async (ctx, group_id) => {
  let allGroupIDs = new Array()
  let offset = 0
  while (1) {
    let templist
    templist = await getGroupIDs(ctx, offset)
    allGroupIDs.push(...templist)
    if (templist.length == 0) break
    offset += 100
  }
  return allGroupIDs
}
//获取设备基本方法
var getDevices = async (ctx, offset) => {
  let rsp = await new Promise((resolve, reject) => {
    request({
      method: 'GET',
      timeout: 5000,
      url:
        'http://openapi.heclouds.com/application',
      qs: {
        action: 'QueryDeviceList',
        version: 1,
        project_id: ctx.state.projectID1,
        limit: 100,
        offset
      },
      headers: {
        Authorization: ctx.state.userToken1
      }
    }, function (error, response, body) {
      resolve(JSON.parse(body).data.list);
    })
  });
  return rsp
}
//获取全部设备
var getAllDevices = async (ctx) => {
  let allDevices = new Array();
  let offset = 0
  while (1) {
    let templist
    templist = await getDevices(ctx, offset)
    allDevices.push(...templist)
    if (templist.length == 0) break
    offset += 100
  }
  return allDevices
}
//获取设备期望值
var getTempDesired = async (ctx,product_id,device_name) => {
  let rsp = await new Promise((resolve, reject) => {
    request({
      method: 'POST',
      timeout: 5000,
      url:
        'http://openapi.heclouds.com/application',
      headers: {
        Authorization: ctx.state.userToken1
      },
      qs: {
        action: 'QueryDeviceDesiredProperty',
        version: 1,
      },
      json: true,
      body: {
        "project_id": ctx.state.projectID1,
        "product_id": product_id,
        "device_name": device_name,
        "params": [
          "tempL",
          "tempU",
        ]
      }
    }, function (error, response, body) {
      resolve(response.body.data);
    })
  });//return
  return rsp
}
module.exports = { getGroupIDs, getAllGroupIDs, getDevices, getAllDevices ,getTempDesired}