/**
 * 调试字段解析
 */

const fs = require('fs').promises;

async function testFieldParsing() {
    const testFile = 'D:/网站/smarthometechhub/content/articles/air-quality/2026-05-13-air-quality-20260513212424.md';
    const content = await fs.readFile(testFile, 'utf8');

    const frontMatterRegex = /^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/;
    const match = content.match(frontMatterRegex);

    if (!match) {
        console.log('正则匹配失败');
        return;
    }

    const frontMatterText = match[1];
    console.log('Front Matter文本:');
    console.log(frontMatterText);
    console.log('\n==========\n');

    const frontMatter = {};
    frontMatterText.split(/\r?\n/).forEach((line, index) => {
        console.log(`处理第${index}行: "${line}"`);
        const lineMatch = line.match(/^([^:]+):\s*(.+)$/);
        if (lineMatch) {
            const key = lineMatch[1].trim();
            let value = lineMatch[2].trim();

            console.log(`  找到字段: key="${key}", value="${value}"`);

            if (value.startsWith('"') && value.endsWith('"')) {
                value = value.slice(1, -1);
                console.log(`  去除引号后: "${value}"`);
            }

            frontMatter[key] = value;
        } else {
            console.log(`  行不匹配模式`);
        }
    });

    console.log('\n==========\n');
    console.log('解析结果:');
    console.log(JSON.stringify(frontMatter, null, 2));
}

testFieldParsing().catch(console.error);
