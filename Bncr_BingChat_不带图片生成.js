/**
 * @author Masato
 * @name BingChat
 * @origin Masato
 * @version 1.0.1
 * @description 必应搜索聊天AI机器人越狱版，本插件由Bncr_ChatGPT插件修改而来
 * @rule ^bing ([\s\S]+)$
 * @admin false
 * @public false
 * @priority 9999
 * @disable false
 */

/* 
输入'bing ?'进行与BingChat互动。
脚本为每个用户创建单独的会话，可以保持上下文进行调教
输入'bing 清空上下文'将清空会话,重新创建新的会话
初次使用请 npm i @waylaidwanderer/chatgpt-api 安装依赖
并使用命令'set BingChat Token ?'设置Token

必应Token获取方法：
使用最新版本的 Microsoft Edge打开bing.com/chat并确认能看到聊天功能
方法一：按F12或直接打开开发者模式，点击Application/应用程序，点击左侧Storage/存储下的Cookie，
展开找到https://www.bing.com 项，在右侧列表Name/名称项下找到"_U"，_U的value/值即为必应Token（有效期目前是14天）。
方法二：按F12或直接打开开发者模式，点击Console/控制台，运行如下代码，执行后即在您的剪切板存储了必应Token
copy(document.cookie.split(";").find(cookie=>cookie.trim().startsWith("_U=")).split("=")[1]);

本插件基于https://www.npmjs.com/package/@waylaidwanderer/chatgpt-api npm包实现
*/

let api = {};

module.exports = async s => {
    const BingChatStorage = new BncrDB('BingChat');
    const userToken = await BingChatStorage.get('Token');
    if (!userToken) return s.reply("请使用命令'set BingChat Token ?,设置BingChat的Token");
    if (!api?.sendMessage) {
        const { BingAIClient } = await import('@waylaidwanderer/chatgpt-api');
        api = new BingAIClient({ userToken: userToken });
        console.log('初始化BingChat...');
    }
    let platform = s.getFrom(),
        userId = s.getUserId();
    if (s.param(1) === '清空上下文') {
        await BingChatStorage.del(`${platform}:${userId}`);
        return s.reply('清空上下文成功...');
    }
    let opt = {
		toneStyle: 'creative',
        timeoutMs: 2 * 60 * 1000,
    };
    /* 获取上下文 */
    const getUesrInfo = await BingChatStorage.get(`${platform}:${userId}`);
    if (getUesrInfo) {
        opt['jailbreakConversationId'] = getUesrInfo.jailbreakConversationId;
        opt['parentMessageId'] = getUesrInfo.parentMessageId;
        console.log('读取会话...');
    } else {
        console.log('创建新的会话...');
		opt['jailbreakConversationId'] = true;
    }
    let res = {},
        maxNum = 5,
        logs = ``;
    s.reply(`Let me see...`);
    do {
        try {
            res = await api.sendMessage(s.param(1), opt);
            if (!res?.response) {
                logs += `未获取到消息,去重试...\n`;
                continue;
            }
			let reference = res.details.adaptiveCards[0].body[0].text;
            if (reference.includes("[1]:")) {
                reference = "\n\n相关信息:\n" + reference.split('\n\n', 1);
            } else {
                reference = "";
            }
            logs += `回复:\n${res.response}${reference}`;
            break;
        } catch (e) {
            logs += '会话出现错误,尝试重新创建会话...\n';
            if (maxNum === 1) logs += '如果持续出现错误,请考虑userToken是否过期,或者在控制台查看错误!\n';
            console.log('Bncr_BingChat.js:', e);
            await sysMethod.sleep(1);
        }
    } while (maxNum-- > 1);
    if (!logs) return;
    await s.reply(`触发消息:\n${s.getMsg()}\n\n${logs}`);
    // console.log('res', res);
    if (!res?.messageId && !res?.jailbreakConversationId) return;
    /* 存储上下文 */
    await BingChatStorage.set(`${platform}:${userId}`, {
        jailbreakConversationId: res.jailbreakConversationId,
        parentMessageId: res.messageId
    });
};
