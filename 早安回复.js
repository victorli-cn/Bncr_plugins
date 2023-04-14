/**
 * @name 早安回复
 * @description 🐒这个人很懒什么都没有留下。
 * @author victor_li
 * @origin VICTOR
 * @version v1.0.0
 * @rule 早安
 * @cron 0 3 9 * * *
 * @disable false
 * @admin true
 * @public false
 */
module.exports = async sender => {
	const axios = require("axios").default
	var s = sender
	var now = Date.now()
	var nongliurl = "http://api.tianapi.com/lunar/index?key=666d12e95ba592a1bddc4e9f98b3e901&date=" 
	var tianqiurl = "https://xiaoapi.cn/API/zs_tq.php?type=zytq&msg=%E6%B7%B1%E5%9C%B3&num=20&n=1"
	var tianqizsurl = "https://devapi.qweather.com/v7/indices/1d?type=3,9,16&location=101280606&key=8e9e15210e2e49a783fb3cbc58dfb6fe"
	async function nongli(riqi) {
		var yangli = {
			url: nongliurl + riqi + "-3-16&type=1",
			method: "GET"
		}
		var yldata = (await axios.request(yangli)).data.newslist[0].gregoriandate
		return yldata
	}
	async function main() {
		var text = "小宝贝，早安！"
		//生日时间戳
		var birthday_unix = Date.parse(new Date('1993-03-16'))
		//结婚时间戳
		var marryday_unix = Date.parse(new Date('2018-05-29'))
		//当前年份
		const date = new Date()
		var nowyear = date.getFullYear()
		console.log("当前年份：" + nowyear)
		//当前时间
		var nowtime = nowyear + "-" + (date.getMonth() + 1) + "-" + date.getDate()
		//下一年份
		var nextyear = +(nowyear) + 1
		//当前时间戳
		var now_unix = Date.now()
		console.log("当前时间戳：" + now_unix)
		//当年生日时间
		var yangli = {
			url: nongliurl + nowyear + "-3-16&type=1",
			method: "GET"
		} 
		var nowtbirthday = (await axios.request(yangli)).data.newslist[0].gregoriandate
		console.log("当年生日时间:" + nowtbirthday)
		//当年生日时间戳
		var nowtbirthday_unix = Date.parse(new Date(nowtbirthday))
		console.log("当年生日时间戳:" + nowtbirthday_unix)
		//下一年生日
		var yangli = {
			url: nongliurl + nextyear + "-3-16&type=1",
			method: "GET"
		}
		var nextbirthday = (await axios.request(yangli)).data.newslist[0].gregoriandate
		//下一个生日时间戳
		var nextbirthday_unix = Date.parse(new Date(nextbirthday))
		//当年结婚时间戳
		var nowmarryday_unix = Date.parse(new Date(nowyear + "-5-28"))
		//下一个结婚时间戳
		var nextmarryday_unix = Date.parse(new Date(nextyear + "-5-28"))
		if(now_unix < nowtbirthday_unix) {
			//下个生日时间差
			var birthday_time = (nowtbirthday_unix-now_unix)/(3600*24)
			console.log(birthday_time)
		} 
		else if((now_unix-nowtbirthday_unix)/(3600*24) < 1 &&(now_unix-nowtbirthday_unix)/(3600*24) > 0){
			var birthday_time = 0
		}
		else {
            //下个生日时间差
            var birthday_time = (nextbirthday_unix-now_unix)/(3600*24)
		}
		if(now_unix < nowmarryday_unix) {
			//下个结婚纪念日差
			var marryday_time = (nowmarryday_unix-now_unix)/(3600*24)
		}
		else if((now_unix-nowmarryday_unix)/(3600*24) < 1 && (now_unix-nowmarryday_unix)/(3600*24) > 0) {
			var marryday_time = 0
		}
		else {
			//下个结婚纪念日差
			var marryday_time = (nextmarryday_unix-now_unix)/(3600*24)
		}
		var nownongli = {
			url: nongliurl + nowtime,
			method: "GET"
		}
		var tianqi = {
			url: tianqiurl,
			method: "GET"
		}
		var tianqizs = {
			method: "GET",
			url: tianqizsurl
		}
		var tqzsdata = (await axios.request(tianqizs)).data
		var nnldata = (await axios.request(nownongli)).data
		var tqdata = (await axios.request(tianqi)).data
		var nowgregoriandate = nnldata.newslist[0].shengxiao + "年 农历" + nnldata.newslist[0].lubarmonth + nnldata.newslist[0].lunarday
		var tianqizsmsg = ""
		var len = tqzsdata.daily.length
		for(var i = len-1; i >= 0; i--){
			var tianqizsmsg = tianqizsmsg + "\n" + tqzsdata.daily[i].name + "：" + tqzsdata.daily[i].text
		}
		var titlemsg = nowtime + "  " + nowgregoriandate + "\n \n" + text + "\n距离小宝贝生日还有：" + Math.floor(birthday_time/1000) + "天\n距离结婚纪念日还有：" +  Math.floor(marryday_time/1000) + "天\n \n夫妻同心，携手前行，打造出属于我们的一片美好！\n \n"
		var msg = titlemsg + tqdata.data + tianqizsmsg + "\n \n戴好口罩，做好防护，开心一整天！\n                        ---爱你的老公"
		sysMethod.push({
			platform: "wxXyo",
			userId: "Shumy_1117",
			msg: msg,
			type: "text"
		})
	}
	await main()	
}