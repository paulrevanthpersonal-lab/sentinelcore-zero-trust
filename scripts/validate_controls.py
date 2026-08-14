from __future__ import annotations

import json
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]


def load(path: str) -> dict:
    return json.loads((ROOT / path).read_text())


def validate() -> list[str]:
    errors: list[str] = []
    policies = load("policies/conditional-access.json")["policies"]
    ids = [policy["id"] for policy in policies]
    if len(ids) != len(set(ids)):
        errors.append("Conditional Access policy IDs must be unique")
    for policy in policies:
        if policy["state"] not in {"enabled", "report-only", "disabled"}:
            errors.append(f"{policy['id']} has an invalid state")
        if "block" not in policy["grant"] and not policy.get("exclusions"):
            errors.append(f"{policy['id']} needs documented emergency exclusions")
    roles = load("policies/rbac-matrix.json")["roles"]
    if not any(role["mode"] == "eligible" and role["approval"] for role in roles):
        errors.append("At least one privileged role must use eligible, approved elevation")
    detections = list((ROOT / "detections").glob("*.kql"))
    if len(detections) < 3:
        errors.append("At least three detection rules are required")
    for rule in detections:
        content = rule.read_text()
        if "|" not in content or len(content.splitlines()) < 3:
            errors.append(f"{rule.name} does not contain a substantive KQL pipeline")
    return errors


if __name__ == "__main__":
    problems = validate()
    if problems:
        print("\n".join(f"ERROR: {problem}" for problem in problems))
        raise SystemExit(1)
    print("Control validation passed")

