import '../styles/index.scss';
import { initRoot } from './helpers.js';
import { renderLogin } from '../pages/login/login';
import { renderRegistration } from '../pages/registration/registration';
import { renderMessenger } from '../pages/messenger/messenger';

import { renderError404 } from '../pages/error404/error404';
import { renderError505 } from '../pages/error505/error505';
import { renderProfilePage } from '../pages/profile/profile.js';
import { renderChangePasswordForm } from '../pages/change-password-form/change-password-form.js';
import { renderProfileSettingsForm } from '../pages/profile-settings-form/profile-settings-form.js';

initRoot('#app', renderLogin);

initRoot('#appRegistration', renderRegistration);

initRoot('#appMessanger', (appMessanger) => {
  renderMessenger(appMessanger, (chat) => {
    const chatPanelRoot = document.querySelector('#chatPanelRoot');
    if (!chatPanelRoot) return;

    renderChatPanel(chatPanelRoot, chat);
  });
});

initRoot('#appErorr404', renderError404);

initRoot('#appErorr505', renderError505);

initRoot('#appProfilePage', renderProfilePage);

initRoot('#changePasswordForm', renderChangePasswordForm);

initRoot('#profileSettingsForm', renderProfileSettingsForm);
