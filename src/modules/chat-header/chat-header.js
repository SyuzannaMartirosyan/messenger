import template from './chat-header.hbs?row';

export function renderChatHeader({ avatar, name, lastName, userName }) {
  return template({ avatar, name, lastName, userName });
}
