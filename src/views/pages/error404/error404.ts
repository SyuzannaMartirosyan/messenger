import { Block } from "@/core/block";
import { ErrorMessage } from "@/views/modules/message-error/message-error";
import type { ErrorMessageProps } from "@/views/modules/message-error/message-error";

export type Error404Props = {
  code?: string | number;
  message?: string;
  returnRoute?: string;
  onReturnClick?: () => void;
};

type Error404State = Record<string, never>;

const error404Template = () => `
  <main class="u-center-screen">
    <div data-component="error-message"></div>
  </main>
`;

export class Error404Page extends Block<Error404Props, Error404State> {
  private errorMessage!: ErrorMessage;

  constructor(props: Error404Props = {}) {
    super("main", props, {});
  }

  protected init(): void {
    const code: string | number = this.props.code ?? 404;
    const message: string = this.props.message ?? "You in the wrong place";
    const { returnRoute, onReturnClick } = this.props;

    this.errorMessage = new ErrorMessage({
      code,
      message,
      returnRoute,
      onReturnClick,
    } satisfies ErrorMessageProps);
  }

  protected render(): string {
    return error404Template();
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

