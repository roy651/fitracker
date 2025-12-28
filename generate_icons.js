import sharp from 'sharp';
import { join } from 'path';

const publicDir = '/Users/royabitbol/Development/private/fitracker/public';
const svgPath = join(publicDir, 'ski-icon.svg');

async function generate() {
    await sharp(svgPath)
        .resize(512, 512)
        .png()
        .toFile(join(publicDir, 'icon-512.png'));
    console.log('Generated icon-512.png');

    await sharp(svgPath)
        .resize(192, 192)
        .png()
        .toFile(join(publicDir, 'icon-192.png'));
    console.log('Generated icon-192.png');
}

generate().catch(err => console.error('Error generating icons:', err));
