# Websocket api

```js
const { io } = require("socket.io-client");
const socket = io(your_endpoint);
socket.on("connect", function () {
  socket.emit("subscribe_pools", ["0x1fb9e81634eaae1debbc2f23e08a9da64f7ffa52"]);
});
```

## subscribe pools

When the pool is updated, the latest information will be pushed to the client.

### Request

```js
socket.emit("subscribe_pools", "sepolia", ["0x1fb9e81634eaae1debbc2f23e08a9da64f7ffa52"]);
```

### Response

```js
socket.on('pool_updated', function (chain, pool) {
  console.log('pool_updated', chain, pool);
});
// data
{
  "id": "0x27ee72822d2e8de66d1d384f8e268236c61d8d7f",
  "timestamp": "1703066088",
  "liquidity": "632455532033675866",
  "price": "0.001384083044982699",
  "totalValueLocked": "0.047058823529411766",
  "totalFee": "0.00176470588235294117",
  "poolWeekData": [
    {
      "price": "0.001384083044982699",
      "priceChange": "0",
      "volume": "0.176470588235294117",
      "week": 1702512000
    }
  ],
  "poolDayData": [
    { "price": "0.1", "priceChange": "0", "volume": "0", "date": 1702512000 },
    {
      "price": "0.001384083044982699",
      "priceChange": "-98.615916955017301",
      "volume": "0.176470588235294117",
      "date": 1703030400
    }
  ],
  "collection": {
    "name": "MutantApeYachtClub-SC-1122",
    "id": "0x68480d7bb3fcba8d9e338e7c32c604ff40d5b38b"
  },
  "token": {
    "id": "0xfff9976782d46cc05630d1f6ebab18b2324d6b14",
    "name": "Wrapped Ether"
  },
  "nfts": [
    { "id": "0x68480d7bb3fcba8d9e338e7c32c604ff40d5b38b-10", "tokenId": "10" },
    { "id": "0x68480d7bb3fcba8d9e338e7c32c604ff40d5b38b-13", "tokenId": "13" },
    { "id": "0x68480d7bb3fcba8d9e338e7c32c604ff40d5b38b-16", "tokenId": "16" },
    { "id": "0x68480d7bb3fcba8d9e338e7c32c604ff40d5b38b-17", "tokenId": "17" },
    { "id": "0x68480d7bb3fcba8d9e338e7c32c604ff40d5b38b-18", "tokenId": "18" },
    { "id": "0x68480d7bb3fcba8d9e338e7c32c604ff40d5b38b-19", "tokenId": "19" },
    { "id": "0x68480d7bb3fcba8d9e338e7c32c604ff40d5b38b-20", "tokenId": "20" },
    { "id": "0x68480d7bb3fcba8d9e338e7c32c604ff40d5b38b-21", "tokenId": "21" },
    { "id": "0x68480d7bb3fcba8d9e338e7c32c604ff40d5b38b-26", "tokenId": "26" },
    { "id": "0x68480d7bb3fcba8d9e338e7c32c604ff40d5b38b-27", "tokenId": "27" },
    { "id": "0x68480d7bb3fcba8d9e338e7c32c604ff40d5b38b-28", "tokenId": "28" },
    { "id": "0x68480d7bb3fcba8d9e338e7c32c604ff40d5b38b-29", "tokenId": "29" },
    { "id": "0x68480d7bb3fcba8d9e338e7c32c604ff40d5b38b-30", "tokenId": "30" },
    { "id": "0x68480d7bb3fcba8d9e338e7c32c604ff40d5b38b-6", "tokenId": "6" },
    { "id": "0x68480d7bb3fcba8d9e338e7c32c604ff40d5b38b-7", "tokenId": "7" },
    { "id": "0x68480d7bb3fcba8d9e338e7c32c604ff40d5b38b-8", "tokenId": "8" },
    { "id": "0x68480d7bb3fcba8d9e338e7c32c604ff40d5b38b-9", "tokenId": "9" }
  ]
}
```
