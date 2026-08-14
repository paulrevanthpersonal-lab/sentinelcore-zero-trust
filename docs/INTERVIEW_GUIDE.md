# Interview guide

## One-minute explanation

SentinelCore is an implementable Zero Trust reference for a 50-user organization. It turns identity principles into reviewable Conditional Access policies, privileged-role rules, KQL detections, incident playbooks, and an executive-friendly control dashboard.

## Decisions I can explain

- Policies begin in report-only mode to reduce lockout risk.
- Break-glass accounts are excluded from normal controls but are separately monitored and reviewed.
- Privileged roles use eligible activation, approval, MFA, justification, and short activation windows.
- Detections focus on impossible travel, token replay signals, and privilege drift.
- The control validator catches duplicate identifiers, invalid states, weak elevation patterns, and missing detection content.

## Trade-offs

This is a reference implementation, not a claim that controls were deployed in a live tenant. Production rollout requires tenant-specific baselines, licensing review, staged deployment, named owners, alert tuning, and evidence from tabletop exercises.

## Interview demonstration

1. Explain the threat model and trust boundaries.
2. Walk through a report-only Conditional Access policy.
3. Show how privileged roles are time-bound.
4. Trace one KQL detection into the session-revocation playbook.
5. Run the validator and discuss the checks it performs.
