import EventModel from '../models/event.model.js';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class EventController {
  // Get all events
  async getAllEvents(req, res, next) {
    try {
      const events = await EventModel.findAll();
      res.json(events);
    } catch (error) {
      console.error('Error in getAllEvents:', error);
      next(error);
    }
  }
  
  // Get event by ID
  async getEventById(req, res, next) {
    try {
      const { id } = req.params;
      
      const event = await EventModel.getEventById(id);
      if (!event) {
        return res.status(404).json({ message: 'Event not found' });
      }
      
      res.status(200).json(event);
    } catch (error) {
      next(error);
    }
  }

  // Get events by user ID
  async getEventsByUserId(req, res, next) {
    try {
      const { userId } = req.params;
      
      const events = await EventModel.findByUserId(userId);
      
      res.status(200).json(events);
    } catch (error) {
      next(error);
    }
  }
  
  // Create new event
  async createEvent(req, res, next) {
    try {
      const { userId } = req.user;
      const { title, content, theme, emotion } = req.body;
      
      if (!title) {
        return res.status(400).json({ message: 'Title is required' });
      }
      
      const eventData = {
        user_id: userId,
        title,
        content,
        theme,
        emotion,
        likes: 0
      };
      
      const eventId = await EventModel.create(eventData);
      const event = await EventModel.getEventById(eventId);
      
      res.status(201).json(event);
    } catch (error) {
      next(error);
    }
  }
  
  // Update event
  async updateEvent(req, res, next) {
    try {
      const { userId, role } = req.user;
      const { id } = req.params;
      
      const event = await EventModel.getEventById(id);
      if (!event) {
        return res.status(404).json({ message: 'Event not found' });
      }
      
      // Check if user is updating their own event or if they're an admin
      if (event.user_id !== userId && role !== 'admin') {
        return res.status(403).json({ message: 'Forbidden: You can only update your own events' });
      }
      
      const { title, content, theme, emotion } = req.body;
      const updateData = { title, content, theme, emotion };
      
      // Update event
      const updated = await EventModel.update(id, updateData);
      if (!updated) {
        return res.status(404).json({ message: 'Event not found or no changes applied' });
      }
      
      // Get updated event
      const updatedEvent = await EventModel.getEventById(id);
      
      res.status(200).json(updatedEvent);
    } catch (error) {
      next(error);
    }
  }
  
  // Delete event
  async deleteEvent(req, res, next) {
    try {
      const { userId, role } = req.user;
      const { id } = req.params;
      
      const event = await EventModel.getEventById(id);
      if (!event) {
        return res.status(404).json({ message: 'Event not found' });
      }
      
      // Check if user is deleting their own event or if they're an admin
      if (event.user_id !== userId && role !== 'admin') {
        return res.status(403).json({ message: 'Forbidden: You can only delete your own events' });
      }

      // Delete all attachment files
      for (const attachment of event.attachments) {
        const filePath = path.join(__dirname, '../../', attachment.attachment_url);
        try {
          await fs.unlink(filePath);
        } catch (error) {
          console.error('Error deleting file:', error);
        }
      }
      
      const deleted = await EventModel.delete(id);
      if (!deleted) {
        return res.status(404).json({ message: 'Event not found' });
      }
      
      res.status(200).json({ message: 'Event deleted successfully' });
    } catch (error) {
      next(error);
    }
  }

  // Add comment to event
  async addComment(req, res, next) {
    try {
      const { userId } = req.user;
      const { id } = req.params;
      const { content } = req.body;
      
      if (!content) {
        return res.status(400).json({ message: 'Comment content is required' });
      }
      
      const event = await EventModel.getEventById(id);
      if (!event) {
        return res.status(404).json({ message: 'Event not found' });
      }
      
      const commentId = await EventModel.addComment(id, userId, content);
      const comment = await EventModel.getComments(id).then(comments => 
        comments.find(c => c.id === commentId)
      );
      
      res.status(201).json(comment);
    } catch (error) {
      next(error);
    }
  }

  // Delete comment
  async deleteComment(req, res, next) {
    try {
      const { userId } = req.user;
      const { id, commentId } = req.params;
      
      const event = await EventModel.getEventById(id);
      if (!event) {
        return res.status(404).json({ message: 'Event not found' });
      }

      const deleted = await EventModel.deleteComment(commentId, userId);
      if (!deleted) {
        return res.status(404).json({ message: 'Comment not found or unauthorized' });
      }

      res.status(200).json({ message: 'Comment deleted successfully' });
    } catch (error) {
      next(error);
    }
  }

  // Add attachment to event
  async addAttachment(req, res, next) {
    try {
      const eventId = parseInt(req.params.id);
      const userId = req.user.id;

      // Check if event exists and belongs to user
      const event = await EventModel.getEventById(eventId);
      if (!event) {
        return res.status(404).json({ message: 'Event not found' });
      }

      if (event.user_id !== userId) {
        return res.status(403).json({ message: 'Forbidden - can only add attachments to own events' });
      }

      // Check if file was uploaded
      if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
      }

      // Create attachment URL
      const attachmentUrl = `/uploads/events/${req.file.filename}`;

      // Add attachment to database
      const attachmentId = await EventModel.addAttachment(eventId, attachmentUrl);
      const attachment = await EventModel.getAttachments(eventId).then(attachments =>
        attachments.find(a => a.id === attachmentId)
      );

      res.status(201).json(attachment);
    } catch (error) {
      // If there's an error, try to delete the uploaded file
      if (req.file) {
        const filePath = path.join(__dirname, '../../', req.file.path);
        try {
          await fs.unlink(filePath);
        } catch (error) {
          console.error('Error deleting file:', error);
        }
      }
      next(error);
    }
  }

  // Delete attachment
  async deleteAttachment(req, res, next) {
    try {
      const { id, attachmentId } = req.params;
      const userId = req.user.id;

      const event = await EventModel.getEventById(id);
      if (!event) {
        return res.status(404).json({ message: 'Event not found' });
      }

      if (event.user_id !== userId) {
        return res.status(403).json({ message: 'Forbidden - can only delete attachments from own events' });
      }

      const attachment = event.attachments.find(a => a.id === parseInt(attachmentId));
      if (!attachment) {
        return res.status(404).json({ message: 'Attachment not found' });
      }

      // Delete file from filesystem
      const filePath = path.join(__dirname, '../../', attachment.attachment_url);
      try {
        await fs.unlink(filePath);
      } catch (error) {
        console.error('Error deleting file:', error);
      }

      // Delete attachment from database
      const deleted = await EventModel.deleteAttachment(attachmentId, id);
      if (!deleted) {
        return res.status(404).json({ message: 'Attachment not found' });
      }

      res.status(200).json({ message: 'Attachment deleted successfully' });
    } catch (error) {
      next(error);
    }
  }

  // Update likes
  async updateLikes(req, res, next) {
    try {
      const { id } = req.params;
      const { increment } = req.body;
      
      const event = await EventModel.getEventById(id);
      if (!event) {
        return res.status(404).json({ message: 'Event not found' });
      }
      
      const updated = await EventModel.updateLikes(id, increment);
      if (!updated) {
        return res.status(404).json({ message: 'Event not found' });
      }
      
      const updatedEvent = await EventModel.getEventById(id);
      
      res.status(200).json({
        likes: updatedEvent.likes
      });
    } catch (error) {
      next(error);
    }
  }

  // Get podium of events
  async getPodium(req, res, next) {
    try {
      const events = await EventModel.getPodium();
      res.json(events);
    } catch (error) {
      console.error('Error in getPodium:', error);
      next(error);
    }
  }
}

export default new EventController(); 