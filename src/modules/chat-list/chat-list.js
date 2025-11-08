import Handlebars from '../../app/helpers';
import templateSource from './chat-list.hbs?raw';
import '../../components/chat-item/chat-item.js';
import { chats } from '../../mock/chats.js';

const chatListTemplate = Handlebars.compile(templateSource);

export function renderChatList(root, onChatSelect) {
  if (!root) return;

  const html = chatListTemplate({ chats });
  root.innerHTML = html;

  const items = root.querySelectorAll('.chats__item');
  if (!items.length) return;

  items.forEach((item) => {
    const idAttr = item.dataset.id;

    item.addEventListener('click', () => {
      const id = Number(idAttr);
      const chat = chats.find((c) => c.id === id);

      items.forEach((el) => el.classList.remove('chats__item--active'));
      item.classList.add('chats__item--active');

      if (onChatSelect && chat) onChatSelect(chat);
    });
  });
}
