# Zero Trust Architecture

```mermaid
flowchart LR
  USER[User] --> CA[Conditional Access]
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

