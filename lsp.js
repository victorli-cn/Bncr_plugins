/**
 *  @author victor_li
 *  @name lsp
 *  @origin VICTOR
 *  @version 1.0.0
 *  @description lsp
 *  @rule ^(蹲下变装|鹅鹅鹅鹅|黑色闪光|小芷儿系|你的欲梦|西施美女|新年变装|小困鱼系|随机美女|撩裙杀系|圣诞变装|女仆变装|蕾姆变装|背影变装|光剑变装|腹肌变装|黑丝视频|白丝视频|体操服系|制服视频|萝莉视频|御姐视频|慢摇系列|快摇系列|吊带系列|女仆系列|甜系女孩|纯欲系列|曹芬系列|火车摇系|落了白系|丝滑连招|吃鸡舞蹈|双倍快乐|害羞舞蹈|井川里予|擦玻璃系|完美身材|甜妹变装|洛丽塔系|荷塘月色|睡衣变装|天使之书|摸头杀系|私房写真|国风旗袍|美女视频|帅哥视频|古风汉服|日系和服|动漫视频|lsp)$
 *  @rule ^()$
 *  @rule ^()$
 *  @rule ^()$
 *  @rule ^()$
 *  @rule ^()$
 *  @admin false
 *  @public false
 *  @priority 99999
 *  @disable false
 */

module.exports = async s => {
	s.delMsg(s.getMsgId(), { wait: 5})
	var par = s.param(1)
	if (par == "lsp") {
		var par = "又纯又欲"
	}
	let url = "http://api.xn--7gqa009h.top/api/wlsp?msg="
 + encodeURI(par)
	console.log(url)
	await s.reply({
		type: "video",
		path:url
	})
}
