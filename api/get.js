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
            'User-Agent': 'Vercel-Proxy-Roblox'
        }
    };

    const request = https.request(options, (response) => {
        let data = '';
        response.setEncoding('utf8');
        response.on('data', (chunk) => { data += chunk; });
        response.on('end', () => {
            // Header fondamentali per Roblox
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.setHeader('Content-Type', 'text/plain; charset=utf-8');
            res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
            
            if (response.statusCode === 200) {
                // Mandiamo i dati e chiudiamo subito
                res.status(200).end(data);
            } else {
                res.status(200).end(`print('ERRORE GITHUB: ${response.statusCode}')`);
            }
        });
    });

    request.on('error', (e) => {
        res.status(200).end(`print('ERRORE SERVER: ${e.message}')`);
    });

    request.end();
};
