import { Block } from "../../../core/block";

type ButtonVariant = "primary" | "secondary";

export type ButtonProps = {
  text: string;
  type?: "button" | "submit" | "reset";
  modifier?: ButtonVariant;
  icon?: string;
  dataRoute?: string;
  onClick?: (event: MouseEvent) => void;
};

const template = ({
  text,
  type = "button",
  modifier = "primary",
  icon,
  dataRoute,
}: ButtonProps) => `
  <button
    class="button u-inline-flex-center button--${modifier}"
    type="${type}"
    ${dataRoute ? `data-route="${dataRoute}"` : ""}
  >
    ${
      icon
        ? `<span class="button-action__icon u-flex">${icon}</span>`
        : ""
    }
    <span class="button-action__text">${text}</span>
  </button>
`;

export class Button extends Block<ButtonProps> {
  private _handleClick?: (event: MouseEvent) => void;

  constructor(props: ButtonProps) {
    super("div", props);
  }

  protected render(): string {
    return template(this.props);
  }

  protected addEvents(): void {
    const btn = this.qs<HTMLButtonElement>(".button");
    if (!btn || !this.props.onClick) return;

    this._handleClick = (event: MouseEvent) => {
      this.props.onClick?.(event);
    };

    btn.addEventListener("click", this._handleClick);
  }

  protected removeEvents(): void {
    const btn = this.qs<HTMLButtonElement>(".button");
    if (!btn || !this._handleClick) return;

    btn.removeEventListener("click", this._handleClick);
    this._handleClick = undefined;
  }
}
