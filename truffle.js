// Allows us to use ES6 in our migrations and tests.
require('babel-register')

module.exports = {
  networks: {
    development: {
      host: '192.168.157.2',
      port: 8546,
      network_id: '*' // Match any network id
    }
  }
}
