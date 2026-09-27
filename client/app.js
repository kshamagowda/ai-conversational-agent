const API_BASE_URL = "/api";

let token = localStorage.getItem("token");
let currentConversationId = null;


/* =========================
   DOM Elements
========================= */

const authScreen = document.getElementById("authScreen");
const app = document.getElementById("app");

const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");

const loginUsername = document.getElementById("loginUsername");
const loginPassword = document.getElementById("loginPassword");

const registerUsername = document.getElementById("registerUsername");
const registerPassword = document.getElementById("registerPassword");
const confirmPassword = document.getElementById("confirmPassword");

const loginBtn = document.getElementById("loginBtn");
const registerBtn = document.getElementById("registerBtn");

const showRegisterBtn = document.getElementById("showRegisterBtn");
const showLoginBtn = document.getElementById("showLoginBtn");

const loginError = document.getElementById("loginError");
const registerError = document.getElementById("registerError");

const messagesContainer = document.getElementById("messages");
const messageInput = document.getElementById("messageInput");
const sendBtn = document.getElementById("sendBtn");

const newConversationBtn =
    document.getElementById("newConversationBtn");

const conversationList =
    document.getElementById("conversationList");

const usernameDisplay =
    document.getElementById("usernameDisplay");

const logoutBtn =
    document.getElementById("logoutBtn");


/* =========================
   Authentication UI
========================= */

function showApp() {

    authScreen.classList.add("hidden");
    app.classList.remove("hidden");

    const savedUsername =
        localStorage.getItem("username");

    if (savedUsername) {
        usernameDisplay.textContent =
            savedUsername;
    }

    loadConversations();
}


function showAuthScreen() {

    authScreen.classList.remove("hidden");
    app.classList.add("hidden");
}


/* =========================
   Switch Login / Register
========================= */

showRegisterBtn.addEventListener(
    "click",
    () => {

        loginForm.classList.add("hidden");
        registerForm.classList.remove("hidden");

        loginError.textContent = "";
        registerError.textContent = "";

    }
);


showLoginBtn.addEventListener(
    "click",
    () => {

        registerForm.classList.add("hidden");
        loginForm.classList.remove("hidden");

        loginError.textContent = "";
        registerError.textContent = "";

    }
);


/* =========================
   Login
========================= */

async function login() {

    const username =
        loginUsername.value.trim();

    const password =
        loginPassword.value;

    loginError.textContent = "";

    if (!username || !password) {

        loginError.textContent =
            "Username and password are required.";

        return;
    }

    loginBtn.disabled = true;
    loginBtn.textContent = "Logging in...";

    try {

        const response = await fetch(
            `${API_BASE_URL}/auth/login`,
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    username,
                    password
                })
            }
        );

        const data = await response.json();

        if (!response.ok) {

            loginError.textContent =
                data.message || "Login failed.";

            return;
        }

        token = data.token;

        localStorage.setItem(
            "token",
            token
        );

        localStorage.setItem(
            "username",
            data.user.username
        );

        loginUsername.value = "";
        loginPassword.value = "";

        showApp();

    } catch (error) {

        console.error(
            "Login error:",
            error
        );

        loginError.textContent =
            "Unable to connect to the server.";

    } finally {

        loginBtn.disabled = false;
        loginBtn.textContent = "Login";

    }
}


/* =========================
   Register
========================= */

async function register() {

    const username =
        registerUsername.value.trim();

    const password =
        registerPassword.value;

    const confirm =
        confirmPassword.value;

    registerError.textContent = "";

    if (!username || !password || !confirm) {

        registerError.textContent =
            "Please fill in all fields.";

        return;
    }

    if (password.length < 6) {

        registerError.textContent =
            "Password must be at least 6 characters.";

        return;
    }

    if (password !== confirm) {

        registerError.textContent =
            "Passwords do not match.";

        return;
    }

    registerBtn.disabled = true;
    registerBtn.textContent = "Creating account...";

    try {

        const response = await fetch(
            `${API_BASE_URL}/auth/register`,
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    username,
                    password
                })
            }
        );

        const data = await response.json();

        if (!response.ok) {

            registerError.textContent =
                data.message || "Registration failed.";

            return;
        }

        registerUsername.value = "";
        registerPassword.value = "";
        confirmPassword.value = "";

        registerForm.classList.add("hidden");
        loginForm.classList.remove("hidden");

        loginUsername.value = username;

        loginError.textContent =
            "Account created successfully. Please log in.";

    } catch (error) {

        console.error(
            "Registration error:",
            error
        );

        registerError.textContent =
            "Unable to connect to the server.";

    } finally {

        registerBtn.disabled = false;
        registerBtn.textContent = "Create Account";

    }
}


/* =========================
   API Helper
========================= */

async function apiRequest(url, options = {}) {

    const headers = {
        ...(options.headers || {}),
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
    };

    const response = await fetch(
        url,
        {
            ...options,
            headers
        }
    );

    if (response.status === 401) {

        logout();

        return null;
    }

    return response;
}


/* =========================
   Conversations
========================= */

async function loadConversations() {

    if (!token) {
        return;
    }

    try {

        const response =
            await apiRequest(
                `${API_BASE_URL}/conversations`
            );

        if (!response) {
            return;
        }

        const data =
            await response.json();

        if (!response.ok) {

            console.error(
                data.message ||
                "Failed to load conversations"
            );

            return;
        }

        conversationList.innerHTML = "";

        data.conversations.forEach(
            conversation => {

                const item =
                    document.createElement("div");

                item.className =
                    "conversation-item";

                item.textContent =
                    conversation.title;

                item.dataset.id =
                    conversation.id;

                item.addEventListener(
                    "click",
                    () => {
                        loadConversation(
                            conversation.id
                        );
                    }
                );

                conversationList.appendChild(
                    item
                );

            }
        );

    } catch (error) {

        console.error(
            "Load conversations error:",
            error
        );

    }
}


