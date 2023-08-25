const { DataTypes, Model } = require('sequelize')
const {sqlClient} = require('../db'); 
class User extends Model {}
User.init(
  {
    id: {
      primaryKey: true,
      type: DataTypes.STRING,
      allowNull: false
    },
    lastRelapseTimestamp: {
      type: DataTypes.STRING,
      allowNull: false
    }
  },
  { sequelize: sqlClient, modelName: 'User' }
)
export default User; 