import Handlebars from "../../app/helpers"
import templateSource from "./message-list.hbs?raw"
import { messages } from "../../mock/messages.js"

const messageListTemplate = Handlebars.compile(templateSource)

export function renderMessageList(root, chat) {
  if (!root || !chat) return

  const chatMessages = messages[chat.id] || []

  const html = messageListTemplate({
    messages: chatMessages,
    timeLabel: "Today"
  })

  root.innerHTML = html
}
