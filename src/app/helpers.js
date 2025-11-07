import Handlebars from 'handlebars'
/*components*/
import renderInputTemplate from '../components/input/input.hbs?raw'
import renderButtonPrimary from '../components/button/button.hbs?raw'
import renderChatItem from '../components/chat-item/chat-item.hbs?raw'
import renderMessage from '../components/message/message.hbs?raw'
import renderButtonRound from '../components/button-round/button-round.hbs?raw'
import renderButtonAction from '../components/button-action/button-action.hbs?raw'
import renderProfileCard from '../components/profile-card/profile-card.hbs?raw'
import renderInfoField from '../components/info-field/info-field.hbs?raw'
/*modules*/
import renderChatHeader from '../modules/chat-header/chat-header.hbs?raw'
import renderChatList from '../modules/chat-list/chat-list.hbs?raw'
import renderMessageForm from '../modules/message-form/message-form.hbs?raw'
import renderMessageList from '../modules/message-list/message-list.hbs?raw'
import renderMessageError from '../modules/message-error/message-error.hbs?raw'

/*components*/
Handlebars.registerPartial('input', renderInputTemplate)
Handlebars.registerPartial('button', renderButtonPrimary)
Handlebars.registerPartial('chat-item', renderChatItem)
Handlebars.registerPartial('message', renderMessage)
Handlebars.registerPartial('button-round', renderButtonRound)
Handlebars.registerPartial('button-action', renderButtonAction)
Handlebars.registerPartial('profile-card', renderProfileCard)
Handlebars.registerPartial('info-field', renderInfoField)
/*modules*/
Handlebars.registerPartial('chat-header', renderChatHeader)
Handlebars.registerPartial('chat-list', renderChatList)
Handlebars.registerPartial('message-form', renderMessageForm)
Handlebars.registerPartial('message-error', renderMessageError)
Handlebars.registerPartial('message-list', renderMessageList)



export default Handlebars;


// Универсальный переход по кнопкам (временное решение до роутинга)
document.addEventListener("DOMContentLoaded", () => {
  document.addEventListener("click", (event) => {
    const button = event.target.closest(".button")

    if (!button) return;

    event.preventDefault();

    const route = button.dataset.route;

    if (route) {
      window.location.href = route;
    } else {
      console.warn("⚠️ Кнопка без data-route:", button);
    }
  });
});
