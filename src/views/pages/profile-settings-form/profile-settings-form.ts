import { Block } from "@/core/block";

import { Button } from "@/views/components/button/button";
import type { ButtonProps } from "@/views/components/button/button";

import { ButtonRound } from "@/views/components/button-round/button-round";
import type { ButtonRoundProps } from "@/views/components/button-round/button-round";

import { Input } from "@/views/components/input/input";
import type { InputProps } from "@/views/components/input/input";

import { ProfileCard } from "@/views/components/profile-card/profile-card";
import type { ProfileCardProps } from "@/views/components/profile-card/profile-card";

import { profileData } from "@/models/mock/profile";
import { createValidator } from "@/utils/validation";

const profileSettingsTemplate = () => `
  <div class="profile-page u-flex-center u-f-direction-column">
    <div class="profile-page_header u-flex">
      <div data-component="back-button"></div>
    </div>

    <section class="profile-page__wrapper u-f-direction-column">
      <div class="profile-page__card">
        <div class="profile-page__header">
          <div data-component="profile-card"></div>
        </div>

        <form class="profile-page__form" name="profile-settings">
          <div data-component="input-email"></div>
          <div data-component="input-login"></div>
          <div data-component="input-first-name"></div>
          <div data-component="input-last-name"></div>
          <div data-component="input-display-name"></div>
          <div data-component="input-phone"></div>
          <div data-component="input-avatar"></div>

          <div class="profile-page__actions u-flex-center">
            <div data-component="save-button"></div>
          </div>
        </form>
      </div>
    </section>
  </div>
`;

export type ProfileSettingsFormValues = {
  email: string;
  login: string;
  first_name: string;
  second_name: string;
  display_name: string;
  phone: string;
  avatar?: string;
};

export type ProfileSettingsFormProps = {
  initialValues?: Partial<ProfileSettingsFormValues>;
  onSubmit?: (values: ProfileSettingsFormValues) => void;
  returnRoute?: string;
};

type ProfileSettingsFormState = ProfileSettingsFormValues;

export class ProfileSettingsForm extends Block<
  ProfileSettingsFormProps,
  ProfileSettingsFormState
