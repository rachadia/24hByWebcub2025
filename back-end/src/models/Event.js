import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

const Event = sequelize.define('Event', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [1, 200]
    }
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  mood: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      isIn: [['joy', 'sadness', 'anger', 'fear', 'surprise', 'disgust', 'neutral']]
    }
  },
  theme: {
    type: DataTypes.STRING,
    allowNull: true
  },
  visibility: {
    type: DataTypes.ENUM('public', 'private', 'friends'),
    defaultValue: 'private'
  },
  likes: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  dislikes: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  viewCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  isFollowUp: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  originalEventId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'events',
      key: 'id'
    }
  }
});

export default Event;