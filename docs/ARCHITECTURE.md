# Zero Trust Architecture

```mermaid
flowchart LR
  REVIEWER[Reviewer] --> API[Local Node control plane]
  API --> INVENTORY[30 controls and 30 devices]
  API --> AUDIT[Simulation audit ledger]
  USER[Modeled user] --> CA[Conditional Access]
  DEVICE[Device posture] --> CA
  RISK[Identity risk] --> CA
  CA --> APPS[Applications and data]
  CA --> BLOCK[Block or challenge]
  APPS --> TELEMETRY[Defender + Entra + Cloudflare telemetry]
  TELEMETRY --> SENTINEL[Microsoft Sentinel]
  SENTINEL --> DETECTIONS[KQL detections]
  DETECTIONS --> PLAYBOOKS[Response playbooks]
```

The design follows NIST SP 800-207 principles: no implicit trust based on network location, continuous evaluation, least privilege, explicit policy enforcement, and telemetry-driven improvement.

The local service exposes posture, control, device, and simulation endpoints. Posture is calculated from versioned evidence records rather than hard-coded dashboard labels. Reviewer sessions live in memory and authorized simulation executions are written to an ignored runtime file. The GitHub Pages build reads the immutable JSON directly and disables persistence honestly.

No route deploys or changes cloud controls. The policy, KQL, and playbook artifacts are reference inputs that require tenant-specific testing, approvals, licensing, and staged rollout before production use.
