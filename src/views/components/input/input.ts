import { Block } from "../../../core/block";

export type InputProps = {
  label?: string;
  name: string;
  type?: string;
  placeholder?: string;
  autocomplete?: string;
  required?: boolean;
  value?: string;
  error?: string;
  onInput?: (value: string, event: Event) => void;
};

const template = ({
  label,
  name,
  type = "text",
  placeholder = "",
  autocomplete,
  required,
  value,
  error,
}: InputProps) => `
  <label class="input u-flex-start u-f-direction-column">
    ${
      label
        ? `<span class="input__label">${label}</span>`
        : ``
    }

    <input 
      class="input__control u-flex-start"
      name="${name}"
      type="${type}"
      placeholder="${placeholder}"
      ${autocomplete ? `autocomplete="${autocomplete}"` : ""}
      ${required ? "required" : ""}
      value="${value ?? ""}"
    />

    ${
      error
        ? `<small class="input__error">${error}</small>`
        : ``
    }
  </label>
`;

export class Input extends Block<InputProps> {
  private _domInputHandler?: (e: Event) => void;

  constructor(props: InputProps) {
    super("div", props);
  }

  protected render(): string {
    return template(this.props);
  }

  protected addEvents(): void {
    if (!this.props.onInput) return;

    const input = this.getContent().querySelector<HTMLInputElement>(".input__control");
    if (!input) return;

    this._domInputHandler = (e: Event) => {
      const target = e.target as HTMLInputElement | null;
      this.props.onInput?.(target?.value ?? "", e);
    };

    input.addEventListener("input", this._domInputHandler);
  }

  protected removeEvents(): void {
    const input = this.getContent().querySelector<HTMLInputElement>(".input__control");
    if (!input || !this._domInputHandler) return;

    input.removeEventListener("input", this._domInputHandler);
    this._domInputHandler = undefined;
  }
}

