const fs = require('fs');
const cheerio = require('cheerio');

const html = fs.readFileSync('med_comunicados.html', 'utf8');
const $ = cheerio.load(html);

// Dump all potential document containers
console.log("Looking for h1, h2, h3, h4, h5, tr, li...");
$('h3, h4, h5, tr, li, .document-item, .item').each((i, el) => {
    const cls = $(el).attr('class') || '';
    const text = $(el).text().replace(/\s+/g, ' ').trim();
    if(text.length > 20 && (cls || $(el).find('a').length > 0)) {
        console.log("Tag:", el.tagName, "| Class:", cls, "| Text:", text.substring(0, 100));
        const href = $(el).find('a').attr('href') || $(el).attr('href');
        if (href) console.log("  Link:", href);
    }
});
