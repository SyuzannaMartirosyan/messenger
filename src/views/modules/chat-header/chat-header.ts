import { Block } from "../../../core/block";
import { ButtonRound } from "../../components/button-round/button-round";

export type ChatHeaderProps = {
  avatar?: string;
  alt?: string;
  userName: string;
};

// template → функция
const template = ({ avatar, alt, userName }: ChatHeaderProps) => `
  <header class="chat-header u-flex-between">
    <div class="u-flex">
      <div class="chat-header__avatar u-flex-center">
        ${
          avatar
            ? `<img src="${avatar}" alt="${alt ?? ""}" class="chat-header__avatar-img" />`
            : `<div class="chat-header__avatar-placeholder"></div>`
        }
      </div>

      <p class="chat-header__name">${userName}</p>
    </div>

    <div class="chat-header__actions u-flex" data-slot="actions"></div>
  </header>
`;

export class ChatHeader extends Block<ChatHeaderProps> {
  private settingsButton?: ButtonRound;

  constructor(props: ChatHeaderProps) {
    super("header", props);
  }

  protected render(): string {
    return template(this.props);
  }

  protected componentDidMount(): void {
    this.renderActions();
  }

  protected componentDidUpdate(): void {
    this.renderActions();
  }

  protected componentWillUnmount(): void {
    if (this.settingsButton) {
      this.settingsButton.destroy();
      this.settingsButton = undefined;
    }
  }

  private renderActions(): void {
    const container = this.qs<HTMLDivElement>(".chat-header__actions");
    if (!container) return;

    if (this.settingsButton) {
      this.settingsButton.destroy();
      this.settingsButton = undefined;
    }

    this.settingsButton = new ButtonRound({
      type: "button",
      modifier: "secondary",
      ariaLabel: "chat setting",
      icon: "more",
    });

    container.appendChild(this.settingsButton.getContent());
  }
}
