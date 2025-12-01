import { Block } from "../../../core/block";

export type ChatItemProps = {
  name?: string;
  avatar?: string;
  alt?: string;
  time?: string;
  lastMessage?: string;
  unreadCount?: number;
  isActive?: boolean;
  onClick?: (event: MouseEvent) => void;
};

const template = ({
  name,
  avatar,
  alt,
  time,
  lastMessage,
  unreadCount,
  isActive,
}: ChatItemProps) => `
  <div class="chat-item${isActive ? " chat-item--active" : ""}">
    <div class="chat-item__avatar u-flex-center">
      ${
        avatar
          ? `<img src="${avatar}" alt="${alt ?? ""}" class="chat-item__avatar-img" />`
          : `<div class="chat-item__avatar-placeholder"></div>`
      }
    </div>

    <div class="chat-item__content">
      <div class="chat-item__row chat-item__row--top u-flex-between">
        <span class="chat-item__name">${name ?? ""}</span>
        <span class="chat-item__time">${time ?? ""}</span>
      </div>

      <div class="chat-item__row chat-item__row--bottom">
        <span class="chat-item__last-message">${lastMessage ?? ""}</span>
        ${
          unreadCount && unreadCount > 0
            ? `<span class="chat-item__badge">${unreadCount}</span>`
            : ""
        }
      </div>
    </div>
  </div>
`;

export class ChatItem extends Block<ChatItemProps> {
  private _domClickHandler?: (e: Event) => void;

  constructor(props: ChatItemProps) {
    super("div", props);
  }

  protected render(): string {
    return template(this.props);
  }

  protected addEvents(): void {
    const item = this.getContent().querySelector<HTMLDivElement>(".chat-item");
    if (!item || !this.props.onClick) return;

    this._domClickHandler = (e: Event) => {
      this.props.onClick?.(e as MouseEvent);
    };

    item.addEventListener("click", this._domClickHandler);
  }

  protected removeEvents(): void {
    const item = this.getContent().querySelector<HTMLDivElement>(".chat-item");
    if (!item || !this._domClickHandler) return;

    item.removeEventListener("click", this._domClickHandler);
    this._domClickHandler = undefined;
  }
}
