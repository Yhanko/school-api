const fs = require('fs');
const html = fs.readFileSync('med_comunicados.html', 'utf8');
if(html.includes('Comunicados')) {
    console.log("Comunicados text exists");
}
// Find if there's any API url in the script tags
const scriptMatches = html.match(/<script.*?>.*?<\/script>/gis);
if(scriptMatches) {
    scriptMatches.forEach(s => {
        if(s.includes('fetch') || s.includes('api') || s.includes('ajax')) {
            console.log("Found script with possible fetch/api:", s.substring(0, 200));
        }
    });
}
