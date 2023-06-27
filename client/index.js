const http = require('http');
const fs = require('fs');
const ejs = require('ejs');

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html' });

  const templatePath = 'template.ejs';
  const name = 'John'; // Replace with the desired value
  const sender = process.env.SEND_TO_DYNAMODB_API
  fs.readFile(templatePath, 'utf8', (err, template) => {
    if (err) {
      console.error(err);
      res.end('<h1>Error reading template file</h1>');
    } else {
      const renderedHtml = ejs.render(template, { sender });
      res.end(renderedHtml);
    }
  });
});

const PORT = 3000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
