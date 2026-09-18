# ivory-bridge-dispatcher

**ivory-bridge-dispatcher** is a deterministic message-dispatch engine for bridging event producers to asynchronous consumers. It buffers messages, applies idempotency and rate-limit policies, performs atomic outbox commits, and schedules delivery with a bounded priority queue.

## Overview & Problem Statement

Event-driven systems commonly lose work when a producer commits business state but crashes before publishing an event. They also encounter duplicate deliveries, bursts that overwhelm consumers, ordering conflicts, and silent failures from transient network errors.

ivory-bridge-dispatcher addresses these constraints by combining an append-only outbox with a bounded scheduling queue. The producer commits its domain record and event in one transaction. A dispatcher then acknowledges completed work and releases reserved capacity, allowing safe retries without requiring producers to implement delivery logic themselves.

## Core Architecture & Highlights

- **Transactional outbox:** Producers append an event and its durable state in the same database transaction.
- **Deterministic scheduling:** Messages are ordered by `readyAt`, priority, and `sequence`, with stable tie-breaking for repeatable behavior.
- **Idempotency:** The optional key normalizes producer, channel, and event identity so retries do not create duplicate work.
- **Rate limiting:** A configurable per-channel token bucket controls burst size and steady-state throughput.
- **Retry policy:** Exponential backoff, jitter, and bounded attempts protect downstream systems from cascading failures.
- **Bounded memory:** The scheduler accepts at most `queueLimit` pending messages and rejects excess work instead of growing without limit.
- **Atomic claim:** `claimBatch` reserves a batch in one operation, preventing multiple workers from processing the same message.
- **Safe acknowledgement:** `acknowledge` marks only claimed messages complete and releases reserved tokens.
- **Deterministic helper:** `selectNextMessage` selects the next eligible message without network or timer dependencies.

## Installation

```bash
npm install ivory-bridge-dispatcher
```

## Quick Start

```js
import { createDispatcher } from 'ivory-bridge-dispatcher';

const outbox = createOutbox(); // implement with your database driver
const transport = createTransport(); // implement with your broker driver

const dispatcher = createDispatcher({
  outbox,
  transport,
  channel: 'orders',
  queueLimit: 10000,
  maxRetries: 5,
  batchSize: 25,
  rateLimit: { burst: 100, refillPerSecond: 500 },
});

await dispatcher.start();

await outbox.enqueue({
  producer: 'checkout',
  event: 'OrderCreated',
  payload: { orderId: 'ord-123' },
  idempotencyKey: 'checkout:OrderCreated:ord-123',
  readyAt: Date.now(),
});

// Stop cleanly after draining or when your process is shutting down.
await dispatcher.stop();
```

A minimal outbox implementation should expose `enqueue`, `claimBatch`, `acknowledge`, and `retry` methods. A transport implementation should expose `publish` and `close` methods. The dispatcher treats a transport error as a retryable failure unless the error is classified as terminal.

## Configuration / Options

| Option | Type | Default | Purpose |
| --- | --- | --- | --- |
| `outbox` | object | required | Transactional message store adapter. |
| `transport` | object | required | Broker publish adapter. |
| `channel` | string | required | Logical delivery channel used for rate limits and idempotency. |
| `queueLimit` | integer | `10000` | Maximum pending messages retained in memory. |
| `batchSize` | integer | `25` | Maximum messages claimed per scheduling pass. |
| `maxRetries` | integer | `5` | Maximum retry attempts after the initial delivery. |
| `backoffBaseMs` | number | `250` | Initial retry delay. |
| `backoffMultiplier` | number | `2` | Multiplier applied to each retry delay. |
| `jitterRatio` | number | `0.2` | Random delay fraction in the range 0 through 1. |
| `rateLimit` | object | `null` | Optional per-channel token-bucket limits. |
| `claimTimeoutMs` | number | `30000` | Maximum time a worker may hold a claim before retry. |
| `idleDelayMs` | number | `50` | Delay between scheduling passes when no message is ready. |

All numeric options are validated on construction. Invalid values throw a `TypeError` or `RangeError`; the dispatcher does not silently coerce configuration errors.

## Performance & Design Constraints

The scheduling loop is `O(n)` per pass, where `n` is the number of pending messages. The bounded queue prevents unbounded memory growth, while the claim operation keeps worker coordination in the transaction boundary. Delivery latency depends primarily on database commit latency, broker availability, and the configured rate limit.

The implementation is intentionally dependency-light and uses only standard JavaScript primitives. It does not provide a built-in database driver, HTTP client, or broker client; those boundaries are adapters so the scheduler remains testable and portable. The helper algorithm is deterministic for a fixed input array and clock value. Runtime jitter is applied only by the dispatcher retry policy, never by `selectNextMessage`.

## License

MIT License © 2026 Juwan Schmidt (@haileyrenton)

See the [LICENSE](./LICENSE) file for the complete license text.