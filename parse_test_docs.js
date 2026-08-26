const fs = require('fs');
const cheerio = require('cheerio');

const html = fs.readFileSync('med_comunicados.html', 'utf8');
const $ = cheerio.load(html);

// Find the main container for documents
console.log("Looking for documents...");

$('.card').each((i, el) => {
    if(i < 3) {
        console.log("--- Card", i, "---");
        console.log($(el).text().replace(/\s+/g, ' ').trim());
        const href = $(el).parent('a').attr('href') || $(el).find('a').attr('href');
        console.log("Link:", href);
    }
});
