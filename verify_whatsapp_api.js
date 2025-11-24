const fs = require('fs');
const path = require('path');
const FormData = require('form-data'); // You might need to install this: npm install form-data

async function verifyApi() {
    const fetch = (await import('node-fetch')).default;

    // Configuration
    const API_URL = 'http://localhost:5000/api/v1/whatsapp/process';
    // REPLACE WITH A VALID JWT TOKEN
    const TOKEN = 'YOUR_JWT_TOKEN_HERE';
    const TEXT_MESSAGE = 'Spent 500 on groceries today and 200 on taxi';

    console.log('--- WhatsApp API Verification (Multi-file) ---');
    console.log(`Target URL: ${API_URL}`);
    console.log(`Message: ${TEXT_MESSAGE}`);

    try {
        const form = new FormData();
        form.append('text', TEXT_MESSAGE);
        // form.append('mobileNo', '...'); // Optional now if token is present

        // Example: Attach dummy files if they exist
        // const file1 = fs.createReadStream('path/to/image1.jpg');
        // form.append('files', file1);
        // const file2 = fs.createReadStream('path/to/image2.jpg');
        // form.append('files', file2);

        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${TOKEN}`,
                ...form.getHeaders()
            },
            body: form,
        });

        const data = await response.json();

        console.log('\n--- Response ---');
        console.log(`Status: ${response.status}`);
        console.log(JSON.stringify(data, null, 2));

        if (response.ok) {
            console.log('\n✅ Verification Successful!');
        } else {
            console.log('\n❌ Verification Failed.');
        }

    } catch (error) {
        console.error('\n❌ Error during verification:', error.message);
        console.log('Ensure the server is running on port 5000.');
    }
}

verifyApi();
