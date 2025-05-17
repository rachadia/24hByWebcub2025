import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

const Notification = sequelize.define('Notification', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  type: {
    type: DataTypes.ENUM('comment', 'like', 'dislike', 'follow', 'follow-up'),
    allowNull: false
  },
  message: {
    type: DataTypes.STRING,
    allowNull: false
  },
  isRead: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  relatedEntityId: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  relatedEntityType: {
    type: DataTypes.ENUM('event', 'comment', 'user'),
    allowNull: true
  }
});

export default Notification;