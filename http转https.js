/**
 * @author victor_li
 * @origin VICTOR
 * @name http转https
 * @version 1.0.5
 * @description http转https
 * @rule ^(http://[a-zA-Z0-9/?=&_.-]*)$
 * @admin false
 * @public false
 * @priority 99
 * @disable false
 */

module.exports = async s => {
	let http = s.param(1)
	let https = http.replace('http','https')
//	sysMethod.push({
		//platform: "HumanTG",
		//groupId: "-1001370020136",
		//userId: "5175100029",
		//msg: https
	//})
	await s.inlineSugar(https)
	return 'next'
}
