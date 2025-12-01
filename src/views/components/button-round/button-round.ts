import { Block } from "../../../core/block";

export type ButtonRoundProps = {
  text?: string;
  type?: "button" | "submit" | "reset";
  modifier?: string;
  ariaLabel?: string;
  icon?: string;
  alt?: string;
  dataRoute?: string;
  onClick?: (event: MouseEvent) => void;
};

const template = ({
  type = "button",
  modifier,
  ariaLabel,
  icon,
  alt,
  dataRoute,
}: ButtonRoundProps) => `
  <button
    class="button-round${modifier ? ` button--${modifier}` : ""}"
    type="${type}"
    ${ariaLabel ? `aria-label="${ariaLabel}"` : ""}
    ${dataRoute ? `data-route="${dataRoute}"` : ""}
  >
    <span class="button-round__icon">
      ${icon ? `<img src="${icon}" alt="${alt ?? ""}" />` : ""}
    </span>
  </button>
`;

export class ButtonRound extends Block<ButtonRoundProps> {
  private _handleClick?: (event: MouseEvent) => void;

  constructor(props: ButtonRoundProps) {
    super("div", props);
  }

  protected render(): string {
    return template(this.props);
  }

  protected addEvents(): void {
    const btn =
      this.getContent().querySelector<HTMLButtonElement>(".button-round");
    if (!btn || !this.props.onClick) return;

    this._handleClick = (event: MouseEvent) => {
      this.props.onClick?.(event);
    };

    btn.addEventListener("click", this._handleClick);
  }

  protected removeEvents(): void {
    const btn =
      this.getContent().querySelector<HTMLButtonElement>(".button-round");
    if (!btn || !this._handleClick) return;

    btn.removeEventListener("click", this._handleClick);
    this._handleClick = undefined;
  }
}
