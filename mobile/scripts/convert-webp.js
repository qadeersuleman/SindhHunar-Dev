const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

/**
 * Image Optimization Script for SindhHunar
 * Requirements: cwebp (part of webp package)
 * Run: node scripts/convert-webp.js
 */

const ASSETS_DIR = path.join(__dirname, '../src/assets/images');

function getAllFiles(dirPath, arrayOfFiles) {
  const files = fs.readdirSync(dirPath);

  arrayOfFiles = arrayOfFiles || [];

  files.forEach(function(file) {
    if (fs.statSync(dirPath + "/" + file).isDirectory()) {
      arrayOfFiles = getAllFiles(dirPath + "/" + file, arrayOfFiles);
    } else {
      arrayOfFiles.push(path.join(dirPath, "/", file));
    }
  });

  return arrayOfFiles;
}

const files = getAllFiles(ASSETS_DIR);
const imageFiles = files.filter(file => /\.(png|jpg|jpeg)$/i.test(file));

console.log(`Found ${imageFiles.length} images to convert.`);

imageFiles.forEach(file => {
  const output = file.replace(/\.(png|jpg|jpeg)$/i, '.webp');
  try {
    // Quality 85 is usually good enough for mobile while saving tons of space
    execSync(`cwebp -q 85 "${file}" -o "${output}"`);
    console.log(`Converted: ${path.basename(file)} -> ${path.basename(output)}`);
    // Optional: Delete original after verification
    // fs.unlinkSync(file);
  } catch (err) {
    console.error(`Failed to convert ${file}. Make sure 'cwebp' is installed.`);
  }
});

console.log('Optimization complete. Please update src/constant/image.ts references to .webp');
