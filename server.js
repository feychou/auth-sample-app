const http = require('http');

const todos = [
  {id: 1, text: 'todo 1'},
  {id: 2, text: 'todo 2'},
  {id: 3, text: 'todo 3'}
];

const server = http.createServer((req, res) => {
  //res.setHeader('Content-Type', 'application/json');
  //res.setHeader('X-Powered-By', 'Node.js');
  //console.log(req.headers.authorization); access auth token from the request
  const { method, url } = req;
  let body = [];

  req
    .on('data', chunk => {
      body.push(chunk);
    })
    .on('end', () => {
      body = Buffer.concat(body).toString();
      let status = 404;
      const response = {
        success: false,
        data: null
      };

      if(method === 'GET' && url === '/todos') {
        status = 200;
        response.success = true;
        response.data = todos;
      } else if (method === 'POST' && url === '/todos') {
        const {id, text} = JSON.parse(body);

        if (!id || !text) {
          status = 400
          response.error = "please be decent"
        } else {
          todos.push({id, text});
          status = 201;
          response.success = true;
          response.data = todos;         
        }
      }

      res.writeHead(status, {
        'Content-Type': 'application/json',
        'X-Powered-By': 'Node.js'
      });


      res.end(JSON.stringify(response));
    });

});

server.listen(5000, () => console.log(`Server running on port 5000`));