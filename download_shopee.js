const https = require('https');
const fs = require('fs');
const path = require('path');

const API_URL = 'https://shopee.co.th/api/v4/pages/get_category_tree';
const IMAGE_BASE_URL = 'https://down-th.img.susercontent.com/file/';
const DIR = path.join(__dirname, 'shopee_categories');

if (!fs.existsSync(DIR)) {
  fs.mkdirSync(DIR);
}

https.get(API_URL, {
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept': 'application/json'
  }
}, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    try {
      const json = JSON.parse(data);
      if (json.data && json.data.category_list) {
        const categories = json.data.category_list;
        console.log(`Found ${categories.length} categories`);
        
        let count = 0;
        categories.forEach(cat => {
          const imgUrl = IMAGE_BASE_URL + cat.image;
          const cleanName = cat.display_name.replace(/[/\\?%*:|"<>]/g, '-');
          const dest = path.join(DIR, `${cleanName}.png`);
          
          https.get(imgUrl, (imgRes) => {
            const file = fs.createWriteStream(dest);
            imgRes.pipe(file);
            file.on('finish', () => {
              file.close();
              count++;
              console.log(`Downloaded: ${cleanName}`);
            });
          }).on('error', (err) => {
            console.error(`Error downloading ${cleanName}:`, err.message);
          });
        });
      } else {
        console.log('Could not find category list. API response:', data.substring(0, 500));
      }
    } catch (e) {
      console.error('Failed to parse JSON:', e.message);
      console.log('Response was:', data.substring(0, 500));
    }
  });
}).on('error', (err) => {
  console.error('Request failed:', err.message);
});