/* =========================
   Create Conversation
========================= */

async function createConversation() {

    try {

        const response =
            await apiRequest(
                `${API_BASE_URL}/conversations`,
                {
                    method: "POST",

                    body: JSON.stringify({
                        title: "New Conversation"
                    })
                }
            );

        if (!response) {
            return null;
        }

        const data =
            await response.json();

        if (!response.ok) {

            console.error(
                data.message ||
                "Failed to create conversation"
            );

            return null;
        }

        currentConversationId =
            data.conversation.id;

        clearMessages();

        await loadConversations();

        return currentConversationId;

    } catch (error) {

        console.error(
            "Create conversation error:",
            error
        );

        return null;
    }
}


/* =========================
   Load Conversation
========================= */

async function loadConversation(id) {

    try {

        const response =
            await apiRequest(
                `${API_BASE_URL}/conversations/${id}`
            );

        if (!response) {
            return;
        }

        const data =
            await response.json();

        if (!response.ok) {

            console.error(
                data.message ||
                "Failed to load conversation"
            );

            return;
        }

        currentConversationId = id;

        clearMessages();

        data.messages.forEach(
            message => {

                addMessage(
                    message.role,
                    message.content
                );

            }
        );

        document
            .querySelectorAll(
                ".conversation-item"
            )
            .forEach(item => {

                item.classList.remove(
                    "active"
                );

                if (
                    Number(item.dataset.id) ===
                    Number(id)
                ) {

                    item.classList.add(
                        "active"
                    );

                }

            });

    } catch (error) {

        console.error(
            "Load conversation error:",
            error
        );

    }
}


/* =========================
   Send Message
========================= */

async function sendMessage() {

    const content =
        messageInput.value.trim();

    if (!content) {
        return;
    }

    if (!token) {
        return;
    }


    /* Create conversation if needed */

    if (!currentConversationId) {

        const newConversationId =
            await createConversation();

        if (!newConversationId) {

            addMessage(
                "assistant",
                "Unable to create a conversation."
            );

            return;
        }
    }


    addMessage(
        "user",
        content
    );

    messageInput.value = "";

    sendBtn.disabled = true;
    sendBtn.textContent = "Sending...";


    try {

        const response =
            await apiRequest(
                `${API_BASE_URL}/conversations/${currentConversationId}/messages`,
                {
                    method: "POST",

                    body: JSON.stringify({
                        content
                    })
                }
            );

        if (!response) {
            return;
        }

        const data =
            await response.json();

        if (!response.ok) {

            addMessage(
                "assistant",
                data.message ||
                "Something went wrong."
            );

            return;
        }

        addMessage(
            "assistant",
            data.data.assistantMessage
        );

        await loadConversations();

    } catch (error) {

        console.error(
            "Send message error:",
            error
        );

        addMessage(
            "assistant",
            "Unable to connect to the AI service."
        );

    } finally {

        sendBtn.disabled = false;
        sendBtn.textContent = "Send";

        messageInput.focus();

    }
}


/* =========================
   Add Message
========================= */

function addMessage(
    role,
    content
) {

    const welcome =
        document.querySelector(
            ".welcome-message"
        );

    if (welcome) {
        welcome.remove();
    }

    const message =
        document.createElement("div");

    message.className =
        `message ${role}`;

    const messageContent =
        document.createElement("div");

    messageContent.className =
        "message-content";

    messageContent.textContent =
        content;

    message.appendChild(
        messageContent
    );

    messagesContainer.appendChild(
        message
    );

    messagesContainer.scrollTop =
        messagesContainer.scrollHeight;
}


/* =========================
   Clear Messages
========================= */

function clearMessages() {

    messagesContainer.innerHTML = "";

    const welcome =
        document.createElement("div");

    welcome.className =
        "welcome-message";

    welcome.innerHTML = `
        <h2>👋 Welcome!</h2>

        <p>
            Start a conversation with your AI assistant.
        </p>

        <p class="memory-info">
            The assistant can remember useful information
            across conversations.
        </p>
    `;

    messagesContainer.appendChild(
        welcome
    );
}


/* =========================
   Logout
========================= */

function logout() {

    localStorage.removeItem(
        "token"
    );

    localStorage.removeItem(
        "username"
    );

    token = null;

    currentConversationId = null;

    showAuthScreen();
}


/* =========================
   Event Listeners
========================= */

loginBtn.addEventListener(
    "click",
    login
);

registerBtn.addEventListener(
    "click",
    register
);


logoutBtn.addEventListener(
    "click",
    logout
);


newConversationBtn.addEventListener(
    "click",
    createConversation
);


sendBtn.addEventListener(
    "click",
    sendMessage
);


messageInput.addEventListener(
    "keydown",
    event => {

        if (
            event.key === "Enter" &&
            !event.shiftKey
        ) {

            event.preventDefault();

            sendMessage();

        }

    }
);


/* =========================
   Enter Key For Login
========================= */

loginPassword.addEventListener(
    "keydown",
    event => {

        if (event.key === "Enter") {

            event.preventDefault();

            login();

        }

    }
);


/* =========================
   Enter Key For Register
========================= */

confirmPassword.addEventListener(
    "keydown",
    event => {

        if (event.key === "Enter") {

            event.preventDefault();

            register();

        }

    }
);


/* =========================
   Initialize Application
========================= */

if (token) {

    showApp();

} else {

    showAuthScreen();

}