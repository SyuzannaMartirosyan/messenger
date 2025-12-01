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

const changePasswordTemplate = () => `
  <div class="profile-page u-flex-center u-f-direction-column">
    <div class="profile-page_header u-flex">
      <div data-component="back-button"></div>
    </div>

    <section class="profile-page__wrapper u-f-direction-column">
      <div class="profile-page__card">
        <div class="profile-page__header">
          <div data-component="profile-card"></div>
        </div>

        <form class="profile-page__form" name="change-password">
          <div data-component="input-old-password"></div>
          <div data-component="input-new-password"></div>
          <div data-component="input-confirm-password"></div>

          <div class="profile-page__actions u-flex-center">
            <div data-component="save-button"></div>
          </div>
        </form>
      </div>
    </section>
  </div>
`;

export type ChangePasswordFormValues = {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
};

export type ChangePasswordFormProps = {
  initialValues?: Partial<ChangePasswordFormValues>;
  onSubmit?: (values: ChangePasswordFormValues) => void;
  returnRoute?: string;
};

type ChangePasswordFormState = ChangePasswordFormValues;

export class ChangePasswordForm extends Block<
  ChangePasswordFormProps,
  ChangePasswordFormState
> {
  private backButton!: ButtonRound;
  private profileCard!: ProfileCard;

  private oldPasswordInput!: Input;
  private newPasswordInput!: Input;
  private confirmPasswordInput!: Input;

  private saveButton!: Button;

  private submitHandler?: (e: Event) => void;

  private validator?: ReturnType<typeof createValidator>;

  private static readonly PASSWORD_PATTERN =
    /^(?=.*[A-Z])(?=.*\d).{8,40}$/;

  constructor(props: ChangePasswordFormProps = {}) {
    const initial: ChangePasswordFormState = {
      oldPassword: props.initialValues?.oldPassword ?? "",
      newPassword: props.initialValues?.newPassword ?? "",
      confirmPassword: props.initialValues?.confirmPassword ?? "",
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
      name: profileData.firstName,
      lastName: profileData.lastName,
    } satisfies ProfileCardProps);

    this.oldPasswordInput = new Input({
      name: "oldPassword",
      label: "Old Password",
      type: "password",
      placeholder: "Old Password",
      autocomplete: "off",
      required: false,
      value: this.state.oldPassword,
      onInput: (value) => this.patchState({ oldPassword: value }),
    } satisfies InputProps);

    this.newPasswordInput = new Input({
      name: "newPassword",
      label: "New Password",
      type: "password",
      placeholder: "New Password",
      autocomplete: "off",
      required: false,
      value: this.state.newPassword,
      onInput: (value) => this.patchState({ newPassword: value }),
    } satisfies InputProps);

    this.confirmPasswordInput = new Input({
      name: "confirmPassword",
      label: "Confirm new Password",
      type: "password",
      placeholder: "Confirm New Password",
      autocomplete: "off",
      required: false,
      value: this.state.confirmPassword,
      onInput: (value) => this.patchState({ confirmPassword: value }),
    } satisfies InputProps);

    this.saveButton = new Button({
      text: "Save",
      type: "submit",
      modifier: "primary",
      dataRoute: "./profile.html",
    } satisfies ButtonProps);
  }

  protected render(): string {
    return changePasswordTemplate();
  }

  protected componentDidMount(): void {
    this.mountChildren();

    const oldPasswordEl =
      this.qs<HTMLInputElement>('input[name="oldPassword"]');
    const newPasswordEl =
      this.qs<HTMLInputElement>('input[name="newPassword"]');
    const confirmPasswordEl =
      this.qs<HTMLInputElement>('input[name="confirmPassword"]');

    if (!oldPasswordEl || !newPasswordEl || !confirmPasswordEl) {
      console.error(
        "[ChangePasswordForm] Some inputs for validator not found"
      );
      return;
    }

    this.validator = createValidator({
      oldPassword: {
        input: oldPasswordEl,
        pattern: ChangePasswordForm.PASSWORD_PATTERN,
        message:
          "Password: 8–40 символов, хотя бы одна заглавная буква и одна цифра.",
      },
      newPassword: {
        input: newPasswordEl,
        pattern: ChangePasswordForm.PASSWORD_PATTERN,
        message:
          "Password: 8–40 символов, хотя бы одна заглавная буква и одна цифра.",
      },
      confirmPassword: {
        input: confirmPasswordEl,
        pattern: ChangePasswordForm.PASSWORD_PATTERN,
        message:
          "Password: 8–40 символов, хотя бы одна заглавная буква и одна цифра.",
      },
    });
  }

  protected componentDidUpdate(): void {
    this.mountChildren();
  }

  protected componentWillUnmount(): void {
    if (this.validator) {
      this.validator.destroy();
      this.validator = undefined;
    }

    this.backButton.destroy();
    this.profileCard.destroy();

    this.oldPasswordInput.destroy();
    this.newPasswordInput.destroy();
    this.confirmPasswordInput.destroy();

    this.saveButton.destroy();
  }

  protected addEvents(): void {
    const form = this.qs<HTMLFormElement>('form[name="change-password"]');
    if (!form) return;

    this.submitHandler = (event: Event) => {
      event.preventDefault();

      let isValid = this.validator ? this.validator.validateAll() : true;

      const values: ChangePasswordFormValues = { ...this.state };

      const newPasswordEl =
        this.qs<HTMLInputElement>('input[name="newPassword"]');
      const confirmPasswordEl =
        this.qs<HTMLInputElement>('input[name="confirmPassword"]');

      const getConfirmErrorEl = (): HTMLElement | null => {
        if (!confirmPasswordEl) return null;

        const direct = confirmPasswordEl.nextElementSibling;
        if (
          direct &&
          direct instanceof HTMLElement &&
          direct.classList.contains("input-error")
        ) {
          return direct;
        }

        const fromWrapper = confirmPasswordEl
          .closest(".input")
          ?.querySelector(".input-error");

        return (fromWrapper as HTMLElement | null) ?? null;
      };

      const passwordsMatch =
        values.newPassword === values.confirmPassword;

      if (!passwordsMatch) {
        if (confirmPasswordEl) {
          const errorEl = getConfirmErrorEl();

          confirmPasswordEl.classList.add("input--error");

          if (errorEl) {
            errorEl.textContent = "Passwords do not match";
          }
        }

        console.log(
          "[ChangePasswordForm] Passwords do not match",
          values
        );
        isValid = false;
      } else {
        if (confirmPasswordEl) {
          const errorEl = getConfirmErrorEl();

          confirmPasswordEl.classList.remove("input--error");

          if (errorEl && errorEl.textContent === "Passwords do not match") {
            errorEl.textContent = "";
          }
        }
      }

      if (!isValid) {
        console.log("[ChangePasswordForm] Form is invalid");
        return;
      }

      console.log("[ChangePasswordForm] Submit values:", values);

      if (this.props.onSubmit) {
        this.props.onSubmit(values);
      }

     /* if (!this.props.onSubmit) {
        const route = this.props.returnRoute ?? "./profile.html";
        window.location.href = route;
      }*/
    };

    form.addEventListener("submit", this.submitHandler);
  }

  protected removeEvents(): void {
    const form = this.qs<HTMLFormElement>('form[name="change-password"]');
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

    const oldSlot = this.qs<HTMLElement>(
      "[data-component='input-old-password']"
    );
    if (oldSlot) {
      oldSlot.replaceWith(this.oldPasswordInput.getContent());
    }

    const newSlot = this.qs<HTMLElement>(
      "[data-component='input-new-password']"
    );
    if (newSlot) {
      newSlot.replaceWith(this.newPasswordInput.getContent());
    }

    const confirmSlot = this.qs<HTMLElement>(
      "[data-component='input-confirm-password']"
    );
    if (confirmSlot) {
      confirmSlot.replaceWith(this.confirmPasswordInput.getContent());
    }

    const saveSlot = this.qs<HTMLElement>("[data-component='save-button']");
    if (saveSlot) {
      saveSlot.replaceWith(this.saveButton.getContent());
    }
  }
}

