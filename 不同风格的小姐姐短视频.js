/**
 * @name 不同风格的短视频
 * @rule ^(蹲下变装|鹅鹅鹅鹅|黑色闪光|小芷儿系|你的欲梦|西施美女|新年变装|小困鱼系|随机美女|撩裙杀系|圣诞变装|女仆变装|蕾姆变装|背影变装|光剑变装|腹肌变装|黑丝视频|白丝视频|体操服系|制服视频|萝莉视频|御姐视频|慢摇系列|快摇系列|吊带系列|女仆系列|甜系女孩|纯欲系列|曹芬系列|火车摇系|落了白系|丝滑连招|吃鸡舞蹈|双倍快乐|害羞舞蹈|井川里予|擦玻璃系|完美身材|甜妹变装|洛丽塔系|荷塘月色|睡衣变装|天使之书|摸头杀系|私房写真|国风旗袍|美女视频|帅哥视频|古风汉服|日系和服|动漫视频|sp)$
 * @description 🐒这个人很懒什么都没有留下。
 * @author victor_li
 * @origin 胜利者
 * @version v1.0.0
 * @admin false
 * @disable false
 * @public false
 */

const request = require('request');
const { randomUUID } = require('crypto')
const path = require('path');
const fs = require('fs');
const got = require('got');
module.exports = async s => {
	s.delMsg(s.getMsgId(), { wait: 3})
	var par = s.param(1)
	if(par == "sp") {
		var par = "又纯又欲"
	}
	let url = `http://api.xn--7gqa009h.top/api/wlsp?msg=${encodeURI(par)}`
	console.log(url)
	open = false;
	(pm4url = await writeTovideo(url)), open = true;
	await s.reply({
		type: "video",
		path: pm4url
	})
	open && fs.unlinkSync(pm4url)
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