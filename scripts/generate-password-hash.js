#!/usr/bin/env node

const crypto = require('crypto');

if (process.argv.length !== 3) {
    console.log('Usage: node generate-password-hash.js <password>');
    process.exit(1);
}

const password = process.argv[2];
const hash = crypto.createHash('sha256').update(password).digest('hex');
console.log(hash); 