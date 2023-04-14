/**
 * @author victor_li
 * @name 点歌MV版
 * @origin 胜利者
 * @version 1.0.0
 * @description 点歌MV版
 * @rule ^mv([^\n]+)$
 * @admin false
 * @disable false
 */
 
module.exports = async s => {
	const axios = require("axios").default
	let par = encodeURIComponent(s.param(1)) 
	console.log(par)
	let url = "https://api.linhun.vip/api/kuwomv?apiKey=ffe15a31488bf5f5e717fe8e152b2470&name=" + par
	let res = await axios.request({
		url: url,
		json: true
	})
	var mv_name = ""
	if(res.data.data.length > 1) {
		for(var i = 0; i < res.data.data.length; i++) {
			var mv_name = mv_name + res.data.data[i].name + "\n"
		}
	}
	await s.reply(mv_name + "请在20秒内输入序号：")
	let newMsg =  await s.waitInput(()=> {}, 20)
	let text = newMsg.getMsg()
	let mv = await axios.request({
		url: url + "&n=" + text,
		json: true
	})
	if(mv.data.code == 200) {
		console.log(mv.data)
		await s.reply({
			type: "video",
			path: mv.data.data.mp4
		})
	}
	else {
		return await s.reply("接口异常~")
	}

}