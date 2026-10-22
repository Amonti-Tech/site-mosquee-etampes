const fs = require('fs');
const path = require('path');

const rootDir = process.cwd();
const targetDir = path.join(rootDir, 'assets-source', 'logo');
fs.mkdirSync(targetDir, { recursive: true });

// Copy PNG
fs.copyFileSync(
  path.join(rootDir, 'Logo de mosquée stylisée bleu et or.png'),
  path.join(targetDir, 'logo-mosquee.png')
);

// Read SVG
const svgRaw = fs.readFileSync(path.join(rootDir, 'Logo de mosquée stylisée bleu et or.svg'), 'utf8');

// Create version with viewBox and transparent background
let svgTransparent = svgRaw.replace(
  '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="1132" height="1390">',
  '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1132 1390" width="1132" height="1390">'
);

// Remove the white background rectangle (#FDFDFD)
svgTransparent = svgTransparent.replace(/<path d="M0 0 C373\.56 0 747\.12 0 1132 0[^\/]+\/>\r?\n?/, '');
fs.writeFileSync(path.join(targetDir, 'logo-mosquee.svg'), svgTransparent, 'utf8');

// Create opaque version with viewBox
let svgOpaque = svgRaw.replace(
  '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="1132" height="1390">',
  '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1132 1390" width="1132" height="1390">'
);
fs.writeFileSync(path.join(targetDir, 'logo-mosquee-opaque.svg'), svgOpaque, 'utf8');

console.log('Logo assets created successfully in assets-source/logo:');
console.log(fs.readdirSync(targetDir));
