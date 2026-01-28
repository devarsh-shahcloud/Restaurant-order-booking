
const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src/data/menu.js');
const content = fs.readFileSync(filePath, 'utf8');

// Filter out lines containing "dietary: {"
const newContent = content.split('\n')
    .filter(line => !line.includes('dietary: {'))
    .join('\n');

fs.writeFileSync(filePath, newContent);
console.log('Cleaned menu.js');
