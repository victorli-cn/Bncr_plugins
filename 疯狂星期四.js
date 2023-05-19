/**
 *  @author victor_li
 *  @name 疯狂星期四语录
 *  @origin VICTOR
 *  @version 1.0.0
 *  @description lsp
 *  @rule ^(疯狂星期四)$
 *  @admin false
 *  @cron 0 30 10 * * *
 *  @public false
 *  @priority 99999
 *  @disable false
 */

module.exports = async s => {
	s.delMsg(s.getMsgId(), { wait: 1})
	const axios = require('axios').default
	let week_url = "https://api.f4team.cn/API/huang/api.php"
	let week_res = await axios.request({
		url: week_url,
		json: true
	})
	let weekday_rule = /星期[\s\S]/g
	let weekday = week_res.data.text.match(weekday_rule)
	console.log(weekday)
	let num_max = weekday[0].replace("星期", "")
	console.log(num_max)
	let url = "https://api.a20safe.com/api.php?api=7&key=7e361498f6839db596c34a84392b7461"
	let res = await axios.request({
		url: url,
		json: true
	})
	let result = res.data.data[0].result
	console.log(result)
	if(s.getFrom() == "cron") {
		if(num_max == "四") {
			sysMethod.push({
				platform: 'HumanTG',
				groupId: '-1001720712689',
				msg: result
			})
		}
	}
	else {
		await s.reply(result)	
	}
};
