import { Message } from "@/views/components/message/message";
import type { MessageProps } from "@/views/components/message/message";
import { messages as mockMessages } from "@/models/mock/messages.js";
import { Block } from "@/core/block";
import type { ChatData } from "@/models/mock/chat/chat";

export type MessageListProps = {
  chat?: ChatData | null;
  timeLabel?: string;
};

type MessageListState = Record<string, never>;

type MessageListTemplateProps = {
  timeLabel?: string;
};

const messageListTemplate = ({ timeLabel }: MessageListTemplateProps) => `
  <ul class="message-list">
    ${
      timeLabel
        ? `
      <li class="message-list__divider">
        <span class="message-list__divider-text u-flex-center">
          ${timeLabel}
        </span>
      </li>
    `
        : ""
    }
  </ul>
`;

export class MessageList extends Block<MessageListProps, MessageListState> {
  private messageComponents: Message[] = [];

  constructor(props: MessageListProps) {
    super("div", props, {});
  }

  protected render(): string {
    return messageListTemplate({
      timeLabel: this.props.timeLabel ?? "Today",
    });
  }

  protected componentDidMount(): void {
    this.renderMessagesFromChat();
  }

  protected componentDidUpdate(
    prevProps: Readonly<MessageListProps>
  ): void {
    if (prevProps.chat?.id !== this.props.chat?.id) {
      this.renderMessagesFromChat();
    }
  }

  protected componentWillUnmount(): void {
    this.destroyMessages();
  }

  private destroyMessages(): void {
    if (!Array.isArray(this.messageComponents) || this.messageComponents.length === 0) {
      this.messageComponents = [];
      return;
    }

    this.messageComponents.forEach((m) => m.destroy());
    this.messageComponents = [];
  }

  private renderMessagesFromChat(): void {
    this.destroyMessages();

    const chat = this.props.chat;
    if (!chat) return;

    const chatMessages: MessageProps[] = mockMessages[chat.id] || [];

    const listEl = this.qs<HTMLUListElement>(".message-list");
    if (!listEl) return;

    chatMessages.forEach((msgData) => {
      const msg = new Message({
        ...msgData,
      });

      this.messageComponents.push(msg);
      listEl.appendChild(msg.getContent());
    });

    listEl.scrollTop = listEl.scrollHeight;
  }
}

