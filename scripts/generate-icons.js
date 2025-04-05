const sharp = require('sharp');
const fs = require('fs').promises;
const path = require('path');

async function generateIcons() {
  // Source image should be at least 512x512
  const sourceImage = path.join(__dirname, '../public/logo.png');
  const sizes = [
    { size: 512, name: 'icon-512x512.png' },
    { size: 192, name: 'icon-192x192.png' },
    { size: 180, name: 'apple-touch-icon.png' },
    { size: 32, name: 'favicon-32x32.png' },
    { size: 16, name: 'favicon-16x16.png' }
  ];

  try {
    for (const { size, name } of sizes) {
      await sharp(sourceImage)
        .resize(size, size)
        .toFile(path.join(__dirname, '../public', name));
      console.log(`Generated ${name}`);
    }

    // Generate favicon.ico (multi-size)
    await sharp(sourceImage)
      .resize(32, 32)
      .toFile(path.join(__dirname, '../public/favicon.ico'));
    console.log('Generated favicon.ico');

  } catch (error) {
    console.error('Error generating icons:', error);
  }
}

generateIcons(); 