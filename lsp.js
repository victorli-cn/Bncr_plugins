/**
 *  @author victor_li
 *  @name lsp
 *  @origin VICTOR
 *  @version 1.0.0
 *  @description lsp
 *  @rule ^lsp$
 *  @admin false
 *  @public false
 *  @priority 99999
 *  @disable false
 */

const axios = require('axios').default
module.exports = async s => {
	s.delMsg(s.getMsgId(), { wait: 3})
	let url = "http://api.xn--7gqa009h.top/api/xjjtw"
	let res = await axios.request({
		url: url,
		json: true
	})
	console.log(res.data)
	let videourl = res.data.video.url
	await s.reply({
		type: "video",
		path:videourl
	})
}
