var mysqlAPI = require('../mysql/mysqlAIP');

let updateWEBDeviceAlarm = async (device, temp, limit, update_time, time, upper_or_lower) => {
  let notice_template = `设备${device}于${time}触发报警,温度${temp}℃,${upper_or_lower == "upper" ? "上限" : "下限"}${limit}℃,请及时处理`
  console.log(notice_template);
  let username = await mysqlAPI.getUserNameFromDevice(device)
  console.log(username);
  let timestr = String(update_time.getFullYear()).padStart(4, '0') +
    String(update_time.getMonth() + 1).padStart(2, '0') +
    String(update_time.getDate()).padStart(2, '0') +
    String(update_time.getHours()).padStart(2, '0') +
    String(update_time.getMinutes()).padStart(2, '0') +
    String(update_time.getSeconds()).padStart(2, '0');
  mysqlAPI.updateNoticeToMYSQL(username, "alert", "设备温度报警", notice_template, timestr, 0, 0, 'https://img.anlengyun.com/jinggao.png', null, null);
}

let updateNotice = async (title, desc, ad_url, ad_img) => {
  let usernames = await mysqlAPI.getAllUserName()
  let now = new Date()
  let timestr = String(now.getFullYear()).padStart(4, '0') +
    String(now.getMonth() + 1).padStart(2, '0') +
    String(now.getDate()).padStart(2, '0') +
    String(now.getHours()).padStart(2, '0') +
    String(now.getMinutes()).padStart(2, '0') +
    String(now.getSeconds()).padStart(2, '0');
  for (let user of usernames) {
    let ad_res = await mysqlAPI.updateNoticeToMYSQL(
      user.username, "notice", title, desc, timestr, 0, 0,
      'https://img.anlengyun.com/biaoqian.png',
      ad_url,
      ad_img);
  }
}
module.exports = { updateWEBDeviceAlarm }