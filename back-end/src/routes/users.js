import express from 'express';
import { body, validationResult } from 'express-validator';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { User, Event, Notification } from '../models/associations.js';
import { isAuthenticated } from '../middleware/auth.js';

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configure multer for profile pictures
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../../uploads/profiles'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'profile-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 2 * 1024 * 1024 // 2MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (extname && mimetype) {
      return cb(null, true);
    }
    cb(new Error('Invalid file type. Only JPEG and PNG images are allowed.'));
  }
});

// Profile validation rules
const profileValidationRules = [
  body('firstName').trim().optional(),
  body('lastName').trim().optional(),
  body('bio').trim().isLength({ max: 500 }).optional(),
];

// Get user profile
router.get('/:username', async (req, res) => {
  try {
    const user = await User.findOne({
      where: { username: req.params.username },
      include: [{
        model: Event,
        as: 'events',
        where: { visibility: 'public' },
        required: false,
        include: ['attachments']
      }]
    });

    if (!user) {
      req.flash('error_msg', 'User not found');
      return res.redirect('/');
    }

    const isFollowing = req.session.user ? 
      await user.hasFollower(req.session.user.id) : 
      false;

    res.render('users/profile', {
      title: `${user.username}'s Profile - The End Page`,
      profileUser: user,
      isFollowing,
      user: req.session.user
    });
  } catch (err) {
    console.error('Error fetching profile:', err);
    req.flash('error_msg', 'Error loading profile');
    res.redirect('/');
  }
});

// Update user profile
router.put('/profile', isAuthenticated, upload.single('profilePicture'), profileValidationRules, async (req, res) => {
  try {
    const user = await User.findByPk(req.session.user.id);
    
    const updateData = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      bio: req.body.bio
    };

    if (req.file) {
      updateData.profilePicture = `/uploads/profiles/${req.file.filename}`;
    }

    await user.update(updateData);

    res.json({ user, message: 'Profile updated successfully' });
  } catch (err) {
    console.error('Error updating profile:', err);
    res.status(500).json({ error: 'Error updating profile' });
  }
});

// Follow/Unfollow user
router.post('/:username/follow', isAuthenticated, async (req, res) => {
  try {
    const userToFollow = await User.findOne({ where: { username: req.params.username } });
    if (!userToFollow) {
      return res.status(404).json({ error: 'User not found' });
    }

    const currentUser = await User.findByPk(req.session.user.id);
    const isFollowing = await userToFollow.hasFollower(currentUser);

    if (isFollowing) {
      await userToFollow.removeFollower(currentUser);
    } else {
      await userToFollow.addFollower(currentUser);
      
      // Create notification
      await Notification.create({
        type: 'follow',
        message: `${currentUser.username} started following you`,
        userId: userToFollow.id,
        relatedEntityId: currentUser.id,
        relatedEntityType: 'user'
      });
    }

    res.json({ 
      following: !isFollowing,
      followerCount: await userToFollow.countFollowers()
    });
  } catch (err) {
    console.error('Error updating follow status:', err);
    res.status(500).json({ error: 'Error updating follow status' });
  }
});

// Get user notifications
router.get('/notifications', isAuthenticated, async (req, res) => {
  try {
    const notifications = await Notification.findAll({
      where: { userId: req.session.user.id, isRead: false },
      order: [['createdAt', 'DESC']]
    });

    res.json({ notifications });
  } catch (err) {
    console.error('Error fetching notifications:', err);
    res.status(500).json({ error: 'Error fetching notifications' });
  }
});

// Mark notification as read
router.put('/notifications/:id', isAuthenticated, async (req, res) => {
  try {
    const notification = await Notification.findOne({
      where: { 
        id: req.params.id,
        userId: req.session.user.id
      }
    });

    if (!notification) {
      return res.status(404).json({ error: 'Notification not found' });
    }

    await notification.update({ isRead: true });
    res.json({ message: 'Notification marked as read' });
  } catch (err) {
    console.error('Error updating notification:', err);
    res.status(500).json({ error: 'Error updating notification' });
  }
});

export default router;