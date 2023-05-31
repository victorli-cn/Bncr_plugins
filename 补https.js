/**
 * @author victor_li
 * @origin VICTOR
 * @name 补https
 * @version 1.0.5
 * @description 补https
 * @rule ^([A-Za-z0-9\-\._~:\/\?#\[\]@!$&'\*\+,%;\= ]*)$
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
	else if(http_str == "https"){
		return
	}	
	else {
		let https = "https://" + http_str
		return await s.inlineSugar(https)
	}
	await sysMethod.sleep(5);
	return 'next'	
}
