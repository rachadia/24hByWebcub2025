import express from 'express';
import { body, validationResult } from 'express-validator';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { Event, Attachment, Comment, User } from '../models/associations.js';
import { isAuthenticated } from '../middleware/auth.js';
import { detectMood } from '../utils/moodDetection.js';

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../../uploads'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|pdf|doc|docx/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (extname && mimetype) {
      return cb(null, true);
    }
    cb(new Error('Invalid file type. Only images, PDFs, and documents are allowed.'));
  }
});

// Validation rules for events
const eventValidationRules = [
  body('title').trim().isLength({ min: 1, max: 200 }).withMessage('Title must be between 1 and 200 characters'),
  body('content').trim().notEmpty().withMessage('Content is required'),
  body('visibility').isIn(['public', 'private', 'friends']).withMessage('Invalid visibility option')
];

// Get all events (with pagination and filters)
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    
    const events = await Event.findAndCountAll({
      where: { visibility: 'public' },
      include: [
        { model: User, as: 'author', attributes: ['username', 'profilePicture'] },
        { model: Attachment, as: 'attachments' }
      ],
      limit,
      offset,
      order: [['createdAt', 'DESC']]
    });

    res.render('events/index', {
      title: 'Recent Events - The End Page',
      events: events.rows,
      currentPage: page,
      totalPages: Math.ceil(events.count / limit),
      user: req.session.user
    });
  } catch (err) {
    console.error('Error fetching events:', err);
    req.flash('error_msg', 'Error loading events');
    res.redirect('/');
  }
});

// Create new event
router.post('/', isAuthenticated, upload.array('attachments', 5), eventValidationRules, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, content, visibility } = req.body;
    const mood = await detectMood(content);
    
    const event = await Event.create({
      title,
      content,
      mood,
      visibility,
      userId: req.session.user.id
    });

    // Handle file uploads
    if (req.files && req.files.length > 0) {
      const attachments = req.files.map(file => ({
        filename: file.filename,
        originalName: file.originalname,
        fileType: file.mimetype,
        fileSize: file.size,
        filePath: file.path,
        eventId: event.id
      }));

      await Attachment.bulkCreate(attachments);
    }

    res.status(201).json({ event, message: 'Event created successfully' });
  } catch (err) {
    console.error('Error creating event:', err);
    res.status(500).json({ error: 'Error creating event' });
  }
});

// Get single event
router.get('/:id', async (req, res) => {
  try {
    const event = await Event.findByPk(req.params.id, {
      include: [
        { model: User, as: 'author', attributes: ['username', 'profilePicture'] },
        { model: Attachment, as: 'attachments' },
        { 
          model: Comment,
          as: 'comments',
          include: [{ model: User, as: 'author', attributes: ['username', 'profilePicture'] }]
        }
      ]
    });

    if (!event) {
      req.flash('error_msg', 'Event not found');
      return res.redirect('/events');
    }

    // Increment view count
    await event.increment('viewCount');

    res.render('events/show', {
      title: `${event.title} - The End Page`,
      event,
      user: req.session.user
    });
  } catch (err) {
    console.error('Error fetching event:', err);
    req.flash('error_msg', 'Error loading event');
    res.redirect('/events');
  }
});

// Update event
router.put('/:id', isAuthenticated, eventValidationRules, async (req, res) => {
  try {
    const event = await Event.findByPk(req.params.id);
    
    if (!event || event.userId !== req.session.user.id) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const { title, content, visibility } = req.body;
    const mood = await detectMood(content);

    await event.update({ title, content, mood, visibility });
    
    res.json({ event, message: 'Event updated successfully' });
  } catch (err) {
    console.error('Error updating event:', err);
    res.status(500).json({ error: 'Error updating event' });
  }
});

// Delete event
router.delete('/:id', isAuthenticated, async (req, res) => {
  try {
    const event = await Event.findByPk(req.params.id);
    
    if (!event || event.userId !== req.session.user.id) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    await event.destroy();
    res.json({ message: 'Event deleted successfully' });
  } catch (err) {
    console.error('Error deleting event:', err);
    res.status(500).json({ error: 'Error deleting event' });
  }
});

// Add comment to event
router.post('/:id/comments', isAuthenticated, async (req, res) => {
  try {
    const event = await Event.findByPk(req.params.id);
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    const comment = await Comment.create({
      content: req.body.content,
      eventId: event.id,
      userId: req.session.user.id
    });

    res.status(201).json({ comment, message: 'Comment added successfully' });
  } catch (err) {
    console.error('Error adding comment:', err);
    res.status(500).json({ error: 'Error adding comment' });
  }
});

// Like/Unlike event
router.post('/:id/like', isAuthenticated, async (req, res) => {
  try {
    const event = await Event.findByPk(req.params.id);
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    const user = await User.findByPk(req.session.user.id);
    const hasLiked = await event.hasLikedBy(user);

    if (hasLiked) {
      await event.removeLikedBy(user);
      await event.decrement('likes');
    } else {
      await event.addLikedBy(user);
      await event.increment('likes');
    }

    res.json({ likes: event.likes, hasLiked: !hasLiked });
  } catch (err) {
    console.error('Error updating like:', err);
    res.status(500).json({ error: 'Error updating like' });
  }
});

export default router;