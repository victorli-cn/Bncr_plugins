/**
 *  @author victor_li
 *  @name 疯狂星期四语录
 *  @origin VICTOR
 *  @version 1.0.0
 *  @description lsp
 *  @rule ^(疯狂星期四)$
 *  @admin false
 *  @public false
 *  @priority 99999
 *  @disable false
 *  @cron 16 3 10 * * *
 */

module.exports = async s => {
	//填写定时要发送的平台
	var platform = 'HumanTG'
	//填写定时要发送的群id【群id和用户id必填一个，否则周四不推送】
	var groupid=''
	//填写定时要发送的用户id
	var userid=''
	s.delMsg(s.getMsgId(), { wait: 1})
	const axios = require('axios').default
	let week_url = "https://www.mxnzp.com/api/holiday/single/20181121?ignoreHoliday=false&app_id=cwclhnmhw2vgojdo&app_secret=WkhnOXhKMlhOaFo5WndsNE5QUTRRdz09"
	let week_res = await axios.request({
		url: week_url,
		json: true
	})
	//let weekday_rule = /星期[\s\S]/g
	//let weekday = week_res.data.text.match(weekday_rule)
	console.log(week_res.data)
	let num_max = week_res.data.data.weekDay
	console.log(num_max)
	let url = "https://kfc-crazy-thursday.vercel.app/api/index"
	let res = await axios.request({
		url: url
	})
	let result = res.data
	console.log(res.data)
	if(s.getFrom() == "cron") {
		if(num_max == "4") {
			sysMethod.push({
				platform: platform,
				groupId: groupid,
				userId: userid,
				msg: result
			})
		}
	}
	else {
		await s.reply(result)	
	}
};
