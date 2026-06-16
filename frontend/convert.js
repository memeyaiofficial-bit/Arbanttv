import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
const publicDir = path.join(process.cwd(), 'public');
async function convertImages() {
    try {
        const files = fs.readdirSync(publicDir);
        const pngFiles = files.filter(f => f.toLowerCase().endsWith('.png'));

        for (const file of pngFiles) {
            const inputPath = path.join(publicDir, file);
            const fileNameWithoutExt = path.parse(file).name;
            const outputPath = path.join(publicDir, `${fileNameWithoutExt}.webp`);

            console.log(`Converting ${file} to WebP...`);
            await sharp(inputPath)
                .webp({ quality: 80 })
                .toFile(outputPath);

            console.log(`Deleting ${file}...`);
            fs.unlinkSync(inputPath);
        }

        console.log('Conversion complete!');
    } catch (error) {
        console.error('Error during conversion:', error);
    }
}
convertImages();
