const fs = require('fs');
const http = require('http');
const url = require('url');
const slugify = require('slugify');
const replaceTemplate = require('./modules/replaceTemplate')





const tempOverview = fs.readFileSync(`${__dirname}/templates/template-overview.html`, 'utf-8');
const tempCard = fs.readFileSync(`${__dirname}/templates/template-card.html`, 'utf-8');
const tempProduct = fs.readFileSync(`${__dirname}/templates/template-product.html`, 'utf-8');

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
const dataObj = JSON.parse(data);


const server = http.createServer((req, resp) => {
    const { query, pathname } = url.parse(req.url, true);
    if (pathname == '/' || pathname === '/overview') {

        resp.writeHead(200, {
            'Content-type': 'text/html',
        });

        const cardsHtml = dataObj.map(el => replaceTemplate(tempCard, el)).join('');
        const output = tempOverview.replace('{%PRODUCT_CARDS%}', cardsHtml);
        resp.end(output);

    } else if (pathname === '/product') {
        resp.writeHead(200, {
            'Content-type': 'text/html',
        });
        const product = dataObj[query.id];
        const output = replaceTemplate(tempProduct, product);
        resp.end(output);
    } else if (pathname === '/api') {

        resp.writeHead(200, {
            'Content-type': 'application/json',
        });
        resp.end(data);

    } else {
        resp.writeHead(404, {
            'Content-type': 'text/html',
        });
        resp.end('<h1>Page Not Found!</h1>')
    }
})

server.listen(8000, '127.0.0.1', () => {
    console.log('Listening on port 8000');
})