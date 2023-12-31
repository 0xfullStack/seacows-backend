import EventEmitter from "events";

export const eventEmitter = new EventEmitter();

// events name
export const SUBSCRIBE_POOLS_EVENT = "subscribe_pools";
export const UNSUBSCRIBE_POOLS_EVENT = "unsubscribe_pools";

// pools updated

export const POOLS_UPDATED_EVENT = "pools_updated";
export const POOL_UPDATED_EVENT = "pool_updated";
