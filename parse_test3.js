const fs = require('fs');
const cheerio = require('cheerio');

const html = fs.readFileSync('med_noticias.html', 'utf8');
const $ = cheerio.load(html);

$('.img-news').each((i, el) => {
    if(i === 0) {
        console.log($.html(el));
    }
});
