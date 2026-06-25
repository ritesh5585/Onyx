import ImageKit from '@imagekit/nodejs';
import { config } from '../config/config.js'

const client = new ImageKit({
    publicKey: config.IMAGEKIT_PUBLIC_KEY || 'dummy_public_key', // Required by ImageKit instance usually, adding just in case
    privateKey: config.IMAGEKIT,
    urlEndpoint: config.IMAGEKIT_URL_ENDPOINT || 'https://ik.imagekit.io/dummy'
});

const uploadFile = async ({ buffer, fileName, folder = 'Oynx' }) => {
    const result = await client.files.upload({
        file: await ImageKit.toFile(buffer),
        fileName,
        folder
    })

    return result
}

export const deleteFile = async (fileId) => {
    if(!fileId) return;
    try {
        await client.deleteFile(fileId);
    } catch(err) {
        console.error("Error deleting file from ImageKit:", err);
    }
}

export default uploadFile;