import { Block } from "../../../core/block";
import { Button } from "../../components/button/button";
import type { ButtonProps } from "../../components/button/button";
import { Input } from "../../components/input/input";
import type { InputProps } from "../../components/input/input";
import type { ChatData } from "../../../models/mock/chat/chat";

export type ChatListProps = {
  chats: ChatData[];
  onChatSelect?: (chat: ChatData) => void;
};

type ChatListState = {
  activeChatId: number | null;
};

const chatListTemplate = ({
  chats,
}: {
  chats: ChatData[];
}) => `
  <div class="chats">
    <header class="chats__header u-flex-end">
      <div data-component="profile-button"></div>
    </header>

    <div data-component="search-input"></div>

    <ul class="chats__list">
      ${chats
        .map(
          (chat) => `
        <li class="chats__item" data-id="${chat.id}">
          <div class="chat-item">
            <div class="chat-item__avatar u-flex-center">
              ${
                chat.avatar
                  ? `<img 
                      src="${chat.avatar}" 
                      alt="${chat.name ?? ""}" 
                      class="chat-item__avatar-img" 
                    />`
                  : `<div class="chat-item__avatar-placeholder"></div>`
              }
            </div>

            <div class="chat-item__content">
              <div class="chat-item__row chat-item__row--top u-flex-between">
                <span class="chat-item__name">${chat.name ?? ""}</span>
                <span class="chat-item__time">${chat.time ?? ""}</span>
              </div>

              <div class="chat-item__row chat-item__row--bottom">
                <span class="chat-item__last-message">${chat.lastMessage ?? ""}</span>
                ${
                  chat.unreadCount && chat.unreadCount > 0
                    ? `<span class="chat-item__badge">${chat.unreadCount}</span>`
                    : ""
                }
              </div>
            </div>
          </div>
        </li>
      `
        )
        .join("")}
    </ul>
  </div>
`;

export class ChatList extends Block<ChatListProps, ChatListState> {
  private profileButton!: Button;
  private searchInput!: Input;

  private itemHandlers: Map<HTMLElement, (e: MouseEvent) => void> | null = null;

  constructor(props: ChatListProps) {
    super("section", props, {
      activeChatId: null,
    });
  }

  protected init(): void {
    this.profileButton = new Button({
      text: "My Profile",
      type: "button",
      modifier: "secondary",
      dataRoute: "http://localhost:3000/profile.html",
      onClick: (event) => {
        const target = event.currentTarget as HTMLElement | null;
        const route = target?.dataset.route;
        if (route) {
          window.location.href = route;
        }
      },
    } satisfies ButtonProps);

    this.searchInput = new Input({
      name: "search",
      type: "text",
      placeholder: "Search",
      required: false,
      onInput: (value) => {
        console.log("[ChatList] search:", value);
      },
    } satisfies InputProps);
  }

  protected render(): string {
    return chatListTemplate({
      chats: this.props.chats,
    });
  }

  protected componentDidMount(): void {
    this.mountChildren();
  }

  protected componentDidUpdate(
    prevProps: Readonly<ChatListProps>,
    prevState: Readonly<ChatListState>
  ): void {
    if (prevProps.chats !== this.props.chats) {
      this.mountChildren();
    }

    if (prevState.activeChatId !== this.state.activeChatId) {
     console.log("[ChatList] active chat changed:", this.state.activeChatId);
    }
  }

  protected componentWillUnmount(): void {
    this.removeEvents();
    this.profileButton.destroy();
    this.searchInput.destroy();
  }


  protected shouldUpdate(
    nextProps: Readonly<ChatListProps>,
    nextState: Readonly<ChatListState>
  ): boolean {
    const chatsChanged = nextProps.chats !== this.props.chats;
    const activeChanged =
      nextState.activeChatId !== this.state.activeChatId;

    return chatsChanged || activeChanged;
  }

  protected patchDom(
    _prevProps: Readonly<ChatListProps>,
    prevState: Readonly<ChatListState>
  ): boolean {
    if (prevState.activeChatId === this.state.activeChatId) {
      return false;
    }

    const items = this.qsa<HTMLLIElement>(".chats__item");
    if (!items.length) return false;

    items.forEach((el) => {
      const idAttr = el.dataset.id;
      if (!idAttr) return;

      const id = Number(idAttr);
      const isActive = id === this.state.activeChatId;
      el.classList.toggle("chats__item--active", isActive);
    });

    return true;
  }

  protected addEvents(): void {
    const items = this.qsa<HTMLLIElement>(".chats__item");
    if (!items.length) return;

    if (!this.itemHandlers) {
      this.itemHandlers = new Map<HTMLElement, (e: MouseEvent) => void>();
    }

    items.forEach((item) => {
      const handler = (event: MouseEvent) => {
        const idAttr = item.dataset.id;
        if (!idAttr) return;

        const id = Number(idAttr);

        if (this.state.activeChatId === id) {
          return;
        }

        const chat = this.props.chats.find((c) => c.id === id);
        if (!chat) return;

        this.setState(
          {
            activeChatId: id,
          } as Partial<ChatListState>,
          { partial: true }
        );

        this.props.onChatSelect?.(chat);
      };

      item.addEventListener("click", handler);
      this.itemHandlers!.set(item, handler);
    });
  }

  protected removeEvents(): void {
    if (!this.itemHandlers) return;

    this.itemHandlers.forEach((handler, el) => {
      el.removeEventListener("click", handler);
    });
    this.itemHandlers.clear();
  }

  private mountChildren(): void {
    const buttonSlot = this.qs<HTMLElement>("[data-component='profile-button']");
    if (buttonSlot) {
      buttonSlot.replaceWith(this.profileButton.getContent());
    }

    const inputSlot = this.qs<HTMLElement>("[data-component='search-input']");
    if (inputSlot) {
      inputSlot.replaceWith(this.searchInput.getContent());
    }
  }
}
