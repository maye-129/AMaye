const path = require('path');
const Jimp = require('jimp');

async function processLogo() {
  const inputPath = 'c:/Users/ADMIN/Downloads/port/assets/images/logo_aml.png';
  const outputPath = 'c:/Users/ADMIN/Downloads/port/assets/images/logo_aml_transparent.png';

  console.log("Reading image:", inputPath);
  const image = await Jimp.read(inputPath);

  image.scan(0, 0, image.bitmap.width, image.bitmap.height, function(x, y, idx) {
    const r = this.bitmap.data[idx + 0];
    const g = this.bitmap.data[idx + 1];
    const b = this.bitmap.data[idx + 2];

    // Check if pixel is white / light background
    if (r > 200 && g > 200 && b > 200) {
      // Make background 100% transparent
      this.bitmap.data[idx + 3] = 0;
    } else if (r < 80 && g < 80 && b < 80) {
      // Black lines -> convert to bright crisp white for dark theme
      this.bitmap.data[idx + 0] = 255;
      this.bitmap.data[idx + 1] = 255;
      this.bitmap.data[idx + 2] = 255;
      this.bitmap.data[idx + 3] = 255;
    } else {
      // Red lines -> keep vibrant neon red
      this.bitmap.data[idx + 0] = 255;
      this.bitmap.data[idx + 1] = 42;
      this.bitmap.data[idx + 2] = 75;
      this.bitmap.data[idx + 3] = 255;
    }
  });

  await image.writeAsync(outputPath);
  console.log("Successfully saved transparent logo to:", outputPath);
}

processLogo().catch(err => console.error("Error processing logo:", err));
