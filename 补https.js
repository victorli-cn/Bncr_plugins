/**
 * @author victor_li
 * @origin VICTOR
 * @name 补https
 * @version 1.0.5
 * @description 补https
 * @rule ^([a-z.A-Z0-9-/?=]*)$
 * @admin false
 * @public false
 * @priority 99
 * @disable false
 */

module.exports = async s => {
	let http = s.param(1)
	let https = "https://" + http
	await s.inlineSugar(https)
	return 'next'
}
