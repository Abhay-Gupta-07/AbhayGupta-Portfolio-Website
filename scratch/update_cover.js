import fs from 'fs';
import path from 'path';

const filePath = path.resolve('src/data/portfolioData.ts');
let content = fs.readFileSync(filePath, 'utf8');

// Replace base64 image string for the first project with '/assets/portfolio_cover.png'
const regex = /"image":\s*"data:image\/png;base64,[^"]+"/;
if (regex.test(content)) {
  content = content.replace(regex, '"image": "/assets/portfolio_cover.png"');
  fs.writeFileSync(filePath, content, 'utf8');
  console.log('Successfully updated portfolio cover photo image path!');
} else {
  console.log('Base64 image pattern not found in portfolioData.ts');
}
