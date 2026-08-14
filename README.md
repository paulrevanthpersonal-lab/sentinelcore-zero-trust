# SentinelCore Zero Trust Control Plane

> Executable identity-first Zero Trust control plane with 30 mapped controls, 30 endpoint records, 12 authorized simulations, policy-as-code, detection engineering, and response playbooks for a fictional 50-user SME.

**[Open the live security cockpit](https://paulrevanthpersonal-lab.github.io/sentinelcore-zero-trust/)**

![SentinelCore security cockpit](docs/screenshots/security-cockpit.png)

The terminal-style reviewer login creates a local bearer session when the Node service is running and falls back to a clearly labeled static review session on GitHub Pages.

![SentinelCore demo login](docs/screenshots/login-terminal.png)

## 1. Overview

SentinelCore is an executable reference implementation aligned with NIST SP 800-207. It connects a local posture API and evidence registry with Entra ID Conditional Access artifacts, least-privilege RBAC, Defender and Sentinel telemetry models, KQL detections, and identity-response playbooks.

## 2. Security objective

The repository demonstrates how a small organization can replace network-based trust with explicit decisions based on identity, device, risk, application sensitivity, and session context.

## 3. Scope and status

This is a portfolio reference architecture and authorized control simulation. The dashboard, local authentication API, 30-control register, 30-device inventory, simulation ledger, audit persistence, policy documents, KQL rules, validator, and response playbooks are implemented as code. No production tenant is modified.

## 4. Security cockpit

The multi-view dashboard computes posture from 30 controls across five NIST-aligned pillars, reports 30 modeled endpoints, exposes 12/12 authorized simulation paths, and lets a reviewer persist validation runs through the local API. The organization, telemetry, compliance, cost, and ROI figures are modeled inputs—not production measurements.

![SentinelCore mobile view](docs/screenshots/security-mobile.png)

## 5. Architecture

Review [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) for the policy, enforcement, telemetry, detection, and response flow.

Run the executable control plane with `npm start`, then open `http://localhost:4230/dashboard/`. The static GitHub Pages review remains available without persistence.

## 6. Zero Trust principles

- Verify explicitly using identity, device, location, risk, and resource context
- Use least privilege and time-bound elevation
- Assume breach and preserve investigation evidence
- Continuously evaluate sessions and revoke when risk changes
- Measure control coverage rather than assuming deployment equals protection

## 7. Conditional Access policy set

[`policies/conditional-access.json`](policies/conditional-access.json) contains administrator MFA, legacy-authentication blocking, risk-based challenges, and compliant-device controls. Every non-block policy includes emergency-access exclusions.

## 8. Privileged access model

[`policies/rbac-matrix.json`](policies/rbac-matrix.json) demonstrates narrow scopes, eligible role activation, and approvals for privileged access.

## 9. Detection engineering

The `detections/` directory contains KQL for impossible travel, token-replay indicators, and privileged-role drift. Each rule is intended to be tuned against authorized tenant telemetry before deployment.

## 10. Incident response

The [session-revocation playbook](playbooks/session-revocation.md) covers validation, containment, identity recovery, persistence review, clean sign-in verification, and stakeholder communication.

## 11. Threat model

Review [docs/THREAT_MODEL.md](docs/THREAT_MODEL.md) for assets, threats, trust boundaries, and required security properties.

## 12. Control and device evidence

`data/security.json` contains 30 controls, 30 devices, and 12 simulations. The [control matrix](docs/CONTROL_MATRIX.md) explains the implementation-status language and evidence standard; the [API reference](docs/API.md) documents filters and audit persistence.

## 13. Automated validation

```bash
python3 scripts/validate_controls.py
npm run check
npm test
```

Validation checks unique policy IDs, allowed states, emergency exclusions, approved eligible privilege, substantive detection coverage, exact data depth, local authentication, posture computation, filters, and simulation audit persistence.

## 14. Automated screenshots

```bash
bash scripts/capture_screenshots.sh
```

Headless Chrome regenerates desktop and mobile images in `docs/screenshots/`.

## 15. Continuous integration

GitHub Actions validates JSON, control relationships, KQL coverage, JavaScript syntax, API behavior, Python execution, and Bash syntax on each push and pull request.

## 16. Interview discussion points

- Why two emergency accounts are excluded and heavily monitored
- Difference between authentication strength and authorization scope
- How report-only Conditional Access reduces deployment risk
- When session revocation is appropriate and what must be verified afterward
- How a detection becomes a reliable operational decision

## 17. Roadmap

- Add Terraform modules for a disposable Azure security lab
- Add Microsoft Graph import adapters for authorized tenant exports
- Map controls to CIS Microsoft 365 and Azure benchmarks
- Add signed detection fixtures and expected alert outcomes
- Add a tabletop exercise with a complete incident timeline

## 18. License

Released under the [MIT License](LICENSE).
