import { Block } from "@/core/block";

import { ButtonRound } from "@/views/components/button-round/button-round";
import type { ButtonRoundProps } from "@/views/components/button-round/button-round";

import { ProfileCard } from "@/views/components/profile-card/profile-card";
import type { ProfileCardProps } from "@/views/components/profile-card/profile-card";

import { InfoField } from "@/views/components/info-field/info-field";
import type { InfoFieldProps } from "@/views/components/info-field/info-field";

import { profileData } from "@/models/mock/profile";

export type ProfilePageProps = {};

export type ProfileField = {
  label: string;
  type?: string;
  name?: string;
  value?: string;
  isEditable?: boolean;
};

type ProfilePageState = {
  avatarSrc?: string;
  firstName: string;
  lastName: string;
  fields: ProfileField[];
};

const profileTemplate = ({ fields }: { fields: ProfileField[] }) => `
  <main class="profile-page u-flex u-f-direction-column">
     <div class="profile-page_header u-flex">
      <div data-component="back-button"></div>
    </div>

    <section class="profile-page__wrapper u-flex u-f-direction-column">
      <div class="profile-page__card">

        <div class="profile-page__header">
          <div data-component="profile-card"></div>
        </div>

        <form class="profile-page__form" name="profile">
          ${fields
            .map(
              (_field, index) => `
            <div class="profile-page__field" data-field="${index}">
              <div data-component="info-field-${index}"></div>
            </div>
          `
            )
            .join("")}

          <div class="profile-page__actions u-text-center">
            <p class="profile-page__hint u-text-center">
              <a href="/profile-settings-form.html">Change profile settings</a>
            </p>
            <p class="profile-page__hint u-text-center">
              <a href="/change-password-form.html">Change password</a>
            </p>
            <p class="profile-page__hint u-text-center">
              <a href="/login.html">Logout</a>
            </p>
          </div>
        </form>
      </div>
    </section>
  </main>
`;

export class ProfilePage extends Block<ProfilePageProps, ProfilePageState> {
  private backButton!: ButtonRound;
  private profileCard!: ProfileCard;
  private fieldsComponents: InfoField[] = [];

  private handleProfileUpdated = (payload: Partial<ProfilePageState>): void => {
    const nextAvatar = payload.avatarSrc ?? this.state.avatarSrc;
    const nextFirstName = payload.firstName ?? this.state.firstName;
    const nextLastName = payload.lastName ?? this.state.lastName;

    if (payload.fields) {
      this.fieldsComponents.forEach((f) => f.destroy());
      this.fieldsComponents = payload.fields.map((field) => {
        return new InfoField({
          label: field.label,
          type: field.type,
          name: field.name,
          value: field.value,
          isEditable: field.isEditable,
          onInput: (value) => {
            if (field.name) {
              this.updateField(field.name, value);
            }
          },
        } satisfies InfoFieldProps);
      });
    }

    this.profileCard.setProps({
      avatarSrc: nextAvatar,
      name: nextFirstName,
      lastName: nextLastName,
    } satisfies ProfileCardProps);

    this.setState(payload);
  };

  constructor(props: ProfilePageProps = {}) {
    super("main", props, {
      avatarSrc: profileData.avatarSrc ?? undefined,
      firstName: profileData.firstName ?? "",
      lastName: profileData.lastName ?? "",
      fields: profileData.fields ?? [],
    });
  }

  protected init(): void {
    this.backButton = new ButtonRound({
      type: "button",
      modifier: "secondary",
      ariaLabel: "return",
      dataRoute: "./messenger.html",
      onClick: (event) => {
        const target = event.currentTarget as HTMLElement | null;
        const route = target?.dataset.route;
        if (route) {
          window.location.href = route;
        }
      },
    } satisfies ButtonRoundProps);

    this.profileCard = new ProfileCard({
      avatarSrc: this.state.avatarSrc,
      name: this.state.firstName,
      lastName: this.state.lastName,
    } satisfies ProfileCardProps);

    this.fieldsComponents = this.state.fields.map((field) => {
      return new InfoField({
        label: field.label,
        type: field.type,
        name: field.name,
        value: field.value,
        isEditable: field.isEditable,
        onInput: (value) => {
          if (field.name) {
            this.updateField(field.name, value);
          }
        },
      } satisfies InfoFieldProps);
    });

    this.bus.on("profile:updated", this.handleProfileUpdated);
  }

  protected render(): string {
    return profileTemplate({
      fields: this.state.fields,
    });
  }

  protected componentDidMount(): void {
    this.mountChildren();
  }

  protected componentDidUpdate(): void {
    this.mountChildren();
  }

  protected componentWillUnmount(): void {
    this.bus.off("profile:updated", this.handleProfileUpdated);

    this.backButton.destroy();
    this.profileCard.destroy();
    this.fieldsComponents.forEach((f) => f.destroy());
  }

  private updateField(fieldName: string, value: string): void {
    const updatedFields = this.state.fields.map((field) =>
      field.name === fieldName ? { ...field, value } : field
    );

    this.patchState({ fields: updatedFields });
  }

  private mountChildren(): void {
    const backSlot = this.qs<HTMLElement>("[data-component='back-button']");
    if (backSlot) {
      backSlot.replaceWith(this.backButton.getContent());
    }

    const profileSlot = this.qs<HTMLElement>("[data-component='profile-card']");
    if (profileSlot) {
      profileSlot.replaceWith(this.profileCard.getContent());
    }

    this.state.fields.forEach((_, index) => {
      const fieldSlot = this.qs<HTMLElement>(
        `[data-component='info-field-${index}']`
      );

      if (fieldSlot && this.fieldsComponents[index]) {
        fieldSlot.replaceWith(this.fieldsComponents[index].getContent());
      }
    });
  }
}
