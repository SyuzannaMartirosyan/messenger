import { Block } from "../../../core/block.js";
import { Button } from "../../components/button/button.js";
import type { ButtonProps } from "../../components/button/button.js";

const errorMessageTemplate = ({
  code,
  message,
}: {
  code: string | number;
  message: string;
}) => `
  <section class="error-message u-center-screen">
    <div class="error-message__content u-flex u-f-direction-column">
      <h1 class="error-message__code">${code}</h1>
      <p class="error-message__text">${message}</p>

      <div data-component="return-button"></div>
    </div>
  </section>
`;

export type ErrorMessageProps = {
  code: string | number;
  message: string;

  returnRoute?: string;
  onReturnClick?: () => void;
};

type ErrorMessageState = Record<string, never>;

export class ErrorMessage extends Block<
  ErrorMessageProps,
  ErrorMessageState
> {
  declare private returnButton: Button;

  constructor(props: ErrorMessageProps) {
    super("section", props, {});
  }

  protected init(): void {
    const defaultRoute = "http://localhost:3000/messenger.html";

    this.returnButton = new Button({
      text: "Return To Chats",
      type: "button",
      modifier: "secondary",
      dataRoute: this.props.returnRoute ?? defaultRoute,
      onClick: () => {
        if (this.props.onReturnClick) {
          this.props.onReturnClick();
          return;
        }

        const route = this.props.returnRoute ?? defaultRoute;
        window.location.href = route;
      },
    } satisfies ButtonProps);
  }

  protected render(): string {
    return errorMessageTemplate({
      code: this.props.code,
      message: this.props.message,
    });
  }

  protected componentDidMount(): void {
    this.mountChildren();
  }

  protected componentDidUpdate(): void {
    this.mountChildren();
  }

  protected componentWillUnmount(): void {
    this.returnButton.destroy();
  }

  protected addEvents(): void {}
  protected removeEvents(): void {}

  private mountChildren(): void {
    const btnSlot = this.qs<HTMLElement>("[data-component='return-button']");
    if (btnSlot) {
      btnSlot.replaceWith(this.returnButton.getContent());
    }
  }
}

