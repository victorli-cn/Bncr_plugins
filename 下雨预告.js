/**
 * @name 下雨预告
 * @rule 下雨
 * @description 🐒这个人很懒什么都没有留下。
 * @author victor_li
 * @origin VICTOR
 * @cron 0 1 18 * * *
 * @version v1.0.0
 * @admin false
 * @disable false
 * @public false
 
 
 使用说明：
 定时规则根据自己的需求设置
 注册账号地址：https://id.qweather.com/
 设置key： set rain key ***  https://console.qweather.com/#/apps,添加key
 设置当地城市经纬度：set rain location 111.11,222.22 最多两位小数
 设置推送平台： set rain push tg
 设置接收用户id: set rain userid 123456789或者 set rain userid 12345&56789
 【选填】
 设置接收群组id: set rain groupid 12345678
 */

module.exports = async sender => {
	var axios = require("axios").default;
	var s = sender
	const rain = new BncrDB("rain")
	var city = await rain.get("city")
	var key = await rain.get("key")
	var url = "https://devapi.qweather.com/v7/minutely/5m?location="
	var url = url + city + "&key=" + key
	console.log(url)
	var rains = {
		url: url,
		method: "GET",
		timeout: 20000,
		json: true,
	}
	var data = (await axios.request(rains)).data
	console.log(data)
	// 是否定时任务
	var isCron = s.getFrom() == "cron"
	if(isCron) {
		sysMethod.push({
			platform: "wxXyo",
			userId: "PangHuang1314",
			msg: "【下雨提示】\n" + data.summary
		})
	}
	else {
		await s.reply("【下雨提示】\n" + data.summary)
	}
}
