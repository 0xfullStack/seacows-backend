import { Server as HttpServer } from "node:http";
import { createAdapter } from "@socket.io/redis-adapter";
import { Server, Socket } from "socket.io";
import { type Redis } from "ioredis";
import { validateChain } from "src/env";
import logger from "src/utils/logger";
import { eventEmitter, POOL_UPDATED_EVENT, SUBSCRIBE_POOLS_EVENT, UNSUBSCRIBE_POOLS_EVENT } from "src/utils/events";
import { getChainAddress } from "src/utils/address";

export function initWs(server: HttpServer, redis: Redis) {
  const io = new Server(server);
  const pubClient = redis.duplicate();
  const subClient = pubClient.duplicate();
  io.adapter(createAdapter(pubClient, subClient));
  io.on("connection", (socket: Socket) => {
    logger.debug(`${socket.id} connected`);

    socket.on("disconnect", () => {
      logger.debug(`${socket.id} disconnect`);
    });

    socket.on("subscribe_pools", (chain: string, pools: string[]) => {
      if (!Array.isArray(pools) || !pools.length) {
        socket.emit("error", "invalid pools");
        return;
      }
      if (!validateChain(chain)) {
        socket.emit("error", "invalid chain");
        return;
      }
      const rooms = pools.map((pool) => getChainAddress(chain, pool));
      socket.join(rooms);
      eventEmitter.emit(SUBSCRIBE_POOLS_EVENT, chain, pools);
    });

    socket.on("unsubscribe_pools", (chain: string, pools: string[]) => {
      if (!Array.isArray(pools) || !pools.length) {
        socket.emit("error", "invalid pools");
        return;
      }
      if (!validateChain(chain)) {
        socket.emit("error", "invalid chain");
        return;
      }
      pools.forEach((pool) => socket.leave(getChainAddress(chain, pool)));
      eventEmitter.emit(UNSUBSCRIBE_POOLS_EVENT, chain, pools);
    });
  });
  initWsHandles(io);
  return io;
}

/**
 * push data to the client
 * @param io
 */
async function initWsHandles(io: Server) {
  eventEmitter.on(POOL_UPDATED_EVENT, function (chain: string, id: string, pool: any) {
    const room = getChainAddress(chain, id);
    io.to(room).emit("pool_updated", chain, pool);
  });
}
