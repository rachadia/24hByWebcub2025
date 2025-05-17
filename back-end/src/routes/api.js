import express from 'express';
import jwt from 'jsonwebtoken';
import { Event, User, Comment, Notification } from '../models/associations.js';

const router = express.Router();

// API Authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Authentication token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET || 'secret_key', (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

// Get user's events
router.get('/events', authenticateToken, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const events = await Event.findAndCountAll({
      where: { userId: req.user.id },
      include: [
        { model: User, as: 'author', attributes: ['username', 'profilePicture'] },
        { model: Comment, as: 'comments', include: ['author'] }
      ],
      limit,
      offset,
      order: [['createdAt', 'DESC']]
    });

    res.json({
      events: events.rows,
      totalPages: Math.ceil(events.count / limit),
      currentPage: page
    });
  } catch (err) {
    console.error('Error fetching events:', err);
    res.status(500).json({ error: 'Error fetching events' });
  }
});

// Get event statistics
router.get('/events/stats', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    
    const totalEvents = await Event.count({ where: { userId } });
    const totalLikes = await Event.sum('likes', { where: { userId } });
    const totalViews = await Event.sum('viewCount', { where: { userId } });
    
    const moodDistribution = await Event.findAll({
      attributes: ['mood', [sequelize.fn('count', '*'), 'count']],
      where: { userId },
      group: ['mood']
    });

    res.json({
      totalEvents,
      totalLikes,
      totalViews,
      moodDistribution
    });
  } catch (err) {
    console.error('Error fetching statistics:', err);
    res.status(500).json({ error: 'Error fetching statistics' });
  }
});

// Get user's notifications
router.get('/notifications', authenticateToken, async (req, res) => {
  try {
    const notifications = await Notification.findAll({
      where: { userId: req.user.id },
      order: [['createdAt', 'DESC']],
      limit: 50
    });

    res.json({ notifications });
  } catch (err) {
    console.error('Error fetching notifications:', err);
    res.status(500).json({ error: 'Error fetching notifications' });
  }
});

// Search events
router.get('/search', authenticateToken, async (req, res) => {
  try {
    const { q, mood, startDate, endDate } = req.query;
    const where = {};

    if (q) {
      where[Op.or] = [
        { title: { [Op.like]: `%${q}%` } },
        { content: { [Op.like]: `%${q}%` } }
      ];
    }

    if (mood) {
      where.mood = mood;
    }

    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) where.createdAt[Op.gte] = new Date(startDate);
      if (endDate) where.createdAt[Op.lte] = new Date(endDate);
    }

    const events = await Event.findAll({
      where,
      include: [
        { model: User, as: 'author', attributes: ['username', 'profilePicture'] }
      ],
      order: [['createdAt', 'DESC']],
      limit: 20
    });

    res.json({ events });
  } catch (err) {
    console.error('Error searching events:', err);
    res.status(500).json({ error: 'Error searching events' });
  }
});

export default router;