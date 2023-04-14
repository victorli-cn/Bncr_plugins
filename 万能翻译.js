/**
 * @author victor_li
 * @name 万能翻译
 * @origin 胜利者
 * @version 1.0.0
 * @description 博天api支持28种语言翻译
 * @rule ^(fy|翻译)([^\n]+)$
 * @admin false
 * @disable false
 */

module.exports = async s => {
	/* HideStart */
	const axios = require("axios").default
	let par = encodeURI(s.param(2))
	let res = await axios.request({
		url: "http://www.plapi.tk/api/fanyi.php?msg=" + par,
		method: "GET",
		json: true
	})
	if(res.status == 200) {
		console.log(res)
		let data = res.data.replace('有道翻译查询结果', '')
		await s.reply(data)
	}
	else {
		return await s.reply("接口异常~")
	}

	/* HideEnd */	
}