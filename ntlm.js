// 示例代码
// const base64Message = 'TlRMTVNTUAABAAAAB4IIogAAAAAAAAAAAAAAAAAAAAAKAGFKAAAADw=='; // curl
// const base64Message = 'TlRMTVNTUAABAAAAt4IIogAAAAAAAAAAAAAAAAAAAAAKAGFKAAAADw=='; // git
const base64Message = 'TlRMTVNTUAABAAAAI7II4gMAAwA3AAAADWAPACgAAAAKAGFKAAAAD0gxN05DUkZJMTJQMDEyN05BTQ=='; // chrome
const buffer = Buffer.from(base64Message, 'base64');

// 验证消息前缀
if (buffer.toString('ascii', 0, 7) !== 'NTLMSSP') {
  console.error('无效的 NTLM 消息');
  process.exit(1);
}

console.log('识别为 NTLM 消息');

// 获取消息类型
const messageType = buffer.readUInt32LE(8);
if (messageType !== 1) {
  console.error('不是 NTLM 类型1消息');
  process.exit(1);
}

console.log('消息类型: 类型1');

// 读取 Flags
const flags = buffer.readUInt32LE(12);
// console.log('Flags:', flags.toString(16));
console.log('Flags (十六进制):', `0x${flags.toString(16).toUpperCase()}`);
// 定义常见的 Flags
const NTLM_FLAGS = {
    NEGOTIATE_UNICODE: 0x00000001,
    NEGOTIATE_OEM: 0x00000002,
    REQUEST_TARGET: 0x00000004,
    NEGOTIATE_NTLM: 0x00000200,
    NEGOTIATE_ALWAYS_SIGN: 0x00080000,
    NEGOTIATE_128: 0x20000000,
    NEGOTIATE_KEY_EXCHANGE: 0x40000000,
};

// 检查每个 Flag 是否被启用
console.log('启用的功能:');
for (const [flagName, flagValue] of Object.entries(NTLM_FLAGS)) {
if (flags & flagValue) {
    console.log(`- ${flagName}`);
}
}

// 读取域名字段
const domainLen = buffer.readUInt16LE(16); // 域名长度
const domainMaxLen = buffer.readUInt16LE(18); // 域名最大长度
const domainOffset = buffer.readUInt32LE(20); // 域名偏移
const domain = buffer.toString('ascii', domainOffset, domainOffset + domainLen);
console.log('域名:', domain);

// 读取工作站字段
const workstationLen = buffer.readUInt16LE(24); // 工作站长度
const workstationMaxLen = buffer.readUInt16LE(26); // 工作站最大长度
const workstationOffset = buffer.readUInt32LE(28); // 工作站偏移
const workstation = buffer.toString('ascii', workstationOffset, workstationOffset + workstationLen);
console.log('工作站:', workstation);