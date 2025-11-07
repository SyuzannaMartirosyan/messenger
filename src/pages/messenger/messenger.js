import Handlebars from "../../app/helpers"
import template from "./messenger.hbs?raw"
import { renderChatList } from "../../modules/chat-list/chat-list.js"
import { renderMessageList } from "../../modules/message-list/message-list.js"

const renderMessengerTemplate = Handlebars.compile(template)

export function renderMessenger(root) {
  if (!root) return

  const html = renderMessengerTemplate({})
  root.innerHTML = html

  const chatsRoot = root.querySelector(".chats")
  if (!chatsRoot) return

  renderChatList(chatsRoot, (chat) => {
    const messagesRoot = root.querySelector(".messages")
    if (!messagesRoot) return

    renderMessageList(messagesRoot, chat)
  })
}
