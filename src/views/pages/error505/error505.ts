import { Block } from "@/core/block";
import { ErrorMessage } from "@/views/modules/message-error/message-error";
import type { ErrorMessageProps } from "@/views/modules/message-error/message-error";

export type Error505Props = {
  code?: string | number;
  message?: string;
  returnRoute?: string;
  onReturnClick?: () => void;
};

type Error505State = Record<string, never>;

const error505Template = () => `
  <main class="u-center-screen">
    <div data-component="error-message"></div>
  </main>
`;

export class Error505Page extends Block<Error505Props, Error505State> {
  private errorMessage!: ErrorMessage;

  constructor(props: Error505Props = {}) {
    super("main", props, {});
  }

  protected init(): void {
    const code: string | number = this.props.code ?? 505;
    const message: string = this.props.message ?? "Something went wrong";
    const { returnRoute, onReturnClick } = this.props;

    this.errorMessage = new ErrorMessage({
      code,
      message,
      returnRoute,
      onReturnClick,
    } satisfies ErrorMessageProps);
  }

  protected render(): string {
    return error505Template();
  }

  protected componentDidMount(): void {
    this.mountChild();
  }

  protected componentDidUpdate(): void {
    this.mountChild();
  }

  protected componentWillUnmount(): void {
    this.errorMessage.destroy();
  }

  private mountChild(): void {
    const slot = this.qs<HTMLElement>("[data-component='error-message']");
    if (slot) {
      slot.replaceWith(this.errorMessage.getContent());
    }
  }
}

