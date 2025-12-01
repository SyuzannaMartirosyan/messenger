
🌐 Deploy link ;3
View live project / login [reg page] https://gleeful-rolypoly-742202.netlify.app/registration.html [messenger page] https://gleeful-rolypoly-742202.netlify.app/messenger.html [profile page] https://gleeful-rolypoly-742202.netlify.app/profile.html [404] https://gleeful-rolypoly-742202.netlify.app/error404.html [505] https://gleeful-rolypoly-742202.netlify.app/error505.html [profile settings] https://gleeful-rolypoly-742202.netlify.app/profile-settings-form.html [change password] https://gleeful-rolypoly-742202.netlify.app/change-password-form.html

Design file - https://www.figma.com/design/EH4Jx76LjuEwBAvbL8xX0F/module-1-y?node-id=65-1651&t=js3gJJoXdIv4a2wo-1

Chat App — Project Work, Sprint 1
About Project
 
The goal of this project is to build the layout and basic client architecture of a messenger application using TypeScript, a custom Block base class, and an MVC-style structure.

The application includes several pages (login, registration, profile, chat, 404 and 505 pages) and forms the foundation of a future SPA: routing and real API integration will be added in the next sprints.

Key points:

Component system based on a custom Block class

Centralized event handling through an EventBus

Form validation (login, password, etc.) with error rendering in the UI

Separate class for HTTP requests using XMLHttpRequest and Promise (no fetch/axios)

Strict code style and quality control via ESLint, Stylelint, and EditorConfig

Features

Login and registration pages with basic validation

Profile page with editable fields

Messenger page with chat list and message area

Error pages: 404 and 505

Typed props and state for components (Block<P, S>)

Simple form data collection and console output (for now)

Tech Stack

Vite — modern dev server and build tool

TypeScript — typed application logic

Custom Block + EventBus — component system and internal event handling

SCSS (Sass) — modular styles, variables, mixins

PostCSS — style compatibility

ESLint — JavaScript/TypeScript linting (Airbnb/Google or custom ruleset)

Stylelint — CSS/SCSS style linting

EditorConfig — consistent editor settings

Netlify — hosting and deployment

Handlebars has been removed. All components and pages are now implemented as classes extending Block and rendered via template strings.

Architecture

The project follows an MVC-inspired structure:

Model

Mock data: user profile, chats, messages

Types and interfaces for application data

View

UI components (buttons, inputs, cards, forms) as classes extending Block

Page-level components (login, registration, profile, messenger, error pages)

Validation logic bound to form components

Controller / Core

Block — base UI class with lifecycle and partial re-rendering

EventBus — pub/sub mechanism for internal communication

HttpClient (or similar) — class for working with requests:

Only XMLHttpRequest + Promise

Methods: GET, POST, PUT, DELETE

Query string support for GET

Request body support for other methods
     

Installation and Launch
Install dependencies
npm install

Dev mode
npm run dev

Project build
npm run build

Launching the project (for checker)
npm start


(Alias for dev/preview depending on project configuration.)

Code Quality

Basic commands (may vary depending on your package.json):

# Lint TypeScript/JavaScript
npm run lint

# Lint styles
npm run lint:css

# Run all checks
npm test   # or npm run test / npm run check

Author:Syuzanna Martirosyan

