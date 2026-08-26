const fs = require('fs');
const cheerio = require('cheerio');

const html = fs.readFileSync('med_noticias.html', 'utf8');
const $ = cheerio.load(html);

console.log("Total links:", $('a').length);

// Let's try to find container classes for news
// Usually they are in an article, or a div with class containing 'news' or 'noticia'
$('div').each((i, el) => {
    const cls = $(el).attr('class') || '';
    if (cls.toLowerCase().includes('noticia') || cls.toLowerCase().includes('news') || cls.toLowerCase().includes('item')) {
        console.log("Found class:", cls);
    }
});

// Let's find the main content area
console.log("\nH1 elements:");
$('h1').each((i, el) => console.log($(el).text().trim(), $(el).attr('class')));

console.log("\nH2 elements:");
$('h2').each((i, el) => console.log($(el).text().trim(), $(el).attr('class')));

console.log("\nH3 elements:");
$('h3').each((i, el) => console.log($(el).text().trim(), $(el).attr('class')));

console.log("\nDates:");
// Look for common date formats or classes
$('*').each((i, el) => {
    const cls = $(el).attr('class') || '';
    if (cls.toLowerCase().includes('date') || cls.toLowerCase().includes('data')) {
        console.log("Date class:", cls, "=>", $(el).text().trim().substring(0, 50));
    }
});
