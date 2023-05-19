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
 */

module.exports = async s => {
	s.delMsg(s.getMsgId(), { wait: 3})
    const axios = require('axios').default
	let url = "https://api.a20safe.com/api.php?api=7&key=7e361498f6839db596c34a84392b7461"
	let res = await axios.request({
		url: url,
		json: true
	})
	let result = res.data.data[0].result
	await s.reply(result)
};