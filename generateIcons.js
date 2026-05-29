// generateIcons.js
const fs = require('fs');
const path = require('path');

const ICONS_DIR = path.join(__dirname, 'public', 'icons');
const OUTPUT_FILE = path.join(__dirname, 'src', 'components', 'icons', 'icons.ts');

const icons = {};

const files = fs.readdirSync(ICONS_DIR).filter(file => file.endsWith('.svg'));

files.forEach((file) => {
    const iconName = path.basename(file, '.svg');
    icons[iconName] = `/icons/${file}`;
});

const outputContent =
    'const icons = ' +
    JSON.stringify(icons, null, 2) +
    ';\n\nexport default icons;\n';

fs.mkdirSync(path.dirname(OUTPUT_FILE), { recursive: true });
fs.writeFileSync(OUTPUT_FILE, outputContent);

console.log(`✅ icons.ts generado con ${files.length} iconos`);