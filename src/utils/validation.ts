type FieldConfig = {
  input: string | HTMLInputElement; 
  pattern: RegExp;
  message: string;
};

type ValidationConfig = Record<string, FieldConfig>;

type Validator = {
  validateAll: () => boolean;
  destroy: () => void;
};

export function createValidator(config: ValidationConfig): Validator {
  const fields: {
    input: HTMLInputElement;
    pattern: RegExp;
    message: string;
    errorEl: HTMLElement;
    blurHandler: () => void;
  }[] = [];

  Object.values(config).forEach((field) => {
    const inputEl =
      typeof field.input === "string"
        ? (document.querySelector(field.input) as HTMLInputElement | null)
        : field.input;

    if (!inputEl) return;

    let errorEl = inputEl.nextElementSibling as HTMLElement | null;
    if (!errorEl || !errorEl.classList.contains("input-error")) {
      errorEl = document.createElement("p");
      errorEl.className = "input-error";
      inputEl.insertAdjacentElement("afterend", errorEl);
    }

    const validate = () => {
      const value = inputEl.value.trim();

      const isValid = field.pattern.test(value);

      if (!isValid) {
        inputEl.classList.add("input--error");
        errorEl.textContent = field.message;
      } else {
        inputEl.classList.remove("input--error");
        errorEl.textContent = "";
      }

      return isValid;
    };

    const blurHandler = () => validate();

    inputEl.addEventListener("blur", blurHandler);

    fields.push({
      input: inputEl,
      pattern: field.pattern,
      message: field.message,
      errorEl,
      blurHandler,
    });
  });

  function validateAll(): boolean {
    let allValid = true;

    fields.forEach((field) => {
      const value = field.input.value.trim();
      const isValid = field.pattern.test(value);

      if (!isValid) {
        field.input.classList.add("input--error");
        field.errorEl.textContent = field.message;
        allValid = false;
      } else {
        field.input.classList.remove("input--error");
        field.errorEl.textContent = "";
      }
    });

    return allValid;
  }

  function destroy() {
    fields.forEach((field) => {
      field.input.removeEventListener("blur", field.blurHandler);
    });
  }

  return { validateAll, destroy };
}

