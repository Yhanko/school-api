const fs = require('fs');
const cheerio = require('cheerio');

const html = fs.readFileSync('med_noticias.html', 'utf8');
const $ = cheerio.load(html);

$('.img-news').each((i, el) => {
    if(i === 0) {
        console.log("Parent tag:", $(el).parent()[0].tagName);
        console.log("Parent href:", $(el).parent().attr('href'));
    }
});
