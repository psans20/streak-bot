export const sqlClient = new Sequelize('postgres', 'pguser', 'password', {
  host: 'postgres',
  dialect: 'postgres'
})
