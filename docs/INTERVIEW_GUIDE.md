# Interview guide

## One-minute explanation

SentinelCore is an executable Zero Trust reference for a fictional 50-user organization. It turns identity principles into a computed posture dashboard, 30-control evidence register, 30-device inventory, 12 controlled simulation paths, Conditional Access artifacts, privileged-role rules, KQL detections, response playbooks, and a persisted local audit trail.

## Decisions I can explain

- Policies begin in report-only mode to reduce lockout risk.
- Break-glass accounts are excluded from normal controls but are separately monitored and reviewed.
- Privileged roles use eligible activation, approval, MFA, justification, and short activation windows.
- Detections focus on impossible travel, token replay signals, and privilege drift.
- The control validator catches duplicate identifiers, invalid states, weak elevation patterns, and missing detection content.
- The dashboard computes posture from the data register instead of embedding impressive-looking scores in the UI.

## Trade-offs

This is a reference implementation, not a claim that controls were deployed in a live tenant. Production rollout requires tenant-specific baselines, licensing review, staged deployment, named owners, alert tuning, and evidence from tabletop exercises.

## Interview demonstration

1. Explain the threat model and trust boundaries.
2. Walk through a report-only Conditional Access policy.
3. Show how privileged roles are time-bound.
4. Trace one KQL detection into the session-revocation playbook.
5. Record an authorized simulation run through the API and show its audit event.
6. Run the validators and discuss what they can and cannot prove.
