/**
 * @author victor_li
 * @name 百度百科
 * @origin VICTOR
 * @version 1.0.0
 * @description 百度百科
 * @rule ^(百度百科|百科)([^\n]+)$
 * @admin false
 * @disable false
 */

const request = require('request');
const path = require('path');
const fs = require('fs');
const { randomUUID } = require('crypto');
const axios = require("axios").default

module.exports = async s => {
	/* HideStart */
	let par = encodeURIComponent(s.param(2))
	let url = `https://xiaoapi.cn/API/bk.php?m=json&type=bd&msg=${encodeURIComponent(s.param(2))}`,
	    open = false;
	let res = await axios.request({
		url: "https://wanghun.top/api/v5/bdbaike.php?type=json&msg=" + par,
		method: "GET",
		json: true
	})
	console.log(res.data)
	console.log(par)
	if(res.data.code == "200") {
		["tgBot", "HumanTG"].includes(s.getFrom()) && (jpgURL = await writeToJpg(res.data.pictureurl)), open = true;
		//s.delMsg(s.getMsgId(), { wait: 1})
		let info_str = res.data.text
		await s.reply({
			type: "image",
			path: jpgURL,
			msg:info_str + "\n【来源】：" + res.data.url
		})
		open && fs.unlinkSync(jpgURL);
	}
	else if(res.data.code == "201"){
		await s.reply(res.data.msg)
	}
	else {
		await s.reply("接口异常~")
	}
	/* HideEnd */	
}
async function writeToJpg(url) {
    const paths = path.join(process.cwd(), `BncrData/public/${randomUUID().split('-').join('') + '.jpg'}`);
    return new Promise((resolve, reject) => {
        let stream = request(url).pipe(
            fs.createWriteStream(paths)
        );
        stream.on('finish', () => {
            resolve(paths);
        });
    });
};

