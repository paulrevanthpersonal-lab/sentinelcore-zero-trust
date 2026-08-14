# Control Matrix

The complete machine-readable register is `data/security.json`: exactly 30 records, six per Zero Trust pillar. Every record contains a stable ID, owner, evidence expectation, coverage percentage, and one of these explicit reference statuses:

| Status | Meaning in this repository |
|---|---|
| `enforced` | The modeled organization expects the control to make an access decision; related policy or configuration evidence is included or named. |
| `validated` | A controlled simulation reached the expected result and the evidence path is documented. |
| `partial` | Coverage gaps remain in the model and are visible in the posture calculation. |

These labels describe the portfolio model, not a live tenant. Production evidence must come from authorized tenant exports, approvals, sign-in results, endpoint inventory, monitoring rules, and recovery tests.

| Pillar | Records | Representative evidence |
|---|---:|---|
| Identity | 6 | Conditional Access results, registration coverage, PIM audits |
| Device | 6 | Compliance inventory, encryption, EDR health, patch baseline |
| Network | 6 | ZTNA inventory, flow denials, private endpoints, retained logs |
| Application | 6 | Proxy decisions, token policy, supply-chain scans, session logs |
| Data | 6 | Labels, DLP tests, encryption, access reviews, restore evidence |
