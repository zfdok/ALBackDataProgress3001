const { query } = require("../mysql/query"); //引入异步查询方法
const { QUERY_A_DATA, QUERY_A_DATA_BY_WHERE, UPDATE_DATA, UPDATE_DATAS,
  INSERT_DATA, INSERT_DATAS, QUERY_DATAS_BY_WHERE,
  QUERY_DATAS_BY_WHERE_ORDER_BY_WHAT_DESC,
  QUERY_A_DATA_BY_WHERES
} = require("../mysql/sql"); //部分引入sql库

//------------------------每日更新-------------------------------//
//更新每日短信限额
let updateSmsDayCountDaily = async (deviceInfo) => {
  let query_limit = await query(QUERY_A_DATA_BY_WHERE("alyun.users", "user_group_id", `${deviceInfo.group_id}`, "sms_day_limit"))
  query_res = await query(UPDATE_DATAS("alyun.users", `sms_day_count = ${query_limit[0].sms_day_limit}`, "user_group_id", `'${deviceInfo.group_id}'`));
}
//更新devices数据表的前几项要素
let updateDeviceAndGroupInfo = async (deviceInfo) => {
  let query_device_exist = await query(QUERY_A_DATA_BY_WHERE("alyun.devices", "device_name", deviceInfo.device_name, "user_group_id"));
  let query_res
  if (query_device_exist[0]) {
    query_res = await query(UPDATE_DATAS("alyun.devices", `user_group_id = '${deviceInfo.group_id}',product_id='${deviceInfo.product_id}'`, "device_name", `'${deviceInfo.device_name}'`));//异步方法调用
  } else {
    query_res = await query(INSERT_DATA(
      "alyun.devices",
      "device_name,user_group_id,product_id",
      `'${deviceInfo.device_name}','${deviceInfo.group_id}','${deviceInfo.product_id}'`
    ));//异步方法调用
  }
  console.log(query_res);
  return query_res;
}
let updateDeviceDayCountDaily = async (device_name, day = 0) => {
  let device_day_left = 0
  if (day == 0) {
    let res = await query(QUERY_A_DATA_BY_WHERE("alyun.devices", "device_name", `${device_name}`, "day_left"))
    if (!res.length) return false
    device_day_left = res[0].day_left
    device_day_left--
  }
  else {
    device_day_left = day
  }
  if (device_day_left >= 0) {
    let query_res = await query(UPDATE_DATA(
      "alyun.devices",
      "day_left", device_day_left,
      "device_name", `'${device_name}'`))
  }
  return true
}
//------------------------验证码相关-------------------------------//
// 写入验证码
let update_sms_code = async (username, code) => {
  console.log(username);
  console.log(code);
  let query_res = await query(UPDATE_DATAS("alyun.users", `sms_code = '${code}'`, "username", `'${username}'`));//异步方法调用
  return query_res
}
// 读取验证码
let sql_sms_code = async (username) => {
  console.log(username);
  let query_res = await query(QUERY_A_DATA_BY_WHERE("alyun.users", "username", `${username}`, `sms_code`));//异步方法调用
  return query_res[0].sms_code
}
//------------------------用户相关-------------------------------//
// 获取所有用户ID
let getAllUserName = async () => {
  return await query(QUERY_A_DATA("alyun.users", `username`));
}
// 从DeviceName获取用户ID
let getUserNameFromDevice = async (deviceName) => {
  let group_id = await query(QUERY_A_DATA_BY_WHERE("alyun.devices", "device_name", deviceName, "user_group_id"));//异步方法调用
  let query_res = await query(QUERY_A_DATA_BY_WHERE("alyun.users", "user_group_id", group_id[0].user_group_id, "username"));//异步方法调用
  return query_res[0].username;
}
let getUserPhones = async (username) => {
  let phones = await query(QUERY_A_DATA_BY_WHERE("alyun.users", "username", username, "alert_phones"))
  return phones[0].alert_phones
}
//------------------------短信报警相关-------------------------------//
//查询用户设定的短信报警时间
let getSmsSpanFromDevice = async (deviceName) => {
  let group_id = await query(QUERY_A_DATA_BY_WHERE("alyun.devices", "device_name", deviceName, "user_group_id"));//异步方法调用
  let query_res = await query(QUERY_A_DATA_BY_WHERE("alyun.users", "user_group_id", group_id[0].user_group_id, "sms_span"));//异步方法调用
  return query_res[0].sms_span
}
//设置用户的短信额度
let setSmsAccountFromDevice = async (deviceName, smsNo, smsDayCount) => {
  let group_id = await query(QUERY_A_DATA_BY_WHERE("alyun.devices", "device_name", deviceName, "user_group_id"));//异步方法调用
  let query_res = await query(UPDATE_DATAS("alyun.users", `sms_account=${smsNo},sms_day_count=${smsDayCount}`, "user_group_id", `'${group_id[0].user_group_id}'`));//异步方法调用
  return query_res
}
//获取用户的短信条数余额
let getSmsAccountFromDevice = async (deviceName) => {
  let group_id = await query(QUERY_A_DATA_BY_WHERE("alyun.devices", "device_name", deviceName, "user_group_id"));//异步方法调用
  let query_res = await query(QUERY_DATAS_BY_WHERE("alyun.users", "user_group_id", group_id[0].user_group_id, "sms_account"));//异步方法调用
  return query_res[0]
}
//从设备名获取用户的报警电话号码
let getPhoneNumberFromDevice = async (deviceName) => {
  let group_id = await query(QUERY_A_DATA_BY_WHERE("alyun.devices", "device_name", deviceName, "user_group_id"));//异步方法调用
  let query_res = await query(QUERY_A_DATA_BY_WHERE("alyun.users", "user_group_id", group_id[0].user_group_id, "phone"));//异步方法调用
  let phoneNum = query_res[0].phone
  if (phoneNum.indexOf("+86") == -1) {
    phoneNum = "+86".concat(phoneNum)
  }
  return phoneNum
}
//------------------------更新设备数据相关-------------------------------//
//数据流转设备历史记录
let setDeviceHistory = async (device_name, device_info, device_type) => {
  if (device_type == "zx") {
    let time1 = new Date(device_info.timestamp)
    let timestr = String(time1.getFullYear()).padStart(4, '0') +
      String(time1.getMonth() + 1).padStart(2, '0') +
      String(time1.getDate()).padStart(2, '0') +
      String(time1.getHours()).padStart(2, '0') +
      String(time1.getMinutes()).padStart(2, '0') +
      String(time1.getSeconds()).padStart(2, '0')
    let query_res = await query(INSERT_DATA(
      "alyun.zx_device_history",
      "device_name,timestamp,temp,humi,le,ln,tempUA,tempLA",
      `'${device_name}',${timestr},${device_info.temp},${device_info.humi},${device_info.le},${device_info.ln},${device_info.tempUA},${device_info.tempLA}`
    ));//异步方法调用
  } else if (device_type == "zhlk") {
    let time1 = new Date(device_info.timestamp)
    let timestr = String(time1.getFullYear()).padStart(4, '0') +
      String(time1.getMonth() + 1).padStart(2, '0') +
      String(time1.getDate()).padStart(2, '0') +
      String(time1.getHours()).padStart(2, '0') +
      String(time1.getMinutes()).padStart(2, '0') +
      String(time1.getSeconds()).padStart(2, '0')
    let query_res = await query(INSERT_DATA(
      "alyun.zhlk_device_history",
      "device_name,timestamp,temp,humi,le,ln,tempUA,tempLA",
      `'${device_name}',${timestr},${device_info.temp},${device_info.humi},${device_info.le},${device_info.ln},0,0`
    ));//异步方法调用
  }
}
//数据流转补充设备历史记录报警部分
let updateDeviceAlarmHistory = async (device_name, device_info, device_type, tempUA, tempU, tempLA, tempL) => {
  if (device_type == "zx") {
    let time1 = new Date(device_info.timestamp)
    let timestr = String(time1.getFullYear()).padStart(4, '0') +
      String(time1.getMonth() + 1).padStart(2, '0') +
      String(time1.getDate()).padStart(2, '0') +
      String(time1.getHours()).padStart(2, '0') +
      String(time1.getMinutes()).padStart(2, '0') +
      String(time1.getSeconds()).padStart(2, '0')
    let query_res = await query(UPDATE_DATAS(
      "alyun.zx_device_history",
      `tempU=${tempU},tempL=${tempL}`,
      "timestamp",
      timestr
    ));//异步方法调用
  } else if (device_type == "zhlk") {
    let time1 = new Date(device_info.timestamp)
    let timestr = String(time1.getFullYear()).padStart(4, '0') +
      String(time1.getMonth() + 1).padStart(2, '0') +
      String(time1.getDate()).padStart(2, '0') +
      String(time1.getHours()).padStart(2, '0') +
      String(time1.getMinutes()).padStart(2, '0') +
      String(time1.getSeconds()).padStart(2, '0')
    let query_res = await query(UPDATE_DATAS(
      "alyun.zhlk_device_history",
      `tempU=${tempU},tempL=${tempL},tempUA=${tempUA},tempLA=${tempLA}`,
      "timestamp",
      timestr
    ));//异步方法调用
  }
}
//更新设备记录时间段
let updateDeviceRecTimerecord = async (device_name, device_info, device_type) => {
  if (device_type == "zx") {
    let time1 = new Date(device_info.start_time * 1000 - 2000)
    let timestr = String(time1.getFullYear()).padStart(4, '0') +
      String(time1.getMonth() + 1).padStart(2, '0') +
      String(time1.getDate()).padStart(2, '0') +
      String(time1.getHours()).padStart(2, '0') +
      String(time1.getMinutes()).padStart(2, '0') +
      String(time1.getSeconds()).padStart(2, '0');
    let query_res = await query(QUERY_A_DATA_BY_WHERES(
      "alyun.device_rec_timerecord",
      `start_time = ${timestr}`, "id"
    ))
    if (!query_res[0]) {
      let query_res_insert = await query(INSERT_DATA("alyun.device_rec_timerecord",
        "device_name,start_time,last_time",
        `'${device_name}',${timestr},${timestr}`))
    } else {
      let time_last = new Date(device_info.last_time * 1000 + 2000)
      let time_last_str = String(time_last.getFullYear()).padStart(4, '0') +
        String(time_last.getMonth() + 1).padStart(2, '0') +
        String(time_last.getDate()).padStart(2, '0') +
        String(time_last.getHours()).padStart(2, '0') +
        String(time_last.getMinutes()).padStart(2, '0') +
        String(time_last.getSeconds()).padStart(2, '0');
      let query_res2 = await query(UPDATE_DATA(
        "alyun.device_rec_timerecord",
        "last_time", time_last_str,
        "id", `${query_res[0].id}`))
    }
  }
  if (device_type == "zhlk") {
    if (device_info.start_time && device_info.last_time == 0) {
      let time1 = new Date(device_info.start_time)
      let timestr = String(time1.getFullYear()).padStart(4, '0') +
        String(time1.getMonth() + 1).padStart(2, '0') +
        String(time1.getDate()).padStart(2, '0') +
        String(time1.getHours()).padStart(2, '0') +
        String(time1.getMinutes()).padStart(2, '0') +
        String(time1.getSeconds()).padStart(2, '0');
      let query_res = query(INSERT_DATA("alyun.device_rec_timerecord",
        "device_name,start_time,last_time",
        `'${device_name}',${timestr},${timestr}`))
    }
    if (device_info.last_time) {
      let time_last = new Date(device_info.last_time)
      let time_last_str = String(time_last.getFullYear()).padStart(4, '0') +
        String(time_last.getMonth() + 1).padStart(2, '0') +
        String(time_last.getDate()).padStart(2, '0') +
        String(time_last.getHours()).padStart(2, '0') +
        String(time_last.getMinutes()).padStart(2, '0') +
        String(time_last.getSeconds()).padStart(2, '0');
      let query_res = await query(QUERY_DATAS_BY_WHERE_ORDER_BY_WHAT_DESC(
        "alyun.device_rec_timerecord",
        "device_name", `${device_name}`,
        "start_time", "DESC"));
      let query_res2 = await query(UPDATE_DATA(
        "alyun.device_rec_timerecord",
        "last_time", time_last_str,
        "id", `${query_res[0].id}`))
    }
  }
}
//更新设备记录时间段
let updateDeviceRecTimerecordLimit = async (device_name, device_info, device_type, tempU, tempL, period) => {
  if (device_type == "zx") {
    let time1 = new Date(device_info.start_time * 1000)
    let timestr = String(time1.getFullYear()).padStart(4, '0') +
      String(time1.getMonth() + 1).padStart(2, '0') +
      String(time1.getDate()).padStart(2, '0') +
      String(time1.getHours()).padStart(2, '0') +
      String(time1.getMinutes()).padStart(2, '0') +
      String(time1.getSeconds()).padStart(2, '0');
    let query_res = await query(QUERY_A_DATA_BY_WHERES(
      "alyun.device_rec_timerecord",
      `start_time = ${timestr}`, "id"
    ))

    await query(UPDATE_DATA(
      "alyun.device_rec_timerecord",
      "tempL", tempL,
      "id", `${query_res[0].id}`))
    await query(UPDATE_DATA(
      "alyun.device_rec_timerecord",
      "tempU", tempU,
      "id", `${query_res[0].id}`))
    await query(UPDATE_DATA(
      "alyun.device_rec_timerecord",
      "recspan", period,
      "id", `${query_res[0].id}`))
  }
}
//获取设备最新的数据
let getDeviceLastData = async (type, device_name) => {
  if (type == "zx") {
    let query_res = await query(QUERY_DATAS_BY_WHERE_ORDER_BY_WHAT_DESC("alyun.zx_device_history", "device_name", `${device_name}`, "timestamp", "DESC"))
    console.log(query_res[0]);
    return query_res[0]
  }
}
//更新设备WEB报警通知
let updateNoticeToMYSQL = async (username, type, title, desc, time, readed, first_show, icon, ad_url, ad_img) => {
  console.log(username, type, title, desc, time, readed, first_show, icon, ad_url, ad_img);
  let query_res
  switch (type) {
    case "alert":
      await query('set names utf8')
      query_res = await query(INSERT_DATA("alyun.user_notice",
        "`username`,`type`,`title`,`desc`,`time`,`readed`,`first_show`,`icon`",
        `'${username}','${type}','${title}','${desc}',${time},${readed},${first_show},'${icon}'`
      ))
      break
    case "notice":
      await query('set names utf8')
      query_res = await query(INSERT_DATA("alyun.user_notice",
        "`username`,`type`,`title`,`desc`,`time`,`readed`,`first_show`,`icon`,`ad_url`,`ad_img`",
        `'${username}','${type}','${title}','${desc}',${time},${readed},${first_show},'${icon}','${ad_url}','${ad_img}'`
      ))
      break
    default:
      break;
  }
  return query_res
}


// getDeviceLastData("zx", "al00014g0001")
//测试专用, 无意义
let test = async () => {
  let user_name = await getUserNameFromDevice("al00034g0100")
  console.log(user_name);
  let phones = await getUserPhones(user_name)
  console.log(phones);
  console.log(typeof phones);
  console.log(phones.length);
  JSON.parse(phones).forEach(phoneNum => {
    if (phoneNum != "") {
      console.log(phoneNum);
    }
  });
}

// test()

module.exports = {
  update_sms_code,
  sql_sms_code,
  updateDeviceAndGroupInfo,
  updateDeviceDayCountDaily,
  getUserNameFromDevice,
  getAllUserName,
  getDeviceLastData,
  getPhoneNumberFromDevice,
  getSmsAccountFromDevice,
  setSmsAccountFromDevice,
  getSmsSpanFromDevice,
  setDeviceHistory,
  updateDeviceAlarmHistory,
  updateSmsDayCountDaily,
  updateDeviceRecTimerecord,
  updateNoticeToMYSQL,
  updateDeviceRecTimerecordLimit,
  getUserPhones,
}