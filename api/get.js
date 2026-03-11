const https = require('https');

module.exports = (req, res) => {
    const token = process.env.GH_TOKEN;
    const options = {
        hostname: 'raw.githubusercontent.com',
        path: '/7272623/hbu-mani/main/hub.lua',
        method: 'GET',
        headers: {
            'Authorization': `token ${token}`,
            'User-Agent': 'Mozilla/5.0' // Cambiato User-Agent per evitare blocchi
        }
    };

    const request = https.request(options, (response) => {
        let data = '';
        response.setEncoding('utf8'); // Forza la codifica UTF-8
        response.on('data', (chunk) => { data += chunk; });
        response.on('end', () => {
            if (response.statusCode === 200) {
                // PULIZIA: Rimuove il BOM e caratteri invisibili all'inizio/fine
                const cleanData = data.replace(/^\uFEFF/, '').trim();
                
                res.setHeader('Content-Type', 'text/plain; charset=utf-8');
                res.setHeader('Access-Control-Allow-Origin', '*'); // Permette l'accesso da ogni client
                res.status(200).send(cleanData);
            } else {
                res.status(response.statusCode).send("-- Errore GitHub: " + response.statusCode);
            }
        });
    });

    request.on('error', (e) => {
        res.status(500).send("-- Errore Proxy: " + e.message);
    });

    request.end();
};
