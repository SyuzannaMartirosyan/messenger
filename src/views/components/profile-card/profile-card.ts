import { Block } from "../../../core/block";

export type ProfileCardProps = {
  avatarSrc?: string;
  name?: string;
  lastName?: string;
  onClick?: (event: MouseEvent) => void;
};

const template = ({
  avatarSrc,
  name,
  lastName,
}: ProfileCardProps) => `
  <div class="profile-card user-card u-flex-start u-f-direction-column">
    <div class="user-card__avatar u-flex-center">
      ${
        avatarSrc
          ? `<img 
              src="${avatarSrc}" 
              alt="${name ?? ""} ${lastName ?? ""}" 
              class="user-card__avatar-img"
              onerror="this.style.display='none'; this.parentElement.classList.add('user-card__avatar--empty');"
            />`
          : `<div class="user-card__avatar--empty"></div>`
      }
    </div>
    <p class="user-card__name">${name ?? ""} ${lastName ?? ""}</p>
  </div>
`;

export class ProfileCard extends Block<ProfileCardProps> {
  private _domClickHandler?: (e: Event) => void;

  constructor(props: ProfileCardProps) {
    super("div", props);
  }

  protected render(): string {
    return template(this.props); 
  }

  protected addEvents(): void {
    if (!this.props.onClick) return;

    const card = this.getContent().querySelector(".profile-card");
    if (!card) return;

    this._domClickHandler = (e: Event) => {
      this.props.onClick?.(e as MouseEvent);
    };

    card.addEventListener("click", this._domClickHandler);
  }

  protected removeEvents(): void {
    const card = this.getContent().querySelector(".profile-card");
    if (!card || !this._domClickHandler) return;

    card.removeEventListener("click", this._domClickHandler);
    this._domClickHandler = undefined;
  }
}

