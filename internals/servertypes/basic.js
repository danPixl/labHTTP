// I'd like to make a note that a lot of the work on the basic servers were already done by this guy:
// https://gist.github.com/ryanflorence/701407
// Mad props to him.

var config = require(process.cwd() + '/config')
https = require('https'),
    url = require('url'),
    path = require('path'),
    fs = require('fs'),
    Remarkable = require('remarkable'),
    hljs = require("highlight.js"),
    request = require('request'),
    port = config.port,
    page = process.cwd() + '/templates/page.html'

const keys = {
  key: fs.readFileSync(config.key),
  cert: fs.readFileSync(config.cert)
}

var convertmd = new Remarkable({
  langPrefix: 'language-',
  html: true,
  linkify: true,
});

https.createServer(keys, function (request, response) {
  var uri = decodeURI(url.parse(request.url).pathname),
    filename = path.join(process.cwd() + '/content/', uri)

  fs.exists(filename, function (exists) {
    if (!exists) {
      response.writeHead(404, {'X-Powered-By': 'labHTTP Pivot'})
      response.end()
      return
    }

    if (fs.statSync(filename).isDirectory()) filename += 'index.md'

    fs.readFile(filename, 'binary', function (err, file) {
      if (err) {
        response.writeHead(500, {'Content-Type': 'text/plain', 'X-Powered-By': 'labHTTP Pivot'})
        response.write(err + '\n')
        response.end()
        return
      }

      var markdown = file

      response.writeHead(200, {'X-Powered-By': 'labHTTP Pivot'})
      console.log(path.extname(filename))
      if (path.extname(filename) == '.md' ) {
        fs.readFile(page, "binary", function(err, file) {
        console.log("It works!")
        var processedpage = file.replace('%content%', convertmd.render(markdown)),
            processedpage = processedpage.replace('%title%', path.basename(filename).replace(/\.[^/.]+$/, ' - ') + config.websiteName)
        response.write(processedpage, 'binary')
        response.end()
        })
      } else {
        console.log("It doesn't.")
        response.write(file, 'binary')
        response.end()
      }
    })
  })
}).listen(parseInt(port, 10))
