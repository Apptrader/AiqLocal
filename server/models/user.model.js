import { DataTypes } from 'sequelize';
import sequelize from '../dbconnection.js';
import PaidPlan from './paidplans.model.js';
import Rank from './rank.model.js';
import WalletType from './walleType.model.js';

const User = sequelize.define('user', {
  idUser: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    allowNull: false,
    primaryKey: true
  },
  UserName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  UserLastName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  Email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  Password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  UserCode: {
    type: DataTypes.INTEGER,
    allowNull: true,
    unique: true
  },
  Phone: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  CodeReferenced: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  pointsRight: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  pointsLeft: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  idPaidPlan: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  referralsCount: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  position: {
    type: DataTypes.STRING,
    allowNull: true
  },
  status: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  rank_id: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  highestRank: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  aiqToken: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  payAmount: {
    type: DataTypes.FLOAT,
    allowNull: true
  },
  enrollmentVolume: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  directLeft: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  directRight: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  role: {
    type: DataTypes.ENUM('0', '1'),
    allowNull: false,
    defaultValue: '0'
  },
  walletLink: {
    type: DataTypes.STRING,
    allowNull: true
  },
  walletTypeId: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  elegibility: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
    defaultValue: false
  },
  onlySubs: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
    defaultValue: false
  }

});

User.beforeCreate((user, options) => {
  return User.max('UserCode')
    .then(max => {
      user.UserCode = (max || 912003) + 1;
    });
});



User.belongsTo(PaidPlan, { foreignKey: 'idPaidPlan' });
User.belongsTo(Rank, { foreignKey: 'rank_id' });
User.belongsTo(WalletType, { foreignKey: 'walletTypeId' });


export default User;