> {
  private backButton!: ButtonRound;
  private profileCard!: ProfileCard;

  private emailInput!: Input;
  private loginInput!: Input;
  private firstNameInput!: Input;
  private lastNameInput!: Input;
  private displayNameInput!: Input;
  private phoneInput!: Input;
  private avatarInput!: Input;

  private saveButton!: Button;

  private submitHandler?: (e: Event) => void;

  private validator?: ReturnType<typeof createValidator>;

  private static readonly NAME_PATTERN =
    /^[A-ZА-ЯЁ][A-Za-zА-Яа-яЁё-]*$/;

  private static readonly LOGIN_PATTERN =
    /^(?=.{3,20}$)(?!\d+$)[A-Za-z0-9][A-Za-z0-9_-]*$/;

  private static readonly EMAIL_PATTERN =
    /^[A-Za-z0-9._%+-]+@[A-Za-z0-9-]+\.[A-Za-z]+$/;

  private static readonly PHONE_PATTERN =
    /^\+?\d{10,15}$/;

  constructor(props: ProfileSettingsFormProps = {}) {
    const initial: ProfileSettingsFormState = {
      email: props.initialValues?.email ?? "",
      login: props.initialValues?.login ?? "",
      first_name:
        props.initialValues?.first_name ?? (profileData.firstName ?? ""),
      second_name:
        props.initialValues?.second_name ?? (profileData.lastName ?? ""),
      display_name: props.initialValues?.display_name ?? "",
      phone: props.initialValues?.phone ?? "",
      avatar: props.initialValues?.avatar ?? "",
    };

    super("div", props, initial);
  }

  protected init(): void {
    this.backButton = new ButtonRound({
      type: "button",
      modifier: "secondary",
      ariaLabel: "return",
      dataRoute: "./profile.html",
      onClick: (event) => {
        const target = event.currentTarget as HTMLElement | null;
        const route = target?.dataset.route;
        if (route) {
          window.location.href = route;
        }
      },
    } satisfies ButtonRoundProps);

    this.profileCard = new ProfileCard({
      avatarSrc: profileData.avatarSrc,
      name: this.state.first_name,
      lastName: this.state.second_name,
    } satisfies ProfileCardProps);

    this.emailInput = new Input({
      label: "Email Address",
      name: "email",
      type: "email",
      placeholder: "Email Address",
      autocomplete: "off",
      required: false,
      value: this.state.email,
      onInput: (value) => this.patchState({ email: value }),
    } satisfies InputProps);

    this.loginInput = new Input({
      label: "Login",
      name: "login",
      type: "text",
      placeholder: "Login",
      autocomplete: "off",
      required: false,
      value: this.state.login,
      onInput: (value) => this.patchState({ login: value }),
    } satisfies InputProps);

    this.firstNameInput = new Input({
      label: "Name",
      name: "first_name",
      type: "text",
      placeholder: "Name",
      autocomplete: "off",
      required: false,
      value: this.state.first_name,
      onInput: (value) => this.patchState({ first_name: value }),
    } satisfies InputProps);

    this.lastNameInput = new Input({
      label: "Last Name",
      name: "second_name",
      type: "text",
      placeholder: "Last Name",
      autocomplete: "off",
      required: false,
      value: this.state.second_name,
      onInput: (value) => this.patchState({ second_name: value }),
    } satisfies InputProps);

    this.displayNameInput = new Input({
      label: "User Name",
      name: "display_name",
      type: "text",
      placeholder: "User Name",
      autocomplete: "off",
      required: false,
      value: this.state.display_name,
      onInput: (value) => this.patchState({ display_name: value }),
    } satisfies InputProps);

    this.phoneInput = new Input({
      label: "Phone Number",
      name: "phone",
      type: "tel",
      placeholder: "Phone Number",
      autocomplete: "off",
      required: false,
      value: this.state.phone,
      onInput: (value) => this.patchState({ phone: value }),
    } satisfies InputProps);

    this.avatarInput = new Input({
      label: "Upload new avatar",
      name: "avatar",
      type: "file",
      placeholder: "Upload new avatar",
      autocomplete: "off",
      required: true,
      value: this.state.avatar,
      onInput: (value) => this.patchState({ avatar: value }),
    } satisfies InputProps);

    this.saveButton = new Button({
      text: "Save",
      type: "submit",
      modifier: "primary",
    } satisfies ButtonProps);
  }

  protected render(): string {
    return profileSettingsTemplate();
  }

  protected componentDidMount(): void {
    this.mountChildren();

    const emailEl = this.qs<HTMLInputElement>('input[name="email"]');
    const loginEl = this.qs<HTMLInputElement>('input[name="login"]');
    const firstNameEl = this.qs<HTMLInputElement>('input[name="first_name"]');
    const lastNameEl = this.qs<HTMLInputElement>('input[name="second_name"]');
    const phoneEl = this.qs<HTMLInputElement>('input[name="phone"]');

    if (
      !emailEl ||
      !loginEl ||
      !firstNameEl ||
      !lastNameEl ||
      !phoneEl
    ) {
      console.error(
        "[ProfileSettingsForm] Some inputs for validator not found"
      );
      return;
    }

    this.validator = createValidator({
      email: {
        input: emailEl,
        pattern: ProfileSettingsForm.EMAIL_PATTERN,
        message: "Invalid email format",
      },
      login: {
        input: loginEl,
        pattern: ProfileSettingsForm.LOGIN_PATTERN,
        message:
          " 3–20 символов, латиница, может содержать цифры, '-' и '_', не только цифры.",
      },
      first_name: {
        input: firstNameEl,
        pattern: ProfileSettingsForm.NAME_PATTERN,
        message:
          "Первая буква заглавная, только буквы (латиница/кириллица) и дефис.",
      },
      second_name: {
        input: lastNameEl,
        pattern: ProfileSettingsForm.NAME_PATTERN,
        message:
          " Первая буква заглавная, только буквы (латиница/кириллица) и дефис.",
      },
      phone: {
        input: phoneEl,
        pattern: ProfileSettingsForm.PHONE_PATTERN,
        message:
          " от 10 до 15 цифр, может начинаться с '+'.",
      },
    });
  }

  protected componentDidUpdate(): void {
    this.profileCard.setProps({
      name: this.state.first_name,
      lastName: this.state.second_name,
    } satisfies ProfileCardProps);

    this.mountChildren();
  }

  protected componentWillUnmount(): void {
    if (this.validator) {
      this.validator.destroy();
      this.validator = undefined;
    }

    this.backButton.destroy();
    this.profileCard.destroy();

    this.emailInput.destroy();
    this.loginInput.destroy();
    this.firstNameInput.destroy();
    this.lastNameInput.destroy();
    this.displayNameInput.destroy();
    this.phoneInput.destroy();
    this.avatarInput.destroy();

    this.saveButton.destroy();
  }

  protected addEvents(): void {
    const form = this.qs<HTMLFormElement>('form[name="profile-settings"]');
    if (!form) return;

   this.submitHandler = (event: Event) => {
  event.preventDefault();

  const isValid = this.validator ? this.validator.validateAll() : true;

  if (!isValid) {
    console.log("[ProfileSettingsForm] Form is invalid");
    return;
  }

  const values: ProfileSettingsFormValues = { ...this.state };

  console.log("[ProfileSettingsForm] Submit values:", values); 

  this.bus.emit("profile:updated", {
    firstName: values.first_name,
    lastName: values.second_name,
  });

  if (this.props.onSubmit) {
    this.props.onSubmit(values);
  }

  // оставила редирект закомментированным, как у тебя
  /*
  if (!this.props.onSubmit) {
    const route = this.props.returnRoute ?? "./profile.html";
    window.location.href = route;
  }
  */
};

    form.addEventListener("submit", this.submitHandler);
  }

  protected removeEvents(): void {
    const form = this.qs<HTMLFormElement>('form[name="profile-settings"]');
    if (form && this.submitHandler) {
      form.removeEventListener("submit", this.submitHandler);
    }
    this.submitHandler = undefined;
  }

  private mountChildren(): void {
    const backSlot = this.qs<HTMLElement>("[data-component='back-button']");
    if (backSlot) {
      backSlot.replaceWith(this.backButton.getContent());
    }

    const cardSlot = this.qs<HTMLElement>("[data-component='profile-card']");
    if (cardSlot) {
      cardSlot.replaceWith(this.profileCard.getContent());
    }

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

    const displayNameSlot = this.qs<HTMLElement>(
      "[data-component='input-display-name']"
    );
    if (displayNameSlot) {
      displayNameSlot.replaceWith(this.displayNameInput.getContent());
    }

    const phoneSlot = this.qs<HTMLElement>("[data-component='input-phone']");
    if (phoneSlot) {
      phoneSlot.replaceWith(this.phoneInput.getContent());
    }

    const avatarSlot = this.qs<HTMLElement>("[data-component='input-avatar']");
    if (avatarSlot) {
      avatarSlot.replaceWith(this.avatarInput.getContent());
    }

    const saveSlot = this.qs<HTMLElement>("[data-component='save-button']");
    if (saveSlot) {
      saveSlot.replaceWith(this.saveButton.getContent());
    }
  }
}

