const fs = require('fs');
const cheerio = require('cheerio');

const html = fs.readFileSync('med_noticias.html', 'utf8');
const $ = cheerio.load(html);

$('.img-news').each((i, el) => {
    console.log("--- News item", i, "---");
    console.log("Text:", $(el).text().replace(/\s+/g, ' ').trim());
    const links = [];
    $(el).find('a').each((_, a) => links.push($(a).attr('href')));
    console.log("Links:", links);
});
