const http = require('http');
const fs = require('fs');
const ejs = require('ejs');

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html' });

  const templatePath = 'template.ejs';
  const getter = process.env.GET_FROM_DYNAMODB_API
  fs.readFile(templatePath, 'utf8', (err, template) => {
    if (err) {
      console.error(err);
      res.end('<h1>Error reading template file</h1>');
    } else {
      const renderedHtml = ejs.render(template, { getter });
      res.end(renderedHtml);
    }
  });
});

const PORT = 3000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
