const https = require('https');

module.exports = (req, res) => {
    const token = process.env.GH_TOKEN;
    
    // Header che fanno sembrare la richiesta "umana"
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET');
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');

    const options = {
        hostname: 'api.github.com',
        path: '/repos/7272623/hbu-mani/contents/hub.lua',
        method: 'GET',
        headers: {
            'Authorization': `token ${token}`,
            'Accept': 'application/vnd.github.v3.raw',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        }
    };

    const request = https.request(options, (response) => {
        let chunks = [];
        response.on('data', (chunk) => { chunks.push(chunk); });
        response.on('end', () => {
            const buffer = Buffer.concat(chunks);
            const content = buffer.toString('utf8');

            if (response.statusCode === 200) {
                // Mandiamo il codice pulito senza fronzoli
                res.status(200).send(content);
            } else {
                res.status(200).send(`print("Errore Proxy: GitHub ha risposto ${response.statusCode}")`);
            }
        });
    });

    request.on('error', (e) => {
        res.status(200).send(`print("Errore Server: ${e.message}")`);
    });

    request.end();
};
