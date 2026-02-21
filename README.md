Basic Details
Team Name: GAURI & ANNA
Team Members
Member 1: ANNA ROSE- SNMIMT,MALIENKARA
Member 2: GAURI PRIYA-SNMIMT,MALIENKARA
Hosted Project Link


Project Description
Helps you to complete an incomplete dream
The Problem statement

Dreams are fleeting yet inspiring experiences that often fade from memory shortly after waking. Many individuals want to capture, explore, and creatively continue their dreams, but current tools only allow simple note-taking without leveraging AI to extend or enrich dream narratives. There is no convenient platform that combines text, voice, and visual inputs to help users interactively generate immersive dream continuations while also offering voice playback and sharing capabilities.

The Solution
The Somnova app will be a mobile application that allows users to record, continue, and explore their dreams using AI. The app will work on both Android and iOS devices.

When a user opens the app, they can choose how to input their dream: by typing it, recording their voice, or taking a photo related to the dream. The app will then send this input to a backend server.

The backend server will process the input and use artificial intelligence to generate a continuation of the dream. For example, it will send the typed or converted voice text to an AI model like OpenAI GPT, which will produce a creative continuation of the dream. If the user has enabled voice output, the AI-generated text will also be converted into audio using a text-to-speech service, so the user can listen to their dream.

The app will also allow users to save their dreams, edit them, or share them with others. Users can change settings such as dark or light mode, language, volume, and permissions for camera and microphone.

To make all of this work, the frontend of the app will be built using a framework like Flutter or React Native, which allows cross-platform development. The backend will be built using Python (FastAPI) or Node.js, which will manage AI requests and communicate with the mobile app. The app will also use cloud services like Google Cloud APIs for voice recognition, text-to-speech, and optional image processing to add more context to the dream.

The app will be connected to GitHub for version control, so developers can track changes and collaborate. The backend can be deployed on cloud platforms like Render, Vercel, or Heroku for easy access. Security will be ensured by keeping all API keys on the backend, using HTTPS for communication, and asking the user for necessary permissions.

Optional features could include generating background music for the dream, creating AI-generated dream illustrations, supporting multiple languages, and allowing users to customize the AI’s storytelling style.

In short, Somnova combines mobile development, AI, voice and image processing, and cloud technologies to create an interactive and creative platform for users to explore and continue their dreams.

Technical Details
Technologies/Components Used
For Software:

Languages used: tyscript,sql,css,html
Frameworks used:react19,express.js
Libraries used:Tailwind CSS,Express Session,React Markdown,Better-SQLite3,
Tools used: vite,TSX,Better-SQLite3



Implementation
For Software:
Installation
npm install
Run
 npm start




 

AI Tools Used 

 GitHub Copilot, v0.dev, Cursor, ChatGPT,antigravity



github: "Debugging assistance for async functions"
antigravity: "Code review and optimization suggestions"
Key Prompts Used:

"Create a REST API endpoint for user authentication"
"Debug this async function that's causing race conditions"
"Optimize this database query for better performance"

Human Contributions:

Architecture design and planning
Custom business logic implementation
Integration and testing
UI/UX design decisions
Note: Proper documentation of AI usage demonstrates transparency and earns bonus points in evaluation!

Team Contributions
Gauri Priya:  Frontend development, API integration
Anna Rose: Backend development, Database design

License
This project is licensed under the [LICENSE_NAME] License - see the LICENSE file for details.

Common License Options:

MIT License (Permissive, widely used)
Apache 2.0 (Permissive with patent grant)
GPL v3 (Copyleft, requires derivative works to be open source)
