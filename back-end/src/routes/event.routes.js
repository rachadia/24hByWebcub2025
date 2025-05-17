import express from 'express';
import EventController from '../controllers/event.controller.js';
import { authenticate, isAdmin } from '../middleware/auth.middleware.js';
import {
  createEventValidation,
  updateEventValidation,
  eventIdValidation,
  commentValidation,
  attachmentValidation,
  likeValidation
} from '../middleware/validation.middleware.js';
import upload from '../middleware/upload.middleware.js';

const router = express.Router();

/**
 * @swagger
 * /api/events:
 *   get:
 *     summary: Get all events
 *     tags: [Events]
 *     responses:
 *       200:
 *         description: List of all events
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Event'
 *       500:
 *         description: Server error
 */
router.get('/', EventController.getAllEvents);

/**
 * @swagger
 * /api/events/{id}:
 *   get:
 *     summary: Get event by ID
 *     tags: [Events]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Event ID
 *     responses:
 *       200:
 *         description: Event details with comments and attachments
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/Event'
 *                 - type: object
 *                   properties:
 *                     comments:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/EventComment'
 *                     attachments:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/EventAttachment'
 *       404:
 *         description: Event not found
 */
router.get('/:id', authenticate, eventIdValidation, EventController.getEventById);

/**
 * @swagger
 * /api/events/user/{userId}:
 *   get:
 *     summary: Get events by user ID
 *     tags: [Events]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *         description: User ID
 *     responses:
 *       200:
 *         description: List of events for the specified user
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Event'
 *       401:
 *         description: Unauthorized
 */
router.get('/user/:userId', authenticate, EventController.getEventsByUserId);

/**
 * @swagger
 * /api/events:
 *   post:
 *     summary: Create new event
 *     tags: [Events]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *               theme:
 *                 type: string
 *               emotion:
 *                 type: string
 *     responses:
 *       201:
 *         description: Event created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Event'
 *       400:
 *         description: Title is required
 *       401:
 *         description: Unauthorized
 */
router.post('/', authenticate, createEventValidation, EventController.createEvent);

/**
 * @swagger
 * /api/events/{id}:
 *   put:
 *     summary: Update event
 *     tags: [Events]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Event ID
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *               theme:
 *                 type: string
 *               emotion:
 *                 type: string
 *     responses:
 *       200:
 *         description: Event updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Event'
 *       403:
 *         description: Forbidden - can only update own events
 *       404:
 *         description: Event not found
 */
router.put('/:id', authenticate, eventIdValidation, updateEventValidation, EventController.updateEvent);

/**
 * @swagger
 * /api/events/{id}:
 *   delete:
 *     summary: Delete event
 *     tags: [Events]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Event ID
 *     responses:
 *       200:
 *         description: Event deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Event deleted successfully
 *       403:
 *         description: Forbidden - can only delete own events
 *       404:
 *         description: Event not found
 */
router.delete('/:id', authenticate, eventIdValidation, EventController.deleteEvent);

/**
 * @swagger
 * /api/events/{id}/comments:
 *   post:
 *     summary: Add comment to event
 *     tags: [Events]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Event ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - content
 *             properties:
 *               content:
 *                 type: string
 *     responses:
 *       201:
 *         description: Comment added successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/EventComment'
 *       400:
 *         description: Comment content is required
 *       404:
 *         description: Event not found
 */
router.post('/:id/comments', authenticate, eventIdValidation, commentValidation, EventController.addComment);

/**
 * @swagger
 * /api/events/{id}/attachments:
 *   post:
 *     summary: Add attachment to event
 *     tags: [Events]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Event ID
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - file
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: File to upload (images or documents, max 5MB)
 *     responses:
 *       201:
 *         description: Attachment added successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/EventAttachment'
 *       400:
 *         description: Invalid file type or size
 *       403:
 *         description: Forbidden - can only add attachments to own events
 *       404:
 *         description: Event not found
 */
router.post('/:id/attachments', 
  authenticate, 
  eventIdValidation, 
  upload.single('file'), 
  EventController.addAttachment
);

/**
 * @swagger
 * /api/events/{id}/likes:
 *   post:
 *     summary: Update event likes
 *     tags: [Events]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Event ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - increment
 *             properties:
 *               increment:
 *                 type: boolean
 *                 description: true to increment likes, false to decrement
 *                 example: true
 *     responses:
 *       200:
 *         description: Likes updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 likes:
 *                   type: integer
 *                   description: Updated number of likes
 *                   example: 42
 *       404:
 *         description: Event not found
 */
router.post('/:id/likes', authenticate, eventIdValidation, likeValidation, EventController.updateLikes);

/**
 * @swagger
 * /api/events/{id}/comments/{commentId}:
 *   delete:
 *     summary: Delete a comment
 *     tags: [Events]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Event ID
 *       - in: path
 *         name: commentId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Comment ID
 *     responses:
 *       200:
 *         description: Comment deleted successfully
 *       403:
 *         description: Forbidden - can only delete own comments
 *       404:
 *         description: Comment not found
 */
router.delete('/:id/comments/:commentId', authenticate, eventIdValidation, EventController.deleteComment);

/**
 * @swagger
 * /api/events/{id}/attachments/{attachmentId}:
 *   delete:
 *     summary: Delete an attachment
 *     tags: [Events]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Event ID
 *       - in: path
 *         name: attachmentId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Attachment ID
 *     responses:
 *       200:
 *         description: Attachment deleted successfully
 *       403:
 *         description: Forbidden - can only delete attachments from own events
 *       404:
 *         description: Attachment not found
 */
router.delete('/:id/attachments/:attachmentId', authenticate, eventIdValidation, EventController.deleteAttachment);

export default router; 