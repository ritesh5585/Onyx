import ImageKit from '@imagekit/nodejs';
import { config } from '../config/config.js'

const client = new ImageKit({
    privateKey: config.IMAGEKIT,
});

const uploadFile = async ({ buffer, fileName, folder = 'Oynx' }) => {
    const result = await client.files.upload({
        file: await ImageKit.toFile(buffer),
        fileName,
        folder
    })

    return result
}

export default uploadFile