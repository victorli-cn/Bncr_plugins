/**
 * @name pro导入转换
 * @rule ^pro$
 * @rule 【JD_R_WSCK】([\s\S]+)*添加成功
 * @description 🐒这个人很懒什么都没有留下。
 * @author victor_li
 * @origin VICTOR
 * @platform HumanTG
 * @version v1.0.0
 * @admin true
 * @disable false
 * @priority 99999
 * @public false
 */
 
module.exports = async s => {
	const axios = require("axios").default
	const pro_auto = new BncrDB("pro_auto")
	//设置用户名密码
	let username = ""
	let password = ""
	//只需修改ip:port
	let url = "http://192.168.31.30:5016/admin"
	//登录url
	let login_url = url + "/login"
	//获取容器idurl
	let getid_url = url + "/container"
	//获取token
	let data = {
		username: username,
		password: password
	}
	let get_token = await axios.request({
		url: login_url,
		method: "post"
,
		data: data,
		headers: {
			"Content-Type": "application/json; charset=utf-8"
		}
,
		json: true
	})
	console.log(get_token)
	if(get_token.data.success == true) {
		let token = get_token.data.data.accessToken
		//token验证 
		let Authorization = "Bearer " + token
		//获取容器id
		let get_id = await axios.request({
			url: getid_url,
			method: "get",
			headers: {
				"Authorization": Authorization
			}
		})
		if(get_id.data.data.length > 2 && await pro_auto.get("id") == null) {
			for(var i = 1; i < get_id.data.data.length; i++) {
				await s.reply({
					msg: get_id.data.data[i].name + "[id]:" + get_id.data.data[i].id,
					dontEdit: true
				})
			}
			return await s.reply("请设置要自动导入转换的容器id\n命令 set pro_auto id ***\n设置成功后发送'pro'测试[只支持单容器id设置]")
		}
		else {
			var container_id = await pro_auto.set("id", get_id.data.data[1].id, { def: '设置成功' })
		}
		console.log(container_id)
		//导入url
		let import_url = url + "/importEnvByPanel/" + await pro_auto.get("id")
		//导入容器
		let import_str = await axios.request({
			url: import_url,
			method: "get",
			headers: {
				"Authorization": Authorization
			}
		})
		if(import_str.data.success == true) {
			await s.reply("导入成功~")
			//批量转换url
			let convert_url = url + "/containerconver/" + await pro_auto.get("id")
			//批量转换
			let auto_convert = await axios.request({
				url: convert_url,
				method: "get",
				headers: {
					"Authorization": Authorization
				}
			})
			if(auto_convert.data.success == true) {
				await s.reply(auto_convert.data.message)
			}
			else {
				await s.reply("转换出错啦~")
			}
		}
		else {
			await s.reply("导入失败~")
		}
		
	}
	else {
		return s.reply("请检查配置是否错误~")
	}
}
