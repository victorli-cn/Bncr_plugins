/**
 * @name 网心容器魔方监测
 * @rule 网心
 * @description 🐒这个人很懒什么都没有留下。
 * @author victor_li
 * @origin 胜利者
 * @cron 0 *\/5 18-23 * * *
 * @version v1.0.0
 * @admin true
 * @disable false
 * @public false
 */

module.exports = async sender => {
	//设置网心地址和宽带上行
	var array_urls = [
		{"url": "http://192.168.31.30:18888", "uplink": 50}]
	//设置推送平台
	var platform = "HumanTG"
	//设置推送人员
	var userid = "1504969755"
	//设置推送群组
	var groupid = "-1001608132110"
	var s = sender
	var isCron = s.getFrom() == "cron"
	const request = require('util').promisify(require('request'));
	async function get_info() {
		let re = await request({
			url: array_url + "/docker/data", 
			method: "get",
			timeout: 20*1000
		})
		var version =  JSON.parse(re.body)['data']['device']['app_version']
		let res = await request({
			url: array_url + "/docker/dashboard",
			method: "get",
			timeout: 20*1000
		})
		if(res.body){
			//磁盘运行状态参数
			var ioutil = JSON.parse(res.body)['data']['resource']['ioutil']
			var ioutil_alarm = JSON.parse(res.body)['data']['resource']['ioutil_alarm']
			var load5 = JSON.parse(res.body)['data']['resource']['load5']
			var load5_alarm = JSON.parse(res.body)['data']['resource']['load5_alarm']
			var w_await = JSON.parse(res.body)['data']['resource']['w_await']
			var w_await_alarm = JSON.parse(res.body)['data']['resource']['w_await_alarm']
			var r_await = JSON.parse(res.body)['data']['resource']['r_await']
			var r_await_alarm = JSON.parse(res.body)['data']['resource']['r_await_alarm']
			//系统参数
			var cpu_num = +(JSON.parse(res.body)['data']['resource']['cpu_num'])
			var cpu_usage = +(JSON.parse(res.body)['data']['resource']['cpu_usage'])
			var cpu_usage_alarm = +(JSON.parse(res.body)['data']['resource']['cpu_usage_alarm'])
			var total_mem = +(JSON.parse(res.body)['data']['resource']['total_mem'])
			var used_mem = +(JSON.parse(res.body)['data']['resource']['used_mem'])
			var mem_alarm = +(JSON.parse(res.body)['data']['resource']['mem_alarm'])
			var disk_used = +(JSON.parse(res.body)['data']['resource']['disk_used'])
			var disk_total = +(JSON.parse(res.body)['data']['resource']['disk_total'])
			//获取业务数据
			var tasks_length = JSON.parse(res.body)['data']['run_tasks'].length
			var run_task = ""
			var task_speed = ""
			var run_disk = ""
			for(var i = 0; i < tasks_length; i++) { 
				var task_speed = +(task_speed) + +(JSON.parse(res.body)['data']['run_tasks'][i].speed)
				var run_disk = +(run_disk) + +(JSON.parse(res.body)['data']['run_tasks'][i]['disk'])
				var run_task = run_task + "\n业务：" + JSON.parse(res.body)['data']['run_tasks'][i]['name'] + " [" + JSON.parse(res.body)['data']['run_tasks'][i]['disk'] + "G] 速度：" + JSON.parse(res.body)['data']['run_tasks'][i]['speed'] + " Mbps"
			}
			var fgf = "============================"
			var task_disk =  "[" + run_disk + "G]"
			var speed_total = "\n" + tasks_length + "个业务" + task_disk + "：的总速度：" + task_speed.toFixed(3) + "Mbps"
			var disk_status = "\n磁盘运行状态：" + "\ni o u t i l：" + (ioutil*100).toFixed(1) + "%  【告警:" + (ioutil_alarm*100) +"%】\nl o a d 5：" + 
			load5.toFixed(1) +   "  【告警:" + load5_alarm + "】\n读await："  + w_await + "ms  【告警:" + w_await_alarm +"ms】\n写await：" + 
			r_await + "ms  【告警:" + r_await_alarm +"ms】\n"
			var system_status = "系统使用情况[" + version + "]：\n" + fgf + "\nC P U [" + cpu_num + "核]:【使用:" + Math.floor(cpu_usage*100) + "%】" + "【告警:" + cpu_usage_alarm.toFixed(1)*100 + "%】\n磁盘 [" + 
			disk_used + "/" + disk_total + "G]:【使用:" + (disk_used/disk_total*100).toFixed(1) + "%】\n内存[" + used_mem + "/" + total_mem + "MB]:【使用:" + (used_mem/total_mem*100).toFixed(1) + "%】【告警:" + 
			(mem_alarm*100) + "%】\n"
			if(isCron) {
				if((ioutil*1 > ioutil_alarm*1 || load5*1 > load5_alarm*1 || w_await*1 > w_await_alarm*1 || r_await*1 > r_await_alarm*1 || used_mem*1 > (total_mem*1)*(mem_alarm*1) || cpu_usage*1 > cpu_usage_alarm*1) && 
				task_speed*1 < uplink) {
					var alarm = "【网心业务磁盘性能超标告警】\n" + system_status + fgf + disk_status + fgf + speed_total
					return alarm
				}
				else if (task_speed*1 > uplink) {
					var total_speed = "【网心业务总上传速度超标提示】\n" + system_status + fgf  + disk_status + fgf + "\n业务运行状态：" + run_task + "\n" + fgf + speed_total
					return {
						"msg": total_speed,
						"task_speed": task_speed
					}
				}
				else {
					var tasktotal_speed = "业务总上传速度：" +  (task_speed*1).toFixed(3) + " Mbps"
					return {
						"msg": tasktotal_speed,
						"task_speed": task_speed
					}
				}
			}
			else {
				var data = system_status + fgf + disk_status + fgf + run_task + "\n" + fgf + speed_total
				return {
					"msg": data,
					"task_speed": task_speed
				}
			}
		}
		else {
			return {
				"msg": "无法访问容器，请检查网络和容器是否正常~",
				"task_speed": 0
				}
		}
	}
	var total_speed = ""
	for(var i = 0; i < array_urls.length; i++) {
		var array_url = array_urls[i]["url"]
		var uplink = array_urls[i]["uplink"]
		var wx = await get_info(uplink)
		var msg = wx['msg']
		if(array_urls.length == 1) {
			if(isCron) {
				sysMethod.push({
					platform:platform,
					groupId:groupid,
					msg:msg
				})
			}
			else {
				await s.reply({
					msg: msg,
					dontEdit: true
				})
			}
		}
		else {
			var total_speed = +total_speed + +wx['task_speed']
			if(isCron) {
				sysMethod.push({
					platform: platform,
					groupId: groupid,
					msg: i+1 + "#容器" + msg
				})
			}
			else {
				await s.reply({
					msg: i+1 + "#容器" + msg,
					dontEdit: true
				})
			}
		}
	}
	var total_msg = array_urls.length + "个网心容器魔方总速度：" + total_speed.toFixed(3) + "Mbps"
	if(isCron) {
	    	sysMethod.push({
	        	platform: platform,
	        	groupId: groupid,
	        	msg: total_msg
	    	})
	}
	else {
		await s.reply({
			msg: total_msg,
			dontEdit: true
		})
	}
}
