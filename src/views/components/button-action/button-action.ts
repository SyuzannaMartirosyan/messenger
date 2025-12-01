import { Block } from "../../../core/block";

export type ButtonActionProps = {
  text: string;
  circlesColor?: string;
  type?: "button" | "submit" | "reset";
  onClick?: (event: MouseEvent) => void;
};

const template = ({
  text,
  circlesColor,
  type = "button",
}: ButtonActionProps) => `
  <button
    class="button-action u-inline-flex-start"
    type="${type}"
  >
    <span
      class="button-action__circle u-flex"
      style="${circlesColor ? `background: ${circlesColor};` : ""}"
    ></span>

    <span class="button__text">${text}</span>
  </button>
`;

export class ButtonAction extends Block<ButtonActionProps> {
  private _handleClick?: (event: MouseEvent) => void;

  constructor(props: ButtonActionProps) {
    super("div", props);
  }

  protected render(): string {
    return template(this.props); // теперь всё ок
  }

  protected addEvents(): void {
    const btn = this.getContent().querySelector<HTMLButtonElement>(".button-action");
    if (!btn || !this.props.onClick) return;

    this._handleClick = (event: MouseEvent) => {
      this.props.onClick?.(event);
    };

    btn.addEventListener("click", this._handleClick);
  }

  protected removeEvents(): void {
    const btn = this.getContent().querySelector<HTMLButtonElement>(".button-action");
    if (!btn || !this._handleClick) return;

    btn.removeEventListener("click", this._handleClick);
    this._handleClick = undefined;
  }
}

