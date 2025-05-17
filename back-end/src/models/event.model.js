import { query } from '../database/db.js';

class EventModel {
  // Create a new event
  async create(eventData) {
    const { user_id, title, content, theme, emotion, likes } = eventData;
    
    const sql = `
      INSERT INTO events 
      (user_id, title, content, theme, emotion, likes) 
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    
    const result = await query(sql, [
      parseInt(user_id),
      title,
      content || null,
      theme || null,
      emotion || null,
      parseInt(likes) || 0
    ]);
    
    return result.insertId;
  }
  
  // Find event by ID with all relations
  async getEventById(id) {
    const sql = `
      SELECT e.*, u.username, u.first_name, u.last_name
      FROM events e
      LEFT JOIN users u ON e.user_id = u.id
      WHERE e.id = ?
    `;
    const events = await query(sql, [parseInt(id)]);
    const event = events[0] || null;

    if (event) {
      // Get comments and attachments
      const [comments, attachments] = await Promise.all([
        this.getComments(parseInt(id)),
        this.getAttachments(parseInt(id))
      ]);
      event.comments = comments;
      event.attachments = attachments;
    }

    return event;
  }
  
  // Find events by user ID
  async findByUserId(userId) {
    const sql = `
      SELECT e.*, u.username, u.first_name, u.last_name
      FROM events e
      LEFT JOIN users u ON e.user_id = u.id
      WHERE e.user_id = ?
      ORDER BY e.created_at DESC
    `;
    const events = await query(sql, [parseInt(userId)]);
    return events;
  }
  
  // Update event
  async update(id, eventData) {
    const { title, content, theme, emotion } = eventData;
    
    const sql = `
      UPDATE events 
      SET title = ?, content = ?, theme = ?, emotion = ?
      WHERE id = ?
    `;
    
    const result = await query(sql, [
      title,
      content || null,
      theme || null,
      emotion || null,
      parseInt(id)
    ]);
    
    return result.affectedRows > 0;
  }
  
  // Delete event and all its relations
  async delete(id) {
    // Start a transaction
    const connection = await query.getConnection();
    await connection.beginTransaction();

    try {
      // Delete comments
      await connection.query('DELETE FROM event_comments WHERE event_id = ?', [parseInt(id)]);
      
      // Delete attachments
      await connection.query('DELETE FROM event_attachments WHERE event_id = ?', [parseInt(id)]);
      
      // Delete event
      const result = await connection.query('DELETE FROM events WHERE id = ?', [parseInt(id)]);
      
      await connection.commit();
      return result.affectedRows > 0;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }
  
  // List all events
  async findAll() {
    const sql = `
      SELECT e.*, u.username, u.first_name, u.last_name, u.profile_picture,
             (SELECT COUNT(*) FROM event_comments WHERE event_id = e.id) as comment_count,
             e.likes as like_count
      FROM events e
      JOIN users u ON e.user_id = u.id
      ORDER BY e.created_at DESC
    `;
    
    try {
      const events = await query(sql);
      return events;
    } catch (error) {
      console.error('Error in findAll:', error);
      throw error;
    }
  }

  // Get event comments
  async getComments(eventId) {
    const sql = `
      SELECT ec.*, u.username, u.first_name, u.last_name
      FROM event_comments ec
      LEFT JOIN users u ON ec.user_id = u.id
      WHERE ec.event_id = ?
      ORDER BY ec.created_at DESC
    `;
    const comments = await query(sql, [parseInt(eventId)]);
    return comments;
  }

  // Get event attachments
  async getAttachments(eventId) {
    const sql = `
      SELECT * FROM event_attachments
      WHERE event_id = ?
      ORDER BY created_at DESC
    `;
    const attachments = await query(sql, [parseInt(eventId)]);
    return attachments;
  }

  // Add attachment to event
  async addAttachment(eventId, attachmentUrl) {
    const sql = `
      INSERT INTO event_attachments 
      (event_id, attachment_url) 
      VALUES (?, ?)
    `;
    
    const result = await query(sql, [parseInt(eventId), attachmentUrl]);
    return result.insertId;
  }

  // Delete attachment
  async deleteAttachment(attachmentId, eventId) {
    const sql = `
      DELETE FROM event_attachments 
      WHERE id = ? AND event_id = ?
    `;
    
    const result = await query(sql, [parseInt(attachmentId), parseInt(eventId)]);
    return result.affectedRows > 0;
  }

  // Add comment to event
  async addComment(eventId, userId, content) {
    const sql = `
      INSERT INTO event_comments 
      (event_id, user_id, content) 
      VALUES (?, ?, ?)
    `;
    
    const result = await query(sql, [parseInt(eventId), parseInt(userId), content]);
    return result.insertId;
  }

  // Delete comment
  async deleteComment(commentId, userId) {
    const sql = `
      DELETE FROM event_comments 
      WHERE id = ? AND user_id = ?
    `;
    
    const result = await query(sql, [parseInt(commentId), parseInt(userId)]);
    return result.affectedRows > 0;
  }

  // Update likes count
  async updateLikes(id, increment = true) {
    const sql = `
      UPDATE events 
      SET likes = likes ${increment ? '+' : '-'} 1 
      WHERE id = ?
    `;
    
    const result = await query(sql, [parseInt(id)]);
    return result.affectedRows > 0;
  }
}

export default new EventModel(); 