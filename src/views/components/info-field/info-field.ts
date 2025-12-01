import { Block } from "../../../core/block";

export type InfoFieldProps = {
  label: string;
  isEditable?: boolean;
  type?: string;
  name?: string;
  value?: string;
  onInput?: (value: string) => void;
};

export const template = ({
  label,
  isEditable,
  type = "text",
  name,
  value,
}: InfoFieldProps) => `
  <div class="info-field ${isEditable ? "info-field--editable" : ""}">
    <label class="info-field__label">${label}</label>

    ${
      isEditable
        ? `
      <input 
        class="info-field__input" 
        type="${type}" 
        name="${name ?? ""}" 
        value="${value ?? ""}"
      >
    `
        : `
      <span class="info-field__value">${value ?? ""}</span>
    `
    }
  </div>
`;

export class InfoField extends Block<InfoFieldProps> {
  private _domInputHandler?: (e: Event) => void;

  constructor(props: InfoFieldProps) {
    super("div", props);
  }

  protected render(): string {
    return template(this.props); 
  }

  protected addEvents(): void {
    if (!this.props.isEditable || !this.props.onInput) return;

    const input =
      this.getContent().querySelector<HTMLInputElement>(".info-field__input");
    if (!input) return;

    this._domInputHandler = (e: Event) => {
      this.props.onInput?.((e.target as HTMLInputElement).value);
    };

    input.addEventListener("input", this._domInputHandler);
  }

  protected removeEvents(): void {
    const input =
      this.getContent().querySelector<HTMLInputElement>(".info-field__input");
    if (!input || !this._domInputHandler) return;

    input.removeEventListener("input", this._domInputHandler);
    this._domInputHandler = undefined;
  }
}
