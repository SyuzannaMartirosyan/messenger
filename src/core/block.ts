import { bus } from "./bus";

type PlainObject = Record<string, unknown>;

type UpdateOptions = {
  partial?: boolean;
};

export abstract class Block<
  P extends PlainObject = {},
  S extends PlainObject = {}
> {
  public props: Readonly<P>;
  protected state: Readonly<S>;

  protected readonly bus = bus;

  private readonly element: HTMLElement;
  private _isMounted = false;
  private _isDestroyed = false;

  constructor(
    tagName: keyof HTMLElementTagNameMap = "div",
    props = {} as P,
    initialState = {} as S
  ) {
    this.props = Object.freeze({ ...props });
    this.state = Object.freeze({ ...initialState });
    this.element = document.createElement(tagName);

    this.init();
    this._render();
  }

  protected patchState(next: Partial<S>): void {
    if (!next || Object.keys(next).length === 0) return;
    const merged = { ...this.state, ...next } as S;
    this.state = Object.freeze(merged);
  }

  protected init(): void {}

  protected abstract render(): string;

  protected addEvents(): void {}
  protected removeEvents(): void {}

  protected componentDidMount(): void {}

  protected componentDidUpdate(
    _prevProps: Readonly<P>,
    _prevState: Readonly<S>
  ): void {}

  protected componentWillUnmount(): void {}

  protected shouldUpdate(
    _nextProps: Readonly<P>,
    _nextState: Readonly<S>
  ): boolean {
    return true;
  }

  
  protected patchDom(
    _prevProps: Readonly<P>,
    _prevState: Readonly<S>
  ): boolean {
    return false;
  }

  private _render(
    prevProps?: Readonly<P>,
    prevState?: Readonly<S>
  ): void {
    if (this._isDestroyed) return;

    if (this._isMounted) {
      this.removeEvents();
    }

    this.element.innerHTML = this.render();
    this.addEvents();

    if (!this._isMounted) {
      this._isMounted = true;
      this.componentDidMount();
    } else if (prevProps && prevState) {
      this.componentDidUpdate(prevProps, prevState);
    }
  }

  public getContent(): HTMLElement {
    return this.element;
  }


  public setProps(
    nextProps: Partial<P>,
    options?: UpdateOptions
  ): void {
    if (this._isDestroyed || !nextProps) return;

    const merged = { ...this.props, ...nextProps } as P;

    if (!this.shouldUpdate(merged, this.state)) return;

    const prevProps = this.props;
    const prevState = this.state;

    this.props = Object.freeze(merged);

    if (options?.partial && this._isMounted) {
      const patched = this.patchDom(prevProps, prevState);
      if (patched) {
        this.componentDidUpdate(prevProps, prevState);
        return;
      }
    }

    this._render(prevProps, prevState);
  }


  protected setState(
    next:
      | Partial<S>
      | ((prev: Readonly<S>) => Partial<S>),
    options?: UpdateOptions
  ): void {
    if (this._isDestroyed) return;

    const patch =
      typeof next === "function" ? next(this.state) : next;

    if (!patch || Object.keys(patch).length === 0) return;

    const merged = { ...this.state, ...patch } as S;

    if (!this.shouldUpdate(this.props, merged)) return;

    const prevProps = this.props;
    const prevState = this.state;

    this.state = Object.freeze(merged);

    if (options?.partial && this._isMounted) {
      const patched = this.patchDom(prevProps, prevState);
      if (patched) {
        this.componentDidUpdate(prevProps, prevState);
        return;
      }
    }

    this._render(prevProps, prevState);
  }

  public destroy(): void {
    if (this._isDestroyed) return;
    this._isDestroyed = true;

    this.removeEvents();
    this.componentWillUnmount();
    this.element.remove();
  }

  public show(): void {
    this.element.style.display = "";
  }

  public hide(): void {
    this.element.style.display = "none";
  }

  protected qs<T extends Element = HTMLElement>(
    selector: string
  ): T | null {
    return this.element.querySelector(selector) as T | null;
  }

  protected qsa<T extends Element = HTMLElement>(
    selector: string
  ): NodeListOf<T> {
    return this.element.querySelectorAll(selector) as NodeListOf<T>;
  }
}

