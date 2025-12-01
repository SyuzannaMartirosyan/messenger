import { Block } from "@/core/block";

import { Input } from "@/views/components/input/input";
import type { InputProps } from "@/views/components/input/input";

import { Button } from "@/views/components/button/button";
import type { ButtonProps } from "@/views/components/button/button";

import { createValidator } from "@/utils/validation";

export type RegistrationFormValues = {
  email: string;
  login: string;
  first_name: string;
  second_name: string;
  phone: string;
  password: string;
  confirm_password: string;
};

export type RegistrationPageProps = {
  onSubmit?: (values: RegistrationFormValues) => void;
  successRoute?: string;
};

type RegistrationPageState = RegistrationFormValues;

const registrationTemplate = () => `
<section class="authentication u-center-screen">
  <div class="authentication__content">
    <h2 class="authentication__title u-text-center">Registration</h2>
    <form class="authentication__form" name="registration">
      <div data-component="input-email"></div>
      <div data-component="input-login"></div>
      <div data-component="input-first-name"></div>
      <div data-component="input-last-name"></div>
      <div data-component="input-phone"></div>
      <div data-component="input-password"></div>
      <div data-component="input-confirm-password"></div>

      <div class="authentication__actions">
        <div data-component="submit-button"></div>
      </div>

      <p class="authentication__hint u-text-center">
        <a href="http://localhost:3000/login.html">Log In</a>
      </p>
    </form>
  </div>
</section>
`;

export class RegistrationPage extends Block<
  RegistrationPageProps,
  RegistrationPageState
