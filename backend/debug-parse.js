/**
 * 调试parseFrontMatter函数
 */

const fs = require('fs').promises;
const path = require('path');

async function testParse() {
    const testFile = 'D:/网站/smarthometechhub/content/articles/air-quality/2026-05-13-air-quality-20260513212424.md';
    const content = await fs.readFile(testFile, 'utf8');

    console.log('原始内容前200字符:');
    console.log(content.substring(0, 200));
    console.log('\n==========\n');

    // 测试不同的正则表达式
    const patterns = [
        { name: 'Unix格式', regex: /^---\n([\s\S]*?)\n---\n([\s\S]*)$/ },
        { name: 'Windows格式', regex: /^---\r\n([\s\S]*?)\r\n---\r\n([\s\S]*)$/ },
        { name: '兼容格式', regex: /^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/ }
    ];

    for (const pattern of patterns) {
        const match = content.match(pattern.regex);
        console.log(`${pattern.name}: ${match ? '✓ 匹配成功' : '✗ 匹配失败'}`);
        if (match) {
            console.log(`  Front Matter长度: ${match[1].length}`);
            console.log(`  Content长度: ${match[2].length}`);
            console.log(`  Front Matter前100字符: ${match[1].substring(0, 100)}`);
        }
    }

    console.log('\n==========\n');

    // 测试换行符
    const lines = content.split(/\r?\n/);
    console.log(`文件总行数: ${lines.length}`);
    console.log(`前10行:`);
    for (let i = 0; i < Math.min(10, lines.length); i++) {
        console.log(`  ${i}: ${lines[i]}`);
    }
}

testParse().catch(console.error);
