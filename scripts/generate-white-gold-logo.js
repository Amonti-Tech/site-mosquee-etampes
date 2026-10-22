const fs = require('fs');
const path = require('path');

const projectDir = process.cwd();
const svgSource = fs.readFileSync(path.join(projectDir, 'assets-source', 'logo', 'logo-mosquee.svg'), 'utf8');

// Replace dark blue shades with pure white / soft cream
let svgWhiteGold = svgSource
  .replace(/fill="#1[B9A]1[FDE]6[01]"/gi, 'fill="#FFFFFF"')
  .replace(/fill="#1F2465"/gi, 'fill="#FFFFFF"')
  .replace(/fill="#2[86]2[CD]6[BD]"/gi, 'fill="#FFFFFF"')
  .replace(/fill="#535589"/gi, 'fill="#E8EAF6"')
  .replace(/fill="#3C3F79"/gi, 'fill="#FFFFFF"');

fs.writeFileSync(path.join(projectDir, 'assets-source', 'logo', 'logo-mosquee-blanc-or.svg'), svgWhiteGold, 'utf8');
fs.writeFileSync(path.join(projectDir, 'public', 'logo-mosquee-blanc-or.svg'), svgWhiteGold, 'utf8');

console.log('Created logo-mosquee-blanc-or.svg successfully in assets-source/logo and public/');
