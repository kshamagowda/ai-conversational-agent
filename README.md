# 🤖 AI Conversational Agent with Persistent Memory

A full-stack AI conversational agent that can remember user-specific information across conversations and use those memories to provide more personalized responses.

The application combines a JavaScript frontend, Node.js/Express backend, Groq-powered LLM responses, JWT authentication, and SQLite-based persistent memory.

## 🚀 Live Demo

**Live Application:**
https://ai-conversational-agent-production.up.railway.app

**GitHub Repository:**
https://github.com/kshamagowda/ai-conversational-agent

---

## ✨ Features

* 🔐 User registration and login
* 🔑 JWT-based authentication
* 🔒 Password hashing with bcrypt
* 💬 Multi-conversation support
* 🧠 Persistent long-term user memory
* 🔄 Memory retrieval across conversations
* 🤖 AI responses powered by Groq
* 💾 SQLite database
* ☁️ Persistent Railway Volume storage
* 📊 Message latency and analytics tracking
* 🛡️ Helmet security middleware
* 🚦 API rate limiting
* 🌐 CORS configuration
* 🧪 Automated API tests using Jest and Supertest
* 🚀 Continuous deployment through GitHub and Railway

---

## 🧠 How Persistent Memory Works

The application extracts useful user information from conversations and stores it as structured memory.

For example:

1. User says:

   > My name is Kshama and I am learning Java.

2. The application extracts relevant information.

3. The information is stored in the SQLite `memories` table.

4. The user starts a new conversation.

5. Relevant memories are retrieved and provided to the AI as context.

6. The AI can respond:

   > You're learning Java, Kshama.

The database is stored on a Railway persistent volume, allowing stored memories to survive application restarts.

---

## 🏗️ System Architecture

```text
                    ┌──────────────────────┐
                    │      User / Browser  │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │ HTML / CSS /         │
                    │ JavaScript Frontend  │
                    └──────────┬───────────┘
                               │ HTTP / JSON
                               ▼
                    ┌──────────────────────┐
                    │ Node.js + Express    │
                    │ Backend API          │
                    └───────┬───────┬──────┘
                            │       │
               ┌────────────┘       └─────────────┐
               ▼                                  ▼
      ┌──────────────────┐              ┌──────────────────┐
      │ Authentication   │              │ Conversation &   │
      │ JWT + bcrypt     │              │ Message APIs     │
      └──────────────────┘              └────────┬─────────┘
                                                 │
                              ┌──────────────────┼──────────────────┐
                              ▼                  ▼                  ▼
                       ┌─────────────┐   ┌─────────────┐   ┌─────────────┐
                       │   Memory    │   │   SQLite    │   │    Groq     │
                       │   Service   │   │  Database   │   │     LLM     │
                       └─────────────┘   └─────────────┘   └─────────────┘
                                                │
                                                ▼
                                      ┌──────────────────┐
                                      │ Railway Persistent│
                                      │     Volume        │
                                      └──────────────────┘
```

---

## 🛠️ Technology Stack

### Frontend

* HTML5
* CSS3
* JavaScript

### Backend

* Node.js
* Express.js

### AI

* Groq API
* `openai/gpt-oss-120b`

### Database

* SQLite
* better-sqlite3

### Authentication & Security

* JWT
* bcrypt
* Helmet
* CORS
* express-rate-limit

### Testing

* Jest
* Supertest

### Deployment

* GitHub
* Railway
* Railway Persistent Volume

---

## 📂 Project Structure

```text
ai-conversational-agent/
│
├── client/
│   ├── app.js
│   ├── index.html
│   └── style.css
│
├── server/
│   ├── config/
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── conversationController.js
│   │   └── messageController.js
│   │
│   ├── database/
│   │   ├── database.js
│   │   └── schema.js
│   │
│   ├── middleware/
│   │   └── authMiddleware.js
│   │
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── conversationRoutes.js
│   │   ├── messageRoutes.js
│   │   └── protectedRoutes.js
│   │
│   ├── services/
│   │   ├── groqService.js
│   │   ├── memoryExtractor.js
│   │   └── memoryService.js
│   │
│   └── server.js
│
├── tests/
│   ├── auth.test.js
│   ├── conversation.test.js
│   ├── message.test.js
│   └── setup.js
│
├── docs/
├── .gitignore
├── package.json
├── package-lock.json
└── README.md
```

---

## 🔐 Security

The application includes several security measures:

* Passwords are hashed using bcrypt.
* Authentication uses signed JWT tokens.
* Protected API routes require authentication.
* Helmet provides common HTTP security headers.
* CORS is configured for controlled frontend access.
* API requests are rate-limited.
* Environment variables are used for secrets and API keys.
* `.env` and the local SQLite database are excluded from Git using `.gitignore`.

**Secrets are not stored in the GitHub repository.**

---

## 🧪 Testing

The project includes automated API tests covering authentication, conversations, and messages.

Run the test suite with:

```bash
npm test -- --runInBand
```

Current test result:

```text
Test Suites: 3 passed, 3 total
Tests:       15 passed, 15 total
```

---

## ⚙️ Local Setup

### 1. Clone the repository

```bash
git clone https://github.com/kshamagowda/ai-conversational-agent.git
```

### 2. Move into the project

```bash
cd ai-conversational-agent
```

### 3. Install dependencies

```bash
npm install
```

### 4. Create `.env`

Create a `.env` file in the project root:

```env
PORT=5000
JWT_SECRET=your_jwt_secret
GROQ_API_KEY=your_groq_api_key
FRONTEND_URL=http://localhost:5000
```

Never commit your actual API keys or JWT secret.

### 5. Start the application

```bash
npm start
```

Open:

```text
http://localhost:5000
```

---

## 📊 Database Design

The application uses SQLite with the following main tables:

### `users`

Stores registered user accounts and password hashes.

### `conversations`

Stores conversations associated with users.

### `messages`

Stores user and assistant messages, including message latency.

### `memories`

Stores extracted user-specific memories.

### `analytics`

Stores application events and latency information.

Foreign-key constraints maintain relationships between users, conversations, messages, and memories.

---

## 🌐 Deployment

The application is deployed using Railway.

Deployment flow:

```text
Developer
   │
   ▼
Git Commit
   │
   ▼
GitHub main branch
   │
   ▼
Railway automatic deployment
   │
   ▼
Production application
```

SQLite data is stored under the Railway persistent volume so that important application data survives service restarts.

---

## 🎯 Project Goals

This project demonstrates practical implementation of:

* Full-stack web development
* REST API development
* AI/LLM integration
* Persistent memory systems
* Authentication
* Database design
* API security
* Automated testing
* Cloud deployment
* Production debugging

---

## 📌 Future Improvements

Potential future enhancements include:

* PostgreSQL production database
* Semantic memory search using embeddings
* Vector database integration
* Improved memory ranking and relevance
* Streaming AI responses
* Conversation search
* User memory management interface
* Advanced analytics dashboard
* CI/CD test automation
* Expanded test coverage

---

## 👩‍💻 Author

**Kshamadharithri H P**

Information Science Engineering Student

GitHub:
https://github.com/kshamagowda

LinkedIn:
https://www.linkedin.com/in/kshamadharithri
