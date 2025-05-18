import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import swaggerJsDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

// Load environment variables
dotenv.config();

// Import routes
import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/user.routes.js';
import eventRoutes from './routes/event.routes.js';
import { errorHandler } from './middleware/error.middleware.js';
import { notFound } from './middleware/notFound.middleware.js';

// Initialize express app
const app = express();
const PORT = process.env.PORT || 3000;

// Swagger configuration
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Express MySQL Auth API',
      version: '1.0.0',
      description: 'API documentation for Express MySQL Authentication system',
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              description: 'The user ID'
            },
            username: {
              type: 'string',
              description: 'The username'
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'The user email'
            },
            first_name: {
              type: 'string',
              description: 'The user first name'
            },
            last_name: {
              type: 'string',
              description: 'The user last name'
            },
            profile_picture: {
              type: 'string',
              description: 'URL to the user profile picture'
            },
            role: {
              type: 'string',
              enum: ['user', 'admin'],
              description: 'The user role'
            },
            created_at: {
              type: 'string',
              format: 'date-time',
              description: 'The creation timestamp'
            },
            updated_at: {
              type: 'string',
              format: 'date-time',
              description: 'The last update timestamp'
            }
          }
        },
        Event: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              description: 'The event ID'
            },
            user_id: {
              type: 'integer',
              description: 'The ID of the user who created the event'
            },
            title: {
              type: 'string',
              description: 'The event title'
            },
            content: {
              type: 'string',
              description: 'The event content'
            },
            theme: {
              type: 'string',
              description: 'The event theme'
            },
            emotion: {
              type: 'string',
              description: 'The event emotion'
            },
            likes: {
              type: 'integer',
              description: 'Number of likes'
            },
            created_at: {
              type: 'string',
              format: 'date-time',
              description: 'The creation timestamp'
            },
            updated_at: {
              type: 'string',
              format: 'date-time',
              description: 'The last update timestamp'
            },
            username: {
              type: 'string',
              description: 'Username of the event creator'
            },
            first_name: {
              type: 'string',
              description: 'First name of the event creator'
            },
            last_name: {
              type: 'string',
              description: 'Last name of the event creator'
            },
            profile_picture: {
              type: 'string',
              description: 'Profile picture URL of the event creator'
            },
            comment_count: {
              type: 'integer',
              description: 'Number of comments on the event'
            },
            like_count: {
              type: 'integer',
              description: 'Number of likes on the event'
            },
            comments: {
              type: 'array',
              description: 'List of comments on the event',
              items: {
                type: 'object',
                properties: {
                  id: {
                    type: 'integer',
                    description: 'The comment ID'
                  },
                  event_id: {
                    type: 'integer',
                    description: 'The ID of the event this comment belongs to'
                  },
                  user_id: {
                    type: 'integer',
                    description: 'The ID of the user who wrote the comment'
                  },
                  content: {
                    type: 'string',
                    description: 'The comment content'
                  },
                  created_at: {
                    type: 'string',
                    format: 'date-time',
                    description: 'The creation timestamp'
                  },
                  updated_at: {
                    type: 'string',
                    format: 'date-time',
                    description: 'The last update timestamp'
                  },
                  username: {
                    type: 'string',
                    description: 'Username of the comment author'
                  },
                  first_name: {
                    type: 'string',
                    description: 'First name of the comment author'
                  },
                  last_name: {
                    type: 'string',
                    description: 'Last name of the comment author'
                  }
                }
              }
            }
          }
        },
        EventComment: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              description: 'The comment ID'
            },
            event_id: {
              type: 'integer',
              description: 'The ID of the event'
            },
            user_id: {
              type: 'integer',
              description: 'The ID of the user who wrote the comment'
            },
            content: {
              type: 'string',
              description: 'The comment content'
            },
            created_at: {
              type: 'string',
              format: 'date-time',
              description: 'The creation timestamp'
            },
            updated_at: {
              type: 'string',
              format: 'date-time',
              description: 'The last update timestamp'
            }
          }
        },
        EventAttachment: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              description: 'The attachment ID'
            },
            event_id: {
              type: 'integer',
              description: 'The ID of the event'
            },
            attachment_url: {
              type: 'string',
              description: 'URL to the attachment'
            },
            created_at: {
              type: 'string',
              format: 'date-time',
              description: 'The creation timestamp'
            }
          }
        }
      }
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
    servers: [
      {
        url: `http://localhost:${PORT}`,
        description: 'Development server',
      },
    ],
  },
  apis: ['./src/routes/*.js'], // Path to the API docs
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

// Middleware
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Serve static files from uploads directory
app.use('/uploads', express.static('uploads'));

// Swagger API docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/events', eventRoutes);

// Health check route
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Server is running' });
});

// Error handling middlewares
app.use(notFound);
app.use(errorHandler);

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});