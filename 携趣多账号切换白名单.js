/**
 * @author VICTOR_LI
 * @name 更换代理白名单
 * @origin VICTOR
 * @version 1.0.2
 * @description 代理更换白名单
 * @rule ^(xq|携趣)$
 * @cron 9 *\/10 * * * *
 * @admin true
 * @public false
 * @priority 1000
 */
//填写携趣的uid和ukey；name随便写，方便识别
let xq_info = [
	{
	name: "",
		uid: "",
		ukey: ""
	},
	{
	
		name: "",
		uid: "",
		ukey: ""
	},
	{
		name: "",
		uid: "",
		ukey: ""
	}
]
var xqdata = JSON.stringify(xq_info)

const axios = require("axios").default
module.exports = async s => {
	const up_white = new BncrDB("up_white")
	var get_url = await up_white.get("url")
	var get_ip = await up_white.get("ip")
	if(get_url) {
		let public_ip = await axios.request({
			url: get_url
		})
		console.log(public_ip.data)
		await s.reply("提取到公网ip:" + public_ip.data)
		var get_ip = public_ip.data
		console.log('get_ip:' + get_ip)
		if(get_ip) {
			for(var i = 0; i < xq_info.length; i++) {
				console.log(JSON.parse(xqdata)[i]['uid'] + ":" + JSON.parse(xqdata)[i]['ukey'])
				let get_proxy = await get_proxynum(JSON.parse(xqdata)[i]['uid'], JSON.parse(xqdata)[i]['ukey'])
				if(get_proxy == "ERR#Null") {
					await s.reply({
						msg: JSON.parse(xqdata)[i]['name'] + "代理已用完，更换白名单！",
						dontEdit: true
					})
					let del_white = await del_whitelist(JSON.parse(xqdata)[i]['uid'], JSON.parse(xqdata)[i]['ukey'], get_ip)
					if(del_white == "success") {
						await s.reply({
							msg: JSON.parse(xqdata)[i]['name'] + "删除白名单成功",
							dontEdit: true
						})						
					}
					let next_addwhite = await add_whitelist(JSON.parse(xqdata)[i+1]['uid'], JSON.parse(xqdata)[i+1]['ukey'], get_ip)
					if(next_addwhite == "success") {
						await s.reply({
							msg: JSON.parse(xqdata)[i+1]['name'] + "添加白名单成功",
							dontEdit: true
						})						
					}
					if(i+1 == xq_info.length) {
						var i = 0
					}
					await s.reply({
						msg: "更换成功，请使劲造吧！",
						dontEdit: true
						})
				}
			}
		}		
	}
	else {
		return await s.reply("没有设置提取公网ip网址或者公网ip，请通过命令设置 set up_white url http://127.0.0.1 或者 set up_white ip 127.0.0.1")
	}
}

async function del_whitelist(uid, ukey, ip) {
	let del_w = await axios.request({
		url: "http://op.xiequ.cn/IpWhiteList.aspx?uid=" + uid + "&ukey=" + ukey
 + "&act=del&ip=" + ip
	});
	console.log('del_whitelist:' + del_w)
	if(del_w.data == "success") {
		return del_w.data
	}
	else {
		return s.reply({
			msg: del_w.data,
			dontEdit: true
		})
	}
};
async function add_whitelist(uid, ukey, ip) {
	let add_w = await axios.request({
		url: "http://op.xiequ.cn/IpWhiteList.aspx?uid=" + uid + "&ukey=" + ukey
 + "&act=add&ip=" + ip
	});
	console.log('add_whitelist:' + add_w)
	if(add_w.data == "success") {
		return add_w.data
	}
	else {
		return sender.reply({
			msg: add_w.data,
			dontEdit: true
		})
	}
};
async function get_proxynum(uid, ukey) {
	//代理提取信息
	var num = ""
	let proxynum = await axios.request({
		url: "http://op.xiequ.cn/ApiUser.aspx?act=suitdt&uid=" + uid + "&ukey=" + ukey,
		json: true
	});
	console.log('proxynum:' + proxynum)
	console.log('get_proxynum:' + proxynum.data)
	if(proxynum.data == "ERR#Null") {
		return proxynum.data
	}
	else {
		return await sender.reply("剩余代理：" + proxynum.data.data[0].use)
	}
};
