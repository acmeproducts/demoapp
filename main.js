
const PROXY_URL = 'https://oauth-proxy-3idr.onrender.com';
const APP_ID = 'mydemo';

function getAccessToken() {
    return fetch(`${PROXY_URL}/refresh?app=${APP_ID}`)
    .then(response => {
        if (!response.ok) throw new Error('No refresh token');
        return response.json();
    })
    .then(data => data.access_token)
    .catch(() => {
        window.location.href = `${PROXY_URL}/auth?app=${APP_ID}&redirect=${encodeURIComponent(window.location.href)}`;
    });
}

function fetchFiles() {
    getAccessToken().then(token => {
        fetch('https://www.googleapis.com/drive/v3/files?fields=files(id,name)', {
            headers: { 'Authorization': `Bearer ${token}` }
        })
        .then(response => response.json())
        .then(data => {
            const output = document.getElementById('output');
            output.innerHTML = '<h3>Files:</h3>' + data.files.map(f => `<div>${f.name}</div>`).join('');
        })
        .catch(err => {
            console.error('API error:', err);
            document.getElementById('output').innerText = 'Failed to load files.';
        });
    });
}

window.onload = fetchFiles;
