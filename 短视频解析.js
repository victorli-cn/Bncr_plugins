/**作者
 * @author victor_li
 * @name 聚合短视频解析
 * @origin VICTOR
 * @version 1.0.0
 * @description 冲趣API短视频解析，支持快手/微博/抖音/皮皮虾/最右
 * @rule (https://h5.pipix.com[.a-z/A-Z0-9/]*)
 * @rule (https://v.douyin.com[.a-zA-Z0-9/]*)
 * @rule (https://v.kuaishou.com[.a-zA-Z0-9/]*)
 * @admin false
 * @priority 999999
 * @disable false
 */


const request = require('request');
const path = require('path');
const fs = require('fs');
const { randomUUID } = require('crypto')
const axios = require("axios").default
module.exports = async s => {
	let url_all = s.param(1)
	console.log(url_all)
	if(url_all.indexOf("douyin") != -1) {
		//base加密链接
		let jm_str = await axios.request({
			url: "https://api.linhun.vip/api/base64?apiKey=783d1676d2b102c3d3737fd44a99ebde&type=jiami&text=" + url_all,
			json: true
		})
		console.log(jm_str.data.encryption)
		let jm_rule =jm_str.data.encryption
		let jx = await axios.request({
			url: "https://www.mxnzp.com/api/douyin/video?app_id=cwclhnmhw2vgojdo&app_secret=WkhnOXhKMlhOaFo5WndsNE5QUTRRdz09&url=" + jm_rule,
			json: true
		})
		console.log(jx)
		//console.log(jx.data.data.url)
		if(jx.data.code == "1") {
			await s.reply("解析中，请稍等~")
			s.delMsg(s.getMsgId(), { wait: 3})
			console.log(jx.data.data.url)
			open = false;
        		(jx_url = await writeTovideo(jx.data.data.url)), open = true;   /* 存储图片 */
			await s.reply({
				type: "video",
				path: jx_url,
				//msg: jx.data.data.title
			})
			open && fs.unlinkSync(jx_url)
		}
		else if(jx.data.code == "0") {
			await s.reply(jx.data.msg)
		}
		else {
			await s.reply("接口异常！")
		}
	}
	else {
		let jx = await axios.request({
			url: "http://www.plapi.tk/api/dspjx.php?url=" + url_all,
			json: true
		})
		if(jx.data.code == "200") {
			await s.reply("解析中，请稍等~")
			s.delMsg(s.getMsgId(), { wait: 3})
			console.log(jx.data.data.videourl)
			open = false;
        		(jx_url = await writeTovideo(jx.data.data.videourl)), open = true;   /* 存储图片 */
			await s.reply({
				type: "video",
				path: jx_url,
				//msg: jx.data.msg
			})
			open && fs.unlinkSync(jx_url)
		}
		else {
			await s.reply("接口异常！")
		}
	}
}
async function writeTovideo(url) {
    // console.log(`正在下载文件`)
    const paths = path.join(process.cwd(), `BncrData/public/${randomUUID().split('-').join('') + '.mp4'}`);
    return new Promise((resolve, reject) => {
        let stream = request(url).pipe(
            fs.createWriteStream(paths)
        );
        stream.on('finish', () => {
            resolve(paths);
        });
    });
};