> {
  private emailInput!: Input;
  private loginInput!: Input;
  private firstNameInput!: Input;
  private lastNameInput!: Input;
  private phoneInput!: Input;
  private passwordInput!: Input;
  private confirmPasswordInput!: Input;

  private submitButton!: Button;

  private submitHandler?: (e: Event) => void;

  private validator?: ReturnType<typeof createValidator>;

  private static readonly NAME_PATTERN =
    /^[A-ZА-ЯЁ][A-Za-zА-Яа-яЁё-]*$/;

  private static readonly LOGIN_PATTERN =
    /^(?=.{3,20}$)(?!\d+$)[A-Za-z0-9][A-Za-z0-9_-]*$/;

  private static readonly EMAIL_PATTERN =
    /^[A-Za-z0-9._%+-]+@[A-Za-z0-9-]+\.[A-Za-z]+$/;

  private static readonly PASSWORD_PATTERN =
    /^(?=.*[A-Z])(?=.*\d).{8,40}$/;

  private static readonly PHONE_PATTERN =
    /^\+?\d{10,15}$/;

  constructor(props: RegistrationPageProps = {}) {
    super("section", props, {
      email: "",
      login: "",
      first_name: "",
      second_name: "",
      phone: "",
      password: "",
      confirm_password: "",
    });
  }

  protected init(): void {
    this.emailInput = this.createInput(
      "email",
      "Mail Address",
      "email",
      "Mail Address"
    );

    this.loginInput = this.createInput("login", "Login", "text", "Login");

    this.firstNameInput = this.createInput(
      "first_name",
      "Name",
      "text",
      "Name"
    );

    this.lastNameInput = this.createInput(
      "second_name",
      "Last Name",
      "text",
      "Last Name"
    );

    this.phoneInput = this.createInput(
      "phone",
      "Phone Number",
      "tel",
      "Phone Number"
    );

    this.passwordInput = this.createInput(
      "password",
      "Password",
      "password",
      "Password"
    );

    this.confirmPasswordInput = this.createInput(
      "confirm_password",
      "Confirm Password",
      "password",
      "Confirm Password"
    );

    this.submitButton = new Button({
      text: "Registration",
      type: "submit",
      modifier: "primary",
    } satisfies ButtonProps);
  }

  private createInput(
    name: keyof RegistrationFormValues,
    label: string,
    type: string,
    placeholder: string
  ): Input {
    return new Input({
      name,
      label,
      type,
      placeholder,
      required: true,
      value: this.state[name],
      onInput: (value) => {
        this.patchState({ [name]: value } as Partial<RegistrationPageState>);
      },
    } satisfies InputProps);
  }

  protected render(): string {
    return registrationTemplate();
  }

  protected componentDidMount(): void {
    this.mountChildren();

    const emailEl = this.qs<HTMLInputElement>('input[name="email"]');
    const loginEl = this.qs<HTMLInputElement>('input[name="login"]');
    const firstNameEl = this.qs<HTMLInputElement>('input[name="first_name"]');
    const lastNameEl = this.qs<HTMLInputElement>('input[name="second_name"]');
    const phoneEl = this.qs<HTMLInputElement>('input[name="phone"]');
    const passwordEl = this.qs<HTMLInputElement>('input[name="password"]');
    const confirmPasswordEl = this.qs<HTMLInputElement>(
      'input[name="confirm_password"]'
    );

    if (
      !emailEl ||
      !loginEl ||
      !firstNameEl ||
      !lastNameEl ||
      !phoneEl ||
      !passwordEl ||
      !confirmPasswordEl
    ) {
      console.error("[RegistrationPage] Some inputs for validator not found");
      return;
    }

    this.validator = createValidator({
      email: {
        input: emailEl,
        pattern: RegistrationPage.EMAIL_PATTERN,
        message: "Invalid email format",
      },
      login: {
        input: loginEl,
        pattern: RegistrationPage.LOGIN_PATTERN,
        message:
          "Login: 3–20 символов, латиница, может содержать цифры, '-' и '_', не только цифры.",
      },
      first_name: {
        input: firstNameEl,
        pattern: RegistrationPage.NAME_PATTERN,
        message:
          "First name: первая буква заглавная, только буквы (латиница/кириллица) и дефис.",
      },
      second_name: {
        input: lastNameEl,
        pattern: RegistrationPage.NAME_PATTERN,
        message:
          "Last name: первая буква заглавная, только буквы (латиница/кириллица) и дефис.",
      },
      phone: {
        input: phoneEl,
        pattern: RegistrationPage.PHONE_PATTERN,
        message:
          "Phone: от 10 до 15 цифр, может начинаться с '+'.",
      },
      password: {
        input: passwordEl,
        pattern: RegistrationPage.PASSWORD_PATTERN,
        message:
          "Password: 8–40 символов, хотя бы одна заглавная буква и одна цифра.",
      },
      confirm_password: {
        input: confirmPasswordEl,
        pattern: RegistrationPage.PASSWORD_PATTERN,
        message:
          "Password: 8–40 символов, хотя бы одна заглавная буква и одна цифра.",
      },
    });
  }

  protected componentWillUnmount(): void {
    if (this.validator) {
      this.validator.destroy();
      this.validator = undefined;
    }

    this.emailInput.destroy();
    this.loginInput.destroy();
    this.firstNameInput.destroy();
    this.lastNameInput.destroy();
    this.phoneInput.destroy();
    this.passwordInput.destroy();
    this.confirmPasswordInput.destroy();

    this.submitButton.destroy();
  }

  protected addEvents(): void {
    const form = this.qs<HTMLFormElement>('form[name="registration"]');
    if (!form) return;

    this.submitHandler = (event: Event) => {
      event.preventDefault();

      const formElement = event.target as HTMLFormElement;
      const formData = new FormData(formElement);

      const values: RegistrationFormValues = {
        email: String(formData.get("email") ?? "").trim(),
        login: String(formData.get("login") ?? "").trim(),
        first_name: String(formData.get("first_name") ?? "").trim(),
        second_name: String(formData.get("second_name") ?? "").trim(),
        phone: String(formData.get("phone") ?? "").trim(),
        password: String(formData.get("password") ?? ""),
        confirm_password: String(formData.get("confirm_password") ?? ""),
      };

      const confirmInputEl = this.qs<HTMLInputElement>(
        'input[name="confirm_password"]'
      );

      const getConfirmErrorEl = (): HTMLElement | null => {
        if (!confirmInputEl) return null;

        const direct = confirmInputEl.nextElementSibling;
        if (
          direct &&
          direct instanceof HTMLElement &&
          direct.classList.contains("input-error")
        ) {
          return direct;
        }

        const fromWrapper = confirmInputEl
          .closest(".input")
          ?.querySelector(".input-error");

        return (fromWrapper as HTMLElement | null) ?? null;
      };

      let isValid = this.validator ? this.validator.validateAll() : true;

      const passwordsMatch = values.password === values.confirm_password;

      if (!passwordsMatch) {
        if (confirmInputEl) {
          const errorEl = getConfirmErrorEl();

          confirmInputEl.classList.add("input--error");

          if (errorEl) {
            errorEl.textContent = "Passwords do not match";
          }
        }

        console.log("[RegistrationPage] Passwords do not match", values);
        isValid = false;
      } else {
        if (confirmInputEl) {
          const errorEl = getConfirmErrorEl();

          confirmInputEl.classList.remove("input--error");

          if (errorEl && errorEl.textContent === "Passwords do not match") {
            errorEl.textContent = "";
          }
        }
      }

      if (!isValid) {
        console.log("[RegistrationPage] Form is invalid");
        return;
      }

      this.patchState(values);

      console.log("[RegistrationPage] Submit values:", values);

      this.bus.emit("auth:registration", values);

      if (this.props.onSubmit) {
        this.props.onSubmit(values);
      }

      if (!this.props.onSubmit) {
        const route =
          this.props.successRoute ??
          "http://localhost:3000/messenger.html";

        window.location.href = route;
      }
    };

    form.addEventListener("submit", this.submitHandler);
  }

  protected removeEvents(): void {
    const form = this.qs<HTMLFormElement>('form[name="registration"]');
    if (form && this.submitHandler) {
      form.removeEventListener("submit", this.submitHandler);
    }
    this.submitHandler = undefined;
  }

  private mountChildren(): void {
    const emailSlot = this.qs<HTMLElement>("[data-component='input-email']");
    if (emailSlot) {
      emailSlot.replaceWith(this.emailInput.getContent());
    }

    const loginSlot = this.qs<HTMLElement>("[data-component='input-login']");
    if (loginSlot) {
      loginSlot.replaceWith(this.loginInput.getContent());
    }

    const firstNameSlot = this.qs<HTMLElement>(
      "[data-component='input-first-name']"
    );
    if (firstNameSlot) {
      firstNameSlot.replaceWith(this.firstNameInput.getContent());
    }

    const lastNameSlot = this.qs<HTMLElement>(
      "[data-component='input-last-name']"
    );
    if (lastNameSlot) {
      lastNameSlot.replaceWith(this.lastNameInput.getContent());
    }

    const phoneSlot = this.qs<HTMLElement>("[data-component='input-phone']");
    if (phoneSlot) {
      phoneSlot.replaceWith(this.phoneInput.getContent());
    }

    const passwordSlot = this.qs<HTMLElement>(
      "[data-component='input-password']"
    );
    if (passwordSlot) {
      passwordSlot.replaceWith(this.passwordInput.getContent());
    }

    const confirmPasswordSlot = this.qs<HTMLElement>(
      "[data-component='input-confirm-password']"
    );
    if (confirmPasswordSlot) {
      confirmPasswordSlot.replaceWith(this.confirmPasswordInput.getContent());
    }

    const buttonSlot = this.qs<HTMLElement>("[data-component='submit-button']");
    if (buttonSlot) {
      buttonSlot.replaceWith(this.submitButton.getContent());
    }
  }
}

