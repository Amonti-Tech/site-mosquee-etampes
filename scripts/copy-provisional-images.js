const fs = require('fs');
const path = require('path');

const artifactDir = 'C:\\Users\\r.camboulin\\.gemini\\antigravity-ide\\brain\\963c2ddb-43d1-4bbd-b05b-0b34b73e64c1';
const projectDir = process.cwd();

const targetDirs = [
  path.join(projectDir, 'assets-provisoires'),
  path.join(projectDir, 'public', 'images', 'provisoires'),
  path.join(projectDir, 'public', 'logo')
];

targetDirs.forEach(dir => fs.mkdirSync(dir, { recursive: true }));

const mappings = [
  { src: 'hero_facade_1792668102314.jpg', dest: 'hero-facade.jpg' },
  { src: 'interieur_mosquee_1792668118735.jpg', dest: 'interieur-mosquee.jpg' },
  { src: 'actu_communaute_1792668138955.jpg', dest: 'actu-communaute.jpg' },
  { src: 'actu_cours_1792668156142.jpg', dest: 'actu-cours.jpg' },
  { src: 'evenement_conference_1792668175724.jpg', dest: 'evenement-conference.jpg' },
  { src: 'solidarite_pure_1792668228332.jpg', dest: 'activite-solidarite.jpg' }
];

mappings.forEach(m => {
  const srcPath = path.join(artifactDir, m.src);
  if (fs.existsSync(srcPath)) {
    fs.copyFileSync(srcPath, path.join(projectDir, 'assets-provisoires', m.dest));
    fs.copyFileSync(srcPath, path.join(projectDir, 'public', 'images', 'provisoires', m.dest));
    console.log(`Copied ${m.src} -> ${m.dest}`);
  } else {
    console.warn(`Source not found: ${srcPath}`);
  }
});

// Also copy logo files into public/
fs.copyFileSync(
  path.join(projectDir, 'assets-source', 'logo', 'logo-mosquee.svg'),
  path.join(projectDir, 'public', 'logo-mosquee.svg')
);
fs.copyFileSync(
  path.join(projectDir, 'assets-source', 'logo', 'logo-mosquee.png'),
  path.join(projectDir, 'public', 'logo-mosquee.png')
);
fs.copyFileSync(
  path.join(projectDir, 'assets-source', 'logo', 'logo-mosquee-opaque.svg'),
  path.join(projectDir, 'public', 'logo-mosquee-opaque.svg')
);

console.log('Logo copied to public/ successfully.');
