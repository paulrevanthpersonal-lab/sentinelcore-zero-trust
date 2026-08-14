# API contract

## Session

- `POST /api/auth/login` validates the documented reviewer credentials and returns an in-memory bearer token.

## Evidence

- `GET /api/posture` calculates counts, coverage, device compliance, simulation results, and five pillar scores.
- `GET /api/controls` returns the 30-control register and accepts `pillar`, `status`, and `search` filters.
- `GET /api/devices` returns the 30-device inventory and accepts `compliance`, `risk`, and `search` filters.
- `GET /api/simulations` returns the 12 authorized scenarios and recorded local audit events.
- `POST /api/simulations` validates a simulation ID and persists an operator audit event.

Reviewer tokens are process-local and audit events are written to ignored `data/runtime.json`. This is not a replacement for enterprise identity, a SIEM, or immutable production audit storage.
