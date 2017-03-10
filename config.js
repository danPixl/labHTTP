// Server type
// Should be any JS file under the servertypes directory, omit the .js
const servertype = 'basic'

// Port to listen on
const web_port = 443

// SSL
// Enter the full path to your SSL key and certificate.
const key = ''
const cert = ''

// Password protection
const username = "username"
const password = "password"

module.exports = {servertype, key, cert, username, password, port: process.argv[2] || web_port};
