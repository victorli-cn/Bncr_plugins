/**
 *  @author victor_li
 *  @name lsp
 *  @origin VICTOR
 *  @version 1.0.0
 *  @description lsp
 *  @rule lsp
 *  @admin false
 *  @public false
 *  @priority 99999
 *  @disable false
 */

module.exports = async s => {
	/* HideStart */
	s.delMsg(s.getMsgId(), { wait: 1})
    const request = require('util').promisify(require('request'))
	let url = "https://api.linhun.vip/api/Littlesistervideo?type=json&apiKey=9eb1eb9717799ab32f6e4fa487b80074"
	let res = await request({
		url: url,
		json: true
	})
	let videourl = res.body['video']
	s.delMsg(s.getMsgId(), { wait: 5})
	await s.delMsg()
	await s.reply({
		type: "video",
		path:videourl
	})
	/* HideEnd */
};