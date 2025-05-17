# The End Page

The End Page is a platform that allows users to share life events, track emotions, and follow their emotional journey over time.

## Project Overview

The End Page provides a space for users to document significant moments in their lives, capture their feelings, and observe how their emotional responses evolve over time. The application analyzes text content to detect emotions and provides thematic visualizations based on the identified mood.

## Features

- **User Authentication**: Secure registration and login system
- **Event Creation**: Post life events with text descriptions and file attachments
- **Mood Detection**: Automatic analysis of text to identify the primary emotion
- **Visual Themes**: Dynamic visual themes based on detected emotions
- **Event Timeline**: Chronological display of user events
- **Follow-up Entries**: Add new perspectives to past events as thoughts evolve
- **Social Interaction**: Comment on and react to events
- **Notifications**: Get notified of interactions with your content
- **Responsive Design**: Optimized for all device sizes

## Tech Stack

- **Backend**: Node.js with Express.js
- **Database**: MySQL with Sequelize ORM
- **View Engine**: EJS templates
- **Authentication**: JWT-based authentication
- **File Handling**: Multer for file uploads
- **Styling**: Tailwind CSS for responsive design
- **Animation**: CSS animations for interactions
- **Natural Language Processing**: NLP for mood detection

## Installation

1. Clone the repository:
```
git clone https://github.com/yourusername/the-end-page.git
cd the-end-page
```

2. Install dependencies:
```
npm install
```

3. Create a `.env` file in the root directory with the following variables (based on `.env.example`):
```
PORT=3000
NODE_ENV=development
JWT_SECRET=your_jwt_secret_key_here
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=the_end_page_db
EMAIL_HOST=smtp.example.com
EMAIL_PORT=587
EMAIL_USER=your_email@example.com
EMAIL_PASS=your_email_password
```

4. Create the MySQL database:
```
mysql -u root -p
```
```sql
CREATE DATABASE the_end_page_db;
```

5. Run the application:
```
npm run dev
```

## Database Structure

- **Users**: User accounts and profiles
- **Events**: User-created life events with content and mood data
- **Attachments**: Files linked to events (images, videos, documents)
- **Comments**: User comments on events
- **Notifications**: System notifications for user interactions

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the ISC License.

## Acknowledgments

- Natural language processing libraries for mood detection
- Express.js community for the robust web framework
- Sequelize team for the excellent ORM
- Tailwind CSS for the utility-first CSS framework