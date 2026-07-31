const fs = require('fs');
const path = require('path');

const filesToUpdate = [
    'c:\\Coding-Projects\\projects\\Iot-copilot\\client\\src\\app\\projects\\page.tsx',
    'c:\\Coding-Projects\\projects\\Iot-copilot\\client\\src\\app\\projects\\[id]\\page.tsx',
    'c:\\Coding-Projects\\projects\\Iot-copilot\\client\\src\\app\\projects\\[id]\\edit\\page.tsx',
    'c:\\Coding-Projects\\projects\\Iot-copilot\\client\\src\\app\\learning-path\\page.tsx',
    'c:\\Coding-Projects\\projects\\Iot-copilot\\client\\src\\app\\interview-coach\\page.tsx',
    'c:\\Coding-Projects\\projects\\Iot-copilot\\client\\src\\app\\explore\\page.tsx',
    'c:\\Coding-Projects\\projects\\Iot-copilot\\client\\src\\app\\dashboard\\page.tsx',
    'c:\\Coding-Projects\\projects\\Iot-copilot\\client\\src\\app\\community\\page.tsx',
    'c:\\Coding-Projects\\projects\\Iot-copilot\\client\\src\\app\\admin\\page.tsx',
    'c:\\Coding-Projects\\projects\\Iot-copilot\\client\\src\\app\\admin\\users\\page.tsx'
];

for (const filepath of filesToUpdate) {
    if (!fs.existsSync(filepath)) continue;
    let content = fs.readFileSync(filepath, 'utf8');
    
    // Replace '.data.data' with '.data'
    content = content.replace(/\.data\.data/g, '.data');
    // Replace 'data.data' with 'data'
    content = content.replace(/\bdata\.data\b/g, 'data');

    fs.writeFileSync(filepath, content, 'utf8');
}
console.log('Fixed data.data -> data');
