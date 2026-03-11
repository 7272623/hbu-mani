const https = require('https');

module.exports = (req, res) => {
    const token = process.env.GH_TOKEN;
    const options = {
        hostname: 'raw.githubusercontent.com',
        path: '/7272623/hbu-mani/main/hub.lua',
        method: 'GET',
        headers: {
            'Authorization': `token ${token}`,
            'User-Agent': 'Vercel-Serverless-Function'
        }
    };

    const request = https.request(options, (response) => {
        let data = '';
        response.on('data', (chunk) => { data += chunk; });
        response.on('end', () => {
            if (response.statusCode === 200) {
                res.setHeader('Content-Type', 'text/plain');
                res.status(200).send(data);
            } else {
                res.status(response.statusCode).send("Errore GitHub: " + response.statusCode);
            }
        });
    });

    request.on('error', (e) => {
        res.status(500).send("Errore: " + e.message);
    });

    request.end();
};
