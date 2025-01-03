import fs from 'fs';
import format from 'fast-csv';

const exportCsv = async (data, filePath) => {
    return new Promise((resolve, reject) => {
        try {
            const writableStream = fs.createWriteStream(filePath);
            format
                .writeToStream(writableStream, data, { headers: true })
                .on('finish', () => {
                    resolve(filePath); 
                })
                .on('error', (error) => {
                    reject(error);
                });
        } catch (error) {
            reject(error);
        }
    });
};

export default exportCsv;
