/**
 *  @author victor_li
 *  @name ssh连接
 *  @origin VICTOR
 *  @version 1.0.0
 *  @description ssh连接
 *  @rule ^sh$
 *  @admin true
 *  @public false
 *  @disable false
 */
 
const { NodeSSH } = require('node-ssh');

const jsonSchema = BncrCreateSchema.object({
    host: BncrCreateSchema.string().setTitle('主机地址').setDescription(`配置主机的ip或者域名`).setDefault('127.0.0.1'),
    port: BncrCreateSchema.string().setTitle('主机端口').setDescription(`配置主机的端口`).setDefault('22'),
    user: BncrCreateSchema.string().setTitle('用户').setDescription(`配置主机用户`).setDefault('root'),
    password: BncrCreateSchema.string().setTitle('密码').setDescription(`配置主机密码`).setDefault('123456'),
});

const ConfigDB = new BncrPluginConfig(jsonSchema);
const ssh = new NodeSSH();
module.exports = async s => {
    await ConfigDB.get();
    //自动安装依赖
    sysMethod.testModule(['node-ssh'], { install: true });

    await s.reply("请在30s内输入你要执行的命令[输入q退出]：");

    while (true) {
        let newMsg = await s.waitInput(() => {}, 30);
        if (!newMsg || newMsg === "null") {
            await s.reply("超时退出");
            ssh.dispose();
            return;
        }
        let command = newMsg.getMsg();
        
        
        if (command === "q") {
            await s.reply("退出命令行~");
            ssh.dispose();
            return;
        }
        
        if (command.startsWith("cd ")) {
            var currentPath = command.replace(/^cd\s+/, ''); // 更新当前路径
            await s.reply("切换到目录:" + currentPath + "\n请继续输入[输入q退出]：");
            continue; // 继续下一次循环，不执行命令
        }
        let info = await executeCommand(command, currentPath, s, ssh);
        await s.reply(info + "\n请继续输入[输入q退出]：")
        
    }
    
}

async function executeCommand(command, path, s, ssh) {
    try {
        
        const ssh_host = ConfigDB.userConfig['host'];
        const ssh_user = ConfigDB.userConfig['user'];
        const ssh_pwd = ConfigDB.userConfig['password'];
        const ssh_port = ConfigDB.userConfig['port'];

        if (!ssh_host || !ssh_user || !ssh_pwd) {
            throw new Error("请先在web端完成插件首次配置");
        }

        await ssh.connect({
            host: ssh_host,
            username: ssh_user,
            password: ssh_pwd,
            port: ssh_port
        });

        const result = await ssh.execCommand(command, { cwd: path });

        if (result.stdout) {
            return result.stdout
            //s.reply(result.stdout);
            
        } else {
            return result.stderr
            //await s.reply(result.stderr);
        }
    } catch (error) {
        await s.reply('出现错误：' + error.message);
        console.error('出现错误：', error);
    } finally {
        ssh.dispose();
    }
}
