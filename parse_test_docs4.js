const fs = require('fs');
const cheerio = require('cheerio');

const html = fs.readFileSync('med_comunicados.html', 'utf8');
const $ = cheerio.load(html);

// Find the main content div, maybe `.container` or `.main`
let mainContent = '';
$('main, .container, #content, section').each((i, el) => {
    const text = $(el).text().replace(/\s+/g, ' ').trim();
    if(text.includes('Comunicados') && text.length > 50) {
        console.log("Found container:", el.tagName, $(el).attr('class'));
        // console.log("Text:", text.substring(0, 500));
    }
});

// Let's print out the text of any a tag with href containing .pdf or docs
$('a').each((i, el) => {
    const href = $(el).attr('href');
    if(href && (href.includes('.pdf') || href.includes('/documentos/'))) {
        console.log("Doc Link:", href, $(el).text().trim());
    }
});
