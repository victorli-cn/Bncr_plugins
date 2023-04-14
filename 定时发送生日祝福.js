/**
 * @name 基本测试
 * @rule ^cs$
 * @description 🐒这个人很懒什么都没有留下。
 * @author victor_li
 * @origin 胜利者
 * @version v1.0.0
 * @cron 0 16 3 25 4 *
 * @admin true
 * @disable false
 * @public false
 */
 
module.exports = async s => {
	var isCron = s.getFrom() == "cron"
	if(isCron) {
		sysMethod.push({
			platform: "wxXyo",
			userId: "PangHuang1314",
			type: "video",
			path: "C:\\Users\\Public\\Videos\\happybirthday.mp4"
		})
	}
	else {
		await s.reply({
			type: "video",
			path: "C:\\Users\\Public\\Videos\\happybirthday.mp4"
		})		
	}
}