import { EventBus } from "./eventBus";
import type { EventMap } from "./eventMap";

export const bus = new EventBus<EventMap>();

