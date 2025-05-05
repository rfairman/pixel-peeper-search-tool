// ES Module version - compatible with "type": "module" in package.json
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read dist directory
const distDir = path.resolve(__dirname, 'dist');
const assets = fs.readdirSync(path.join(distDir, 'assets'));

// Find CSS file
const cssFile = assets.find(file => file.endsWith('.css'));

// Find JS file
const jsFile = assets.find(file => file.endsWith('.js') && file.includes('index'));

if (!cssFile) {
  console.error('No CSS file found in assets directory');
  process.exit(1);
}

if (!jsFile) {
  console.error('No index JS file found in assets directory');
  process.exit(1);
}

// Read index.html
const indexPath = path.join(distDir, 'index.html');
let indexContent = fs.readFileSync(indexPath, 'utf8');

// Add CSS link before </head>
const cssLink = `<link rel="stylesheet" href="./assets/${cssFile}">`;
indexContent = indexContent.replace('</head>', `${cssLink}\n</head>`);

// Add JS script before </body>
const jsScript = `<script type="module" src="./assets/${jsFile}"></script>`;
indexContent = indexContent.replace('</body>', `${jsScript}\n</body>`);

// Write updated index.html
fs.writeFileSync(indexPath, indexContent);

console.log('CSS and JS links added to index.html successfully!');