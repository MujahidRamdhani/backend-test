import fs from 'fs';
import path from 'path';
import exportCsv from '../utils/exportCsv.js';

const testData = [
    { id: 1, name: 'Test 1', status: 'Success' },
    { id: 2, name: 'Test 2', status: 'Pending' },
];

const filePath = './output/test.csv';
await exportCsv(testData, filePath);
