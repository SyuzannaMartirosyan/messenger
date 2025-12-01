import { Block } from "../../../core/block";

export type MessageProps = {
  avatar?: string;
  author?: string;
  imageUrl?: string;
  text?: string;
  time?: string;
  status?: string;
  isMine?: boolean;
  onClick?: (event: MouseEvent) => void;
};

const template = ({
  avatar,
  author,
  imageUrl,
  text,
  time,
  status,
  isMine,
}: MessageProps) => {
  const mine = !!isMine;
  const hasImage = !!imageUrl;

  return `
    <li class="message ${mine ? "message--mine" : "message--theirs"}">
      ${
        !mine
          ? `
        <div class="message__avatar">
          ${
            avatar
              ? `<img src="${avatar}" alt="${author ?? ""}" class="message__avatar-img" />`
              : `<div class="message__avatar-placeholder"></div>`
          }
        </div>
      `
          : ""
      }

      <div class="message__bubble">
        ${
          hasImage
            ? `
          <div class="message__image-wrapper">
            <img src="${imageUrl}" alt="" class="message__image" />
          </div>
        `
            : ""
        }

        ${
          text
            ? `
          <p class="message__text">
            ${text}
          </p>
        `
            : ""
        }

        <div class="message__meta">
          <span class="message__time">${time ?? ""}</span>
          ${
            mine && status
              ? `<span class="message__status">${status}</span>`
              : ""
          }
        </div>
      </div>
    </li>
  `;
};

export class Message extends Block<MessageProps> {
  private _domClickHandler?: (e: Event) => void;

  constructor(props: MessageProps) {
    super("div", props);
  }

  protected render(): string {
    return template(this.props);
  }

  protected addEvents(): void {
    if (!this.props.onClick) return;

    const root = this.getContent().querySelector(".message");
    if (!root) return;

    this._domClickHandler = (e: Event) => {
      this.props.onClick?.(e as MouseEvent);
    };

    root.addEventListener("click", this._domClickHandler);
  }

  protected removeEvents(): void {
    const root = this.getContent().querySelector(".message");
    if (!root || !this._domClickHandler) return;

    root.removeEventListener("click", this._domClickHandler);
    this._domClickHandler = undefined;
  }
}

