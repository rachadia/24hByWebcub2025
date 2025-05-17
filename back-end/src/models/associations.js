import User from './User.js';
import Event from './Event.js';
import Comment from './Comment.js';
import Attachment from './Attachment.js';
import Notification from './Notification.js';

// User-Event relationship (One-to-Many)
User.hasMany(Event, { foreignKey: 'userId', as: 'events' });
Event.belongsTo(User, { foreignKey: 'userId', as: 'author' });

// Event-Event relationship (follow-ups)
Event.hasMany(Event, { foreignKey: 'originalEventId', as: 'followUps' });
Event.belongsTo(Event, { foreignKey: 'originalEventId', as: 'originalEvent' });

// Event-Comment relationship (One-to-Many)
Event.hasMany(Comment, { foreignKey: 'eventId', as: 'comments' });
Comment.belongsTo(Event, { foreignKey: 'eventId' });

// User-Comment relationship (One-to-Many)
User.hasMany(Comment, { foreignKey: 'userId', as: 'comments' });
Comment.belongsTo(User, { foreignKey: 'userId', as: 'author' });

// Event-Attachment relationship (One-to-Many)
Event.hasMany(Attachment, { foreignKey: 'eventId', as: 'attachments' });
Attachment.belongsTo(Event, { foreignKey: 'eventId' });

// User-Notification relationship (One-to-Many)
User.hasMany(Notification, { foreignKey: 'userId', as: 'notifications' });
Notification.belongsTo(User, { foreignKey: 'userId' });

// User-User relationship (for followers/following)
User.belongsToMany(User, { 
  through: 'UserFollowers',
  as: 'followers',
  foreignKey: 'followingId',
  otherKey: 'followerId'
});

User.belongsToMany(User, { 
  through: 'UserFollowers',
  as: 'following',
  foreignKey: 'followerId',
  otherKey: 'followingId'
});

// User-Event relationship (for likes/dislikes)
User.belongsToMany(Event, { 
  through: 'EventReactions',
  as: 'likedEvents',
  foreignKey: 'userId',
  otherKey: 'eventId'
});

Event.belongsToMany(User, { 
  through: 'EventReactions',
  as: 'likedBy',
  foreignKey: 'eventId',
  otherKey: 'userId'
});

export { User, Event, Comment, Attachment, Notification };