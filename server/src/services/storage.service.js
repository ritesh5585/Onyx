import ImageKit from '@imagekit/nodejs';
import { config } from '../config/config.js'

// @imagekit/nodejs v7 only needs the privateKey to authenticate
const client = new ImageKit({
    privateKey: config.IMAGEKIT
});

/**
 * Upload a file buffer to ImageKit.
 * Returns the full result including `fileId` and `url`.
 */
const uploadFile = async ({ buffer, fileName, folder = 'Oynx' }) => {
    const result = await client.files.upload({
        file: await ImageKit.toFile(buffer),
        fileName,
        folder
    })
    return result
}

/**
 * Delete a single file from ImageKit by its fileId.
 * Uses client.files.delete — the correct v7 SDK API.
 * Errors are logged but never throw, so a failed image
 * purge never blocks a product/variant deletion.
 */
export const deleteFile = async (fileId) => {
    if (!fileId || typeof fileId !== 'string') {
        console.error(`[ImageKit Warning] Aborted deletion. Received an invalid fileId: "${fileId}"`);
        return;
    }
    try {
        console.log(`[ImageKit] Attempting to contact API to delete fileId: ${fileId}`);
        await client.files.delete(fileId);
        console.log(`[ImageKit] Successfully deleted asset: ${fileId}`);
    } catch (err) {
        console.error(`[ImageKit] Failed to delete fileId "${fileId}":`, err?.message || err);
    }
}

export default uploadFile;