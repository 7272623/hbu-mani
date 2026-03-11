const https = require('https');

module.exports = (req, res) => {
    const token = process.env.GH_TOKEN;
    const options = {
        hostname: 'api.github.com',
        path: '/repos/7272623/hbu-mani/contents/hub.lua',
        method: 'GET',
        headers: {
            'Authorization': `token ${token}`,
            'Accept': 'application/vnd.github.v3.raw',
            'User-Agent': 'Mozilla/5.0'
        }
    };

    const request = https.request(options, (response) => {
        let chunks = [];
        response.on('data', (chunk) => { chunks.push(chunk); });
        response.on('end', () => {
            if (response.statusCode === 200) {
                const buffer = Buffer.concat(chunks);
                // TRASFORMA TUTTO IN BASE64 PER BYPASSARE I FILTRI
                const base64Content = buffer.toString('base64');
                res.setHeader('Content-Type', 'text/plain');
                res.status(200).send(base64Content);
            } else {
                res.status(200).send(""); 
            }
        });
    });
    request.on('error', () => { res.status(200).send(""); });
    request.end();
};
