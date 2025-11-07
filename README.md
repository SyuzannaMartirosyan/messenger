Chat App — Project Work, Sprint 1  
Design file - https://www.figma.com/design/EH4Jx76LjuEwBAvbL8xX0F/module-1-y?node-id=65-1651&t=js3gJJoXdIv4a2wo-1
## 🌐 Deploy link
[View live project / login](https://gleeful-rolypoly-742202.netlify.app)
[reg page]   https://gleeful-rolypoly-742202.netlify.app/registration.html
[messenger page]  https://gleeful-rolypoly-742202.netlify.app/messenger.html
[profile page]  https://gleeful-rolypoly-742202.netlify.app/profile.html
[404] https://gleeful-rolypoly-742202.netlify.app/error404.html
[505] https://gleeful-rolypoly-742202.netlify.app/error505.html


## About Project  
The projects goal is to lay out and structure the messenger interface, using the Handlebars template engine, modular architecture, and an SCSS preprocessor.
The application includes several pages (login, registration, profile, chat, 404 and 505 pages) and the basic structure of the future SPA application.
BEM methodology is used for class naming.
Handlebars components are registered via Handlebars.registerPartial.
Style files are imported centrally via src/styles/index.scss.

---

## Tech Stack
- **Vite** — a modern build environment and local server
- **Handlebars** — a templating engine for component-based approaches
- **SCSS (Sass)** — modular styles, variables, and mixins
- **PostCSS** — style compatibility
- **JavaScript ES Modules** — import and export structure
- **Netlify** — project hosting and deployment
---

## Projects Structure
src/
├── app/ # main JS input and helper functions
├── components/ # UI components (buttons, inputs, etc.)
├── modules/ # page components (chat-header, chat-list, profile-card)
├── pages/ # individual application pages
├── mock/ # test data (chats, messages)
├── styles/ # global styles, variables, layout utilits (in helpers.scss)
│
├── index.html # login page
├── registration.html
├── profile.html
├── messenger.html
├── error404.html
├── error505.html
│
├── vite.config.js
├── postcss.config.js
├── package.json


---

## Installation and launch

### Installing dependencies
```bash
npm install

### Dev Mode
npm run dev

### Project Build
npm run build

### Launching a project

npm start

##  Author : Syuzanna Martirosyan


[Ссылка на Pull Request Sprint 1](https://github.com/SyuzannaMartirosyan/messenger/pull/1)
