# Secret scanning with Gitleaks

The app repo uses Gitleaks' default detector set plus a small custom rule for credential-like assignments to `VITE_*` variables. Vite exposes those values to browser code, so they must contain public configuration only, never credentials.

## Enable the pre-commit hook

Install `pre-commit` if it is not already available, then install the repository hook:

```sh
pre-commit install
```

The hook runs Gitleaks against staged changes before each commit. The pinned hook version is recorded in `.pre-commit-config.yaml`.

## Run a working-tree scan

Use the checked-in config and redact any detected values from output:

```sh
gitleaks dir --config .gitleaks.toml --redact .
```

To scan Git history as well as current files:

```sh
gitleaks git --config .gitleaks.toml --redact .
```

Review a finding locally without pasting the detected value into issues, chat, CI logs, or source control. Do not add broad allowlists for real credentials; investigate a match and allowlist only a confirmed non-secret false positive with a narrow path or rule exception.
