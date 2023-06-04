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
//设置剩余代理数量最低多少切换白名单
let proxy_num = "10"
//更换白名单成功后推送设置；用户和群组最少要设置一个
//推送用户
let userid = ""
//推送群组
let groupid = ""
//推送平台
let platform = "HumanTG"
var xqdata = JSON.stringify(xq_info)

const axios = require("axios").default
module.exports = async s => {
	const up_white = new BncrDB("up_white")
	var get_url = await up_white.get("url")
	var isCron = s.getFrom() == "cron"
	if(get_url) {
		let public_ip = await axios.request({
			url: get_url
,
			timeout: 20*1000
		})
		var get_ip = public_ip.data
		console.log('get_ip:' + get_ip)
		if(get_ip) {
			for(var i = 0; i < xq_info.length; i++) {
				let get_proxy = await get_proxynum(JSON.parse(xqdata)[i]['uid'], JSON.parse(xqdata)[i]['ukey'], JSON.parse(xqdata)[i]['name'])
				let get_white = await get_whitelist(JSON.parse(xqdata)[i]['uid'], JSON.parse(xqdata)[i]['ukey'])				
				if(get_white != "none") {
					if(get_proxy == "ERR#Null") {
						await s.reply(JSON.parse(xqdata)[i]['name'] + "代理已用完")
						await s.reply("提取到公网ip:" + get_ip + " 白名单ip:" + get_white)
						await s.reply(JSON.parse(xqdata)[i]['name'] + "白名单存在或者ip已变，更换白名单！")
						let del_white = await del_whitelist(JSON.parse(xqdata)[i]['uid'], JSON.parse(xqdata)[i]['ukey'])
						if(del_white == "success") {
							await s.reply(JSON.parse(xqdata)[i]['name'] + "删除白名单成功")						
						}
						if((i+1) == xq_info.length) {
							let one_proxy = await get_proxynum(JSON.parse(xqdata)[0]['uid'], JSON.parse(xqdata)[i]['ukey'], JSON.parse(xqdata)[0]['name'])
							if(one_proxy != "ERR#Null") {
								let one_addwhite = await add_whitelist(JSON.parse(xqdata)[0]['uid'], JSON.parse(xqdata)[0]['ukey'], get_ip)
								if(one_addwhite == "success") {
									await s.reply(JSON.parse(xqdata)[0]['name'] + "添加白名单成功")						
								}								
							}
							else {
								if(isCron) {
									return sysMethod.push({
										platform: platform,
										userId: userid,
										groupId: groupid,
										msg: "你的代理已全部用完！"
									})							
								}
								else {
									return await s.reply("你的代理已全部用完！")	
								}
							}							
						}
						else {
							let next_addwhite = await add_whitelist(JSON.parse(xqdata)[i+1]['uid'], JSON.parse(xqdata)[i+1]['ukey'], get_ip)
							if(next_addwhite == "success") {
								await s.reply(JSON.parse(xqdata)[i+1]['name'] + "添加白名单成功")						
							}							
						}
						if(isCron) {
							sysMethod.push({
								platform: platform,
								userId: userid,
								groupId: groupid,
								msg: "更换白名单成功，请使劲造吧！"
							})							
						}
						else {
							await s.reply("更换白名单成功，请使劲造吧！")	
						}						
					}
					else {
						if(get_ip.indexOf(get_white) == -1) {
							await s.reply(JSON.parse(xqdata)[i]['name'] + "ip已变，更换白名单！")
							let de_white = await del_whitelist(JSON.parse(xqdata)[i]['uid'], JSON.parse(xqdata)[i]['ukey'])
							if(de_white == "success") {
								await s.reply(JSON.parse(xqdata)[i]['name'] + "删除白名单成功")						
							}
							let up_addwhite = await add_whitelist(JSON.parse(xqdata)[i]['uid'], JSON.parse(xqdata)[i]['ukey'], get_ip)
							if(up_addwhite == "success") {
								if(isCron) {
									sysMethod.push({
									platform: platform,
									userId: userid,
									groupId: groupid,
									msg: JSON.parse(xqdata)[i]['name'] + "ip已变并更新白名单成功"
									})							
								}
								else {
									await s.reply(JSON.parse(xqdata)[i]['name'] + "ip已变并更新白名单成功")	
								}													
							}														
						}						
					}

				}
			}
		}
		else {
			return await s.reply("没有提取到公网ip,请检查设置的网址是否正常;命令 get up_white url")
		}		
	}
	else {
		return await s.reply("没有设置提取公网ip网址，请通过命令设置 set up_white url http://127.0.0.1")
	}


async function del_whitelist(uid, ukey) {
	var del_w = await axios.request({
		url: "http://op.xiequ.cn/IpWhiteList.aspx?uid=" + uid + "&ukey=" + ukey
 + "&act=del&ip=all"
	});
	if(del_w.data == "success") {
		return del_w.data
	}
	else {
		return s.reply(del_w.data)
	}
};
async function add_whitelist(uid, ukey, ip) {
	var add_w = await axios.request({
		url: "http://op.xiequ.cn/IpWhiteList.aspx?uid=" + uid + "&ukey=" + ukey
 + "&act=add&ip=" + ip
	});
	if(add_w.data == "success") {
		return add_w.data
	}
	else {
		return s.reply(add_w.data)
	}
};
async function get_proxynum(uid, ukey, name) {
	//代理提取信息
	var proxynum = await axios.request({
		url: "http://op.xiequ.cn/ApiUser.aspx?act=suitdt&uid=" + uid + "&ukey=" + ukey,
		json: true
	});
	if(proxynum.data == "ERR#Null" || (+(proxynum.data.data[0].num) - +(proxynum.data.data[0].use)) == +(proxy_num) || (+(proxynum.data.data[0].num) - +(proxynum.data.data[0].use)) < +(proxy_num)) {
		await s.reply({msg: name + "代理已用完或者达到更换条件~", dontEdit: true})
		return "ERR#Null"
	}
	else {
		return await s.reply({
			msg: name + "剩余代理：" + ((proxynum.data.data[0].num) - +(proxynum.data.data[0].use)),
			dontEdit: true
		})
	}
};
async function get_whitelist(uid, ukey) {
	var get_w = await axios.request({
		url: "http://op.xiequ.cn/IpWhiteList.aspx?uid=" + uid + "&ukey=" + ukey + "&act=get"
	});
	if(get_w.data.length > 1) {
		console.log("get_white:" + get_w.data)
		return get_w.data
	}
	else {
		console.log("get_white:none")
		return "none"
	}
};
}
