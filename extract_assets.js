const fs = require('fs');
const path = require('path');

const html = fs.readFileSync(path.join(__dirname, 'HU (Happy User) _ Company Portfolio (1).html'), 'utf8');
const assetsDir = path.join(__dirname, 'assets');
if (!fs.existsSync(assetsDir)) {
  fs.mkdirSync(assetsDir, { recursive: true });
}

// 1. Logo
const logoMatch = html.match(/nav><img src="data:image\/png;base64,([^"]+)"/);
if (logoMatch) {
  fs.writeFileSync(path.join(assetsDir, 'hu-logo.png'), Buffer.from(logoMatch[1], 'base64'));
  console.log('Saved hu-logo.png');
}

// 2. Nesto Logo
const nestoMatch = html.match(/class="nl"><img src="data:image\/png;base64,([^"]+)"/);
if (nestoMatch) {
  fs.writeFileSync(path.join(assetsDir, 'nesto-logo.png'), Buffer.from(nestoMatch[1], 'base64'));
  console.log('Saved nesto-logo.png');
}

// 3. Retailer Logos (RL) and Category Images (IMG)
const scriptTag = html.substring(html.indexOf('<script>') + 8, html.lastIndexOf('</script>'));

const rlStart = scriptTag.indexOf('RL=[');
const rlEnd = scriptTag.indexOf('];', rlStart);
const rlCode = scriptTag.substring(rlStart, rlEnd + 2);

const imgStart = scriptTag.indexOf('IMG=[');
const imgEnd = scriptTag.indexOf('];', imgStart);
const imgCode = scriptTag.substring(imgStart, imgEnd + 2);

let RL = [];
let IMG = [];

eval(rlCode);
eval(imgCode);

console.log('RL count:', RL.length);
console.log('IMG count:', IMG.length);

const retNames = ['ainas', 'kenz', 'cm', 'hashim', 'ajmancoop'];
RL.forEach((b64, idx) => {
  const name = 'retailer-' + (retNames[idx] || idx) + '.png';
  fs.writeFileSync(path.join(assetsDir, name), Buffer.from(b64, 'base64'));
  console.log('Saved', name);
});

const catNames = ['smart', 'home', 'access', 'power', 'style', 'tour', 'drive', 'kitchen', 'volt', 'baby'];
IMG.forEach((b64, idx) => {
  const name = 'cat-' + (catNames[idx] || idx) + '.jpg';
  fs.writeFileSync(path.join(assetsDir, name), Buffer.from(b64, 'base64'));
  console.log('Saved', name);
});
