/**
 * @author victor_li
 * @origin VICTOR
 * @name 淘宝买家秀
 * @version 1.0.5
 * @description 淘宝买家秀-韩小韩api
 * @rule mjx
 * @admin false
 * @public false
 * @priority 9999
 * @disable false
 */

module.exports = async s => {
	/* HideStart */
	const axios = require('axios').default
	s.delMsg(s.getMsgId(), { wait: 3})
	let res = await axios.request({
		url: "https://api.vvhan.com/api/tao?type=json",
		json: true
	})
	console.log(res)
	if(res.data) {
		let title = res.data.title
		let pic = res.data.pic
		await s.reply({
			type: "image",
			path: pic,
			msg: "【评价】" + title
		})
	}
	else {
		return await s.reply("接口访问异常(海外无法访问)~")
	}
	/* HideEnd */
}
