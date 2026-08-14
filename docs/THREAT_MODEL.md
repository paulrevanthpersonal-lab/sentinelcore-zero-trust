# Threat Model

## Assets
User identities, privileged roles, tokens, business applications, endpoint posture, audit logs, and recovery accounts.

## Priority threats
- Credential phishing and password spraying
- Token theft and replay
- Legacy authentication bypass
- Excessive or persistent privilege
- Unmanaged-device access to sensitive data
- Detection or logging gaps

## Trust boundaries
Identity provider, device-management platform, policy engine, cloud applications, security telemetry, SOC workflow, and third-party access proxy.

## Security properties
Access is explicitly evaluated; privileged elevation is time-bound; emergency access is monitored; sessions can be revoked; security evidence supports containment and verified recovery.

