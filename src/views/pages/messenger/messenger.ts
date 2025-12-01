import { Block } from "@/core/block";

import { ChatList } from "@/views/modules/chat-list/chat-list";
import type { ChatListProps } from "@/views/modules/chat-list/chat-list";

import { ChatHeader } from "@/views/modules/chat-header/chat-header";
import type { ChatHeaderProps } from "@/views/modules/chat-header/chat-header";

import { MessageList } from "@/views/modules/message-list/message-list";
import type { MessageListProps } from "@/views/modules/message-list/message-list";

import { MessageForm } from "@/views/modules/message-form/message-form";
import type { MessageFormProps } from "@/views/modules/message-form/message-form";

import { chats } from "@/models/mock/chats";
import type { ChatData } from "@/models/mock/chat/chat";

const messengerTemplate = () => `
  <section class="messenger u-flex">
    <aside class="messenger__sidebar">
      <div data-component="chat-list"></div>
    </aside>

    <main class="messenger__content">
      <div data-component="chat-header"></div>

      <div class="messenger__messages">
        <div data-component="message-list"></div>
      </div>

      <footer class="messenger__footer">
        <div data-component="message-form"></div>
      </footer>
    </main>
  </section>
`;

export type MessengerPageProps = {
  // потом можно будет добавить initialChatId
};

type MessengerPageState = {
  selectedChat: ChatData | null;
};

export class MessengerPage extends Block<
  MessengerPageProps,
  MessengerPageState
> {
 
  declare private chatList: ChatList;
  declare private chatHeader: ChatHeader;
  declare private messageList: MessageList;
  declare private messageForm: MessageForm;

  constructor(props: MessengerPageProps = {}) {
    super("section", props, {
      selectedChat: null,
    });
  }

  protected init(): void {
    this.chatList = new ChatList({
      chats,
      onChatSelect: (chat) => this.handleChatSelect(chat),
    } satisfies ChatListProps);

    this.chatHeader = new ChatHeader({
      userName: "",
    } satisfies ChatHeaderProps);

    this.messageList = new MessageList({
      chat: null,
      timeLabel: "Today",
    } satisfies MessageListProps);

    this.messageForm = new MessageForm({
      onSubmit: (message) => this.handleMessageSubmit(message),
    } satisfies MessageFormProps);
  }

  protected render(): string {
    return messengerTemplate();
  }

  protected componentDidMount(): void {
    this.mountChildren();
  }

  protected componentDidUpdate(
    _prevProps: Readonly<MessengerPageProps>,
    _prevState: Readonly<MessengerPageState>
  ): void {
    this.mountChildren();
  }

  protected componentWillUnmount(): void {
    this.chatList.destroy();
    this.chatHeader.destroy();
    this.messageList.destroy();
    this.messageForm.destroy();
  }

  private handleChatSelect(chat: ChatData): void {
    this.setState({ selectedChat: chat });

    this.chatHeader.setProps({
      userName: chat.name,
      avatar: chat.avatar,
      alt: chat.name,
    });

    this.messageList.setProps({
      chat,
    } as MessageListProps);

    this.messageForm.setProps({
      initialValue: "",
    } as Partial<MessageFormProps>);
  }

  private handleMessageSubmit(message: string): void {
    const chat = this.state.selectedChat;
    if (!chat) return;

    console.log(
      "[MessengerPage] submit for chat:",
      chat.id,
      "text:",
      message
    );
  }

  private mountChildren(): void {
    const chatListSlot = this.qs<HTMLElement>("[data-component='chat-list']");
    if (chatListSlot) {
      chatListSlot.replaceWith(this.chatList.getContent());
    }

    const headerSlot = this.qs<HTMLElement>("[data-component='chat-header']");
    if (headerSlot) {
      headerSlot.replaceWith(this.chatHeader.getContent());
    }

    const messagesSlot = this.qs<HTMLElement>(
      "[data-component='message-list']"
    );
    if (messagesSlot) {
      messagesSlot.replaceWith(this.messageList.getContent());
    }

    const formSlot = this.qs<HTMLElement>("[data-component='message-form']");
    if (formSlot) {
      formSlot.replaceWith(this.messageForm.getContent());
    }
  }
}
