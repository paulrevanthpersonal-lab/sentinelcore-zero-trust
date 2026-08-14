# Suspicious Session Revocation

## Trigger
Validated evidence of token theft, impossible travel, malicious sign-in, or compromised credentials.

## Workflow
1. Validate the user, sign-in, IP, device, application, and business context.
2. Preserve sign-in, audit, endpoint, and alert evidence.
3. Revoke refresh tokens and block sign-in when containment is approved.
4. Reset credentials and require MFA re-registration when identity compromise is likely.
5. Review enterprise applications, inbox rules, registered devices, role assignments, and persistence.
6. Restore access only after clean authentication is verified.
7. Communicate the recovery decision and create follow-up actions.

## Safety
Do not execute containment against production identities without authorization and an available recovery path.

