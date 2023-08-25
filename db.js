const { Sequelize } = require('sequelize')
const sqlClient = new Sequelize('postgres', 'pguser', 'password', {
  host: 'postgres',
  dialect: 'postgres'
})


module.exports = { sqlClient }
