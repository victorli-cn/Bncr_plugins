/**
 * @author victor_li
 * @origin VICTOR
 * @name 补https
 * @version 1.0.5
 * @description 补https
 * @rule ^([:a-z.A-Z0-9-&/? =]*)$
 * @admin false
 * @public false
 * @priority 99
 * @disable false
 */

module.exports = async s => {
	let http = s.param(1)
	let http_str = http.split(/[\t\r\f\n\s]*/g).join('')
	console.log(http_str)
	if(http_str.indexOf('https://') != -1) {
		return await s.inlineSugar(http_str)
	}
	else if(http_str.indexOf('://') != -1){
		let https = "https" + http_str
		return await s.inlineSugar(https)
	}
	else if(http_str.indexOf('//') != -1){
		let https = "https:" + http_str
		return await s.inlineSugar(https)
	}	
	else {
		let https = "https://" + http_str
		return await s.inlineSugar(https)
	}	
	return 'next'
}
