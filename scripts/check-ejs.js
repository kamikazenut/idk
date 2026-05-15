const fs = require('fs');
const path = require('path');
const ejs = require('ejs');

const root = path.join(__dirname, '..', 'views');

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    return entry.isDirectory() ? walk(full) : [full];
  });
}

const files = walk(root).filter((file) => file.endsWith('.ejs'));
let failed = false;

for (const file of files) {
  try {
    ejs.compile(fs.readFileSync(file, 'utf8'), { filename: file });
  } catch (error) {
    failed = true;
    console.error(`${path.relative(process.cwd(), file)}: ${error.message}`);
  }
}

if (failed) process.exit(1);
console.log(`Checked ${files.length} EJS templates.`);
