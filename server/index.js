const http = require('http');
const fs = require('fs');
const ejs = require('ejs');

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html' });
  const sender = process.env.SEND_TO_DYNAMODB_API;

  fs.readFile('template.ejs', 'utf8', (err, template) => {
    if (err) {
      res.statusCode = 500;
      res.end('Error reading template file');
      return;
    }

    const renderedTemplate = ejs.render(template, { sender });
    res.end(renderedTemplate);
  });
});

const PORT = 3000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
This updated code assumes that you have a separate file called template.ejs that contai
