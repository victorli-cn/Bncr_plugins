/**
 * @name 钉钉打卡提醒
 * @rule 打卡
 * @description 🐒这个人很懒什么都没有留下。
 * @author victor_li
 * @origin VICTOR
 * @version v1.0.0
 * @admin false
 * @disable false
 * @public false
 
 */

sysMethod.cron.newCron('0 55 8 * * MON-FRI', () => {
	sysMethod.push({
		platform: 'wxXyo',
		userId: 'PangHuang1314',
		msg: '现在立刻钉钉上班打卡~'
	})
})	
sysMethod.cron.newCron('0 5 18 * * MON-FRI', () => {
	sysMethod.push({
		platform: 'wxXyo',
		userId: 'PangHuang1314',
		msg: '现在立刻钉钉下班打卡~'
	})
})
sysMethod.cron.newCron('0 5 10 * * *', () => {
	sysMethod.push({
		platform: 'HumanTG',
		groupId: '-1001136215484',
		msg: '/checkin@fyssbot'
	})
})
sysMethod.cron.newCron('0 5 10 * * *', () => {
	sysMethod.push({
		platform: 'HumanTG',
		groupId: '-1001301342610',
		msg: '/checkin@GetfreeCloud_Bot'
	})
})

