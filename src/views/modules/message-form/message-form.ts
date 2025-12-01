import { Block } from "../../../core/block.js";
import { Button } from "../../components/button/button.js";
import type { ButtonProps } from "../../components/button/button.js";
import { Input } from "../../components/input/input.js";
import type { InputProps } from "../../components/input/input.js";

export type MessageFormProps = {
  initialValue?: string;
  onSubmit?: (message: string) => void;
};

type MessageFormState = {
  message: string;
};

const messageFormTemplate = () => `
  <form class="message-form u-flex-between" name="message-form">
    <button
      class="button-round button--secondary"
      type="button"
      aria-label="Add file"
    >
      <span class="button-round__icon"></span>
    </button>

    <div class="message-form__field">
      <div data-component="message-input"></div>
    </div>

    <div class="message-form__actions">
      <div data-component="send-button"></div>
    </div>
  </form>
`;

export class MessageForm extends Block<MessageFormProps, MessageFormState> {
  private messageInput!: Input;
  private sendButton!: Button;

  private currentMessage: string;

  private submitHandler?: (e: Event) => void;

  constructor(props: MessageFormProps = {}) {
    const initial = props.initialValue ?? "";

    super("div", props, {
      message: initial,
    });

    this.currentMessage = initial;

  }

  protected render(): string {
    return messageFormTemplate();
  }

  private ensureChildren(): void {
    if (!this.messageInput) {
      this.messageInput = new Input({
        name: "message",
        type: "text",
        placeholder: "Message",
        autocomplete: "off",
        required: false,
        value: this.currentMessage,
        onInput: (value) => {
          this.currentMessage = value;
        },
      } satisfies InputProps);
    }

    if (!this.sendButton) {
      this.sendButton = new Button({
        text: "Send",
        type: "submit",
        modifier: "secondary",
      } satisfies ButtonProps);
    }
  }

  protected componentDidMount(): void {
    this.mountChildren();
  }

  protected componentDidUpdate(): void {
    this.mountChildren();
  }

  protected componentWillUnmount(): void {
    if (this.messageInput) this.messageInput.destroy();
    if (this.sendButton) this.sendButton.destroy();
  }
protected addEvents(): void {
  this.ensureChildren();

  const form = this.qs<HTMLFormElement>(".message-form");
  if (!form) return;

  this.submitHandler = (event: Event) => {
    event.preventDefault();

    const message = this.currentMessage.trim();

    if (!message) {
      console.log("Сообщение пустое — не отправляем");
      this.currentMessage = "";
      this.messageInput?.setProps({ value: "" });
      return;
    }

    console.log("message:", message);

    this.props.onSubmit?.(message);

    this.bus.emit("message:send", {
      text: message,
      time: new Date().toISOString(),
    });

    this.currentMessage = "";
    this.messageInput?.setProps({ value: "" });
  };

  form.addEventListener("submit", this.submitHandler);
}


  protected removeEvents(): void {
    const form = this.qs<HTMLFormElement>(".message-form");
    if (form && this.submitHandler) {
      form.removeEventListener("submit", this.submitHandler);
    }
    this.submitHandler = undefined;
  }

  private mountChildren(): void {
    const root = this.getContent();
    if (!root) return;

    this.ensureChildren();

    const inputHost = root.querySelector<HTMLElement>('[data-component="message-input"]');
    const buttonHost = root.querySelector<HTMLElement>('[data-component="send-button"]');

    if (inputHost) {
      const inputContent = this.messageInput.getContent();
      if (inputContent && inputContent !== inputHost && !inputContent.isConnected) {
        inputHost.replaceWith(inputContent);
      }
    }

    if (buttonHost) {
      const buttonContent = this.sendButton.getContent();
      if (buttonContent && buttonContent !== buttonHost && !buttonContent.isConnected) {
        buttonHost.replaceWith(buttonContent);
      }
    }
  }
}
