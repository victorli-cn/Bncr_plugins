/**
 * @name 实时油价
 * @rule ([^ \n]+)油价
 * @description 🐒这个人很懒什么都没有留下。
 * @author victor_li
 * @origin VICTOR
 * @version v1.0.0
 * @admin false
 * @disable false
 * @public false
 */
module.exports = async sender => {
	var s = sender
	const pro = sender.param(1)
	const request = require('util').promisify(require('request'));
	async function main() {
		var yj = await request({
			url : "http://api.tianapi.com/oilprice/index?key=1bcc67c0114bc39a8818c8be12c2c9ac&prov=" + encodeURI(pro),
			method: "get"
		})
		console.log(yj.body)
		var body = JSON.parse(yj.body)
		await s.reply("查询地区：" + body['newslist'][0]['prov'] + "\n零号柴油：" + body['newslist'][0]['p0'] + "\n92号汽油：" + body['newslist'][0]['p92'] + "\n95号汽油：" + body['newslist'][0]['p95'] + "\n98号汽油：" + body['newslist'][0]['p98'] + "\n更新时间：" + body['newslist'][0]['time'])
	}
	await main()
}