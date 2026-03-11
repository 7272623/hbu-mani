const https = require('https');

module.exports = (req, res) => {
    const token = process.env.GH_TOKEN;
    
    // USIAMO L'URL API DI GITHUB INVECE DI RAW (PIÙ STABILE PER I TOKEN)
    const options = {
        hostname: 'api.github.com',
        path: '/repos/7272623/hbu-mani/contents/hub.lua',
        method: 'GET',
        headers: {
            'Authorization': `token ${token}`,
            'Accept': 'application/vnd.github.v3.raw', // Chiediamo il formato RAW
            'User-Agent': 'Vercel-Proxy'
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
                // SE C'È UN ERRORE, LO MANDIAMO COME TESTO LUA
                res.status(200).send("print('ERRORE PROXY: GitHub ha risposto con " + response.statusCode + "')");
            }
        });
    });

    request.on('error', (e) => {
        res.status(200).send("print('ERRORE SERVER: " + e.message + "')");
    });

    request.end();
};
