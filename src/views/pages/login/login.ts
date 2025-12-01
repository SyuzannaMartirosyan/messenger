import { Block } from "@/core/block";
import { Input } from "@/views/components/input/input";
import type { InputProps } from "@/views/components/input/input";
import { Button } from "@/views/components/button/button";
import type { ButtonProps } from "@/views/components/button/button";

import { createValidator } from "@/utils/validation";

export type LoginFormValues = {
  login: string;
  password: string;
};

export type LoginPageProps = {
  onSubmit?: (values: LoginFormValues) => void;
  successRoute?: string;
};

type LoginPageState = {
  login: string;
  password: string;
};

const loginTemplate = () => `
  <section class="authentication u-center-screen">
    <div class="authentication__content">
      <h2 class="authentication__title u-text-center">SIGN IN</h2>

      <form class="authentication__form" name="login">
        <div data-component="login-input"></div>

        <div data-component="password-input"></div>

        <div class="authentication__actions">
          <div data-component="submit-button"></div>
        </div>

        <p class="authentication__hint u-text-center">
          <a href="http://localhost:3000/error404.html">Do you forgot Password?</a>
        </p>
        <p class="authentication__hint u-text-center">
          <a href="http://localhost:3000/registration.html">Registration</a>
        </p>
      </form>
    </div>
  </section>
`;

export class LoginPage extends Block<LoginPageProps, LoginPageState> {
  private loginInput!: Input;
  private passwordInput!: Input;
  private submitButton!: Button;

  private submitHandler?: (e: Event) => void;

  private validator?: ReturnType<typeof createValidator>;

  private static readonly LOGIN_PATTERN =
    /^(?=.{3,20}$)(?!\d+$)[A-Za-z0-9][A-Za-z0-9_-]*$/;

  private static readonly PASSWORD_PATTERN = /^(?=.*[A-Z])(?=.*\d).{8,40}$/;

  constructor(props: LoginPageProps = {}) {
    super("section", props, {
      login: "",
      password: "",
    });
  }

  protected init(): void {
    this.loginInput = new Input({
      label: "Login",
      name: "login",
      type: "text",
      placeholder: "Your Login",
      autocomplete: "on",
      required: true,
      value: this.state.login,
      onInput: (value) => {
        this.patchState({ login: value });
      },
    } satisfies InputProps);

    this.passwordInput = new Input({
      label: "Password",
      name: "password",
      type: "password",
      placeholder: "Password",
      autocomplete: "off",
      required: true,
      value: this.state.password,
      onInput: (value) => {
        this.patchState({ password: value });
      },
    } satisfies InputProps);

    this.submitButton = new Button({
      text: "Sign In",
      type: "submit",
      modifier: "primary",
    } satisfies ButtonProps);
  }

  protected render(): string {
    return loginTemplate();
  }

  protected componentDidMount(): void {
    this.mountChildren();

    const loginInputEl = this.qs<HTMLInputElement>('input[name="login"]');
    const passwordInputEl = this.qs<HTMLInputElement>('input[name="password"]');

    if (!loginInputEl || !passwordInputEl) {
      console.error("[LoginPage] Inputs for validator not found");
      return;
    }

    this.validator = createValidator({
      login: {
        input: loginInputEl,
        pattern: LoginPage.LOGIN_PATTERN,
        message:
          "invalid format",
      },
      password: {
        input: passwordInputEl,
        pattern: LoginPage.PASSWORD_PATTERN,
        message:
          "invalid format",
      },
    });
  }

  protected componentWillUnmount(): void {
    if (this.validator) {
      this.validator.destroy();
      this.validator = undefined;
    }

    this.loginInput.destroy();
    this.passwordInput.destroy();
    this.submitButton.destroy();
  }

  protected addEvents(): void {
    const form = this.qs<HTMLFormElement>('form[name="login"]');
    if (!form) return;

    this.submitHandler = (event: Event) => {
      event.preventDefault();

      const isValid = this.validator ? this.validator.validateAll() : true;

      if (!isValid) {
        console.log("[LoginPage] Form is invalid");
        return;
      }

      const formElement = event.target as HTMLFormElement;
      const formData = new FormData(formElement);

      const values: LoginFormValues = {
        login: String(formData.get("login") ?? "").trim(),
        password: String(formData.get("password") ?? ""),
      };

      this.patchState({
        login: values.login,
        password: values.password,
      });

      console.log("[LoginPage] Submit values:", values);

      if (this.props.onSubmit) {
        this.props.onSubmit(values);
      }

      this.bus.emit("auth:login", values);

     /* if (!this.props.onSubmit) {
        const route =
          this.props.successRoute ?? "http://localhost:3000/messenger.html";

        window.location.href = route;
      }*/
    };

    form.addEventListener("submit", this.submitHandler);
  }

  protected removeEvents(): void {
    const form = this.qs<HTMLFormElement>('form[name="login"]');
    if (form && this.submitHandler) {
      form.removeEventListener("submit", this.submitHandler);
    }
    this.submitHandler = undefined;
  }

  private mountChildren(): void {
    const loginSlot = this.qs<HTMLElement>("[data-component='login-input']");
    if (loginSlot) {
      loginSlot.replaceWith(this.loginInput.getContent());
    }

    const passwordSlot = this.qs<HTMLElement>("[data-component='password-input']");
    if (passwordSlot) {
      passwordSlot.replaceWith(this.passwordInput.getContent());
    }

    const buttonSlot = this.qs<HTMLElement>("[data-component='submit-button']");
    if (buttonSlot) {
      buttonSlot.replaceWith(this.submitButton.getContent());
    }
  }
}
