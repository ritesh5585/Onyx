import ImageKit from '@imagekit/nodejs';
import { config } from '../config/config.js'

// @imagekit/nodejs v7 — only needs privateKey to authenticate
const client = new ImageKit({ privateKey: config.IMAGEKIT });

const uploadFile = async ({ buffer, fileName, folder = 'Oynx' }) => {
    const result = await client.files.upload({
        file: await ImageKit.toFile(buffer),
        fileName,
        folder
    });

    if (!result?.fileId) {
        console.warn('[ImageKit] Upload succeeded but no fileId in response. Image cleanup will not be possible for this file.');
    }

    return result;
};

/**
 * Delete a single file from ImageKit.
 *
 * Strategy:
 *  1. If `fileId` is in the DB  → fast path: direct API delete.
 *  2. If only `url` is available → fallback: derive the filePath from the
 *     URL and use ImageKit's Media API to locate and delete the asset.
 *
 */
export const deleteFile = async (fileId, url) => {

    if (fileId && typeof fileId === 'string') {
        try {
            await client.files.delete(fileId);
        } catch (err) {
            console.error(`[ImageKit] ✗ Failed to delete fileId "${fileId}":`, err?.message || err);
        }
        return;
    }

    if (!url) {
        console.warn('[ImageKit] Skipping deletion — neither fileId nor url provided.');
        return;
    }

    try {
        /*
         * Extract the relative file path from the ImageKit delivery URL.
         * ImageKit URLs look like:
         *   https://ik.imagekit.io/<account>/Oynx/filename.jpg
         * The path after the account id is what ImageKit calls `filePath`.
         */
        const parsed = new URL(url);
        // pathname = "/<account>/Oynx/filename.jpg"
        // Drop the first two segments (empty string + account id) → "/Oynx/filename.jpg"
        const segments = parsed.pathname.split('/');
        // segments[0] = '', segments[1] = accountId, rest = actual path
        const filePath = '/' + segments.slice(2).join('/');

        console.log(`[ImageKit] No fileId stored. Searching by filePath: "${filePath}"`);

        /*
         * ImageKit's Node SDK v7 does not expose a searchFiles method, so we
         * call the Media API directly.  The private key acts as the password in
         * HTTP Basic Auth (username is left empty).
         */
        const searchRes = await fetch(
            `https://api.imagekit.io/v1/files?searchQuery=filePath%3D"${encodeURIComponent(filePath)}"`,
            {
                headers: {
                    Authorization: 'Basic ' + Buffer.from(config.IMAGEKIT + ':').toString('base64')
                }
            }
        );

        const files = await searchRes.json();

        if (!Array.isArray(files) || files.length === 0) {
            console.warn(`[ImageKit] No asset found at path "${filePath}". Skipping.`);
            return;
        }

        const resolvedFileId = files[0].fileId;
        await client.files.delete(resolvedFileId);
        console.log(`[ImageKit] ✓ Deleted via URL fallback. fileId: ${resolvedFileId}`);
    } catch (err) {
        console.error(`[ImageKit] ✗ URL-fallback deletion failed for url "${url}":`, err?.message || err);
    }
};

export default uploadFile;