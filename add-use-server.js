const fs = require('fs');
const path = require('path');
const apiDir = path.join(__dirname, 'client', 'src', 'lib', 'api');

for (const file of fs.readdirSync(apiDir)) {
    if (file.endsWith('.ts')) {
        const filepath = path.join(apiDir, file);
        const content = fs.readFileSync(filepath, 'utf8');
        if (!content.includes('"use server"') && !content.includes("'use server'")) {
            fs.writeFileSync(filepath, '"use server";\n\n' + content, 'utf8');
        }
    }
}
console.log('Added use server to API files.');
