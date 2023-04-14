/**
 * @name haiwaikan
 * @rule hwk
 * @description 🐒这个人很懒什么都没有留下。
 * @author victor_li
 * @origin 胜利者
 * @cron 0 26,56 * * * *
 * @version v1.0.0
 * @admin false
 * @disable true
 * @public false
 */
module.exports = async sender => {
	const s = sender
	var count = 0
	var userid = "1504969755"
	var isCron = s.getFrom() == "cron"
	const request = require('util').promisify(require('request'));
	async function main() {
		count++
		let re = await request({
			url: "http://yingshiku.cf/api.php/timming/index.html?enforce=1&name=haiwaikan",
			timeout: 12000,
			method: "get"
		})
		if(re.body != null) {
			//正则提取
			var title_rule = /任务：[\u4e00-\u9fa5，a-z:A-Z0-9 ：-]*---执行/
			var gx_rule = /((?!、).)+[\u4e00-\u9fa5() 0-9a-zA-Z，]*ok。/g
			var end_rule = /[\u4e00-\u9fa5]*完成。/
			var title = re.body.match(title_rule)
			var gx = re.body.match(gx_rule)
			var end = re.body.match(end_rule)
			if(!gx) {
				var tips = "本次无影片更新!"
				var info = ""
			}
			else {
				var info = String(gx).replace(/<font color='green'>/g,"").replace(/更新ok。,/g,"更新ok。\n").replace(/成功ok。,/g,"成功ok。\n").replace(/新增ok。,/g,"新增ok。\n")
				var tips = "本次更新影片如下："
			}
			//数据筛选
			var msg = "[影视库资源更新]\n" + title + "\n" + tips + "\n" +  info + "\n" + end
			if(!isCron) {
				await s.reply(msg)
			}
			else {
				sysMethod.push({ 
					platform: "tgBot",
					userId: userid,
					msg: msg,
				})
			}
		}
		else {
			if(count < 3) {
				sysMethod.push({ 
					platform: "tgBot",
					userId: userid,
					msg: "请求失败，第" + count + "次重试…",
            })
            await main()
			}
			else {
				sysMethod.push({ 
					platform: "tgBot",
					userId: userid,
					msg: count + "次请求失败，请检查网站是否异常",
				})            
			}
		}
	}
	await main()
}




