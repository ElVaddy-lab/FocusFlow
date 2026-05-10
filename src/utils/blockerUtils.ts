import type { BlockedSite } from "../types";

export function normalizeBlockedDomain(input: string): string | null {
  const trimmedInput = input.trim().toLowerCase();

  if (!trimmedInput) {
    return null;
  }

  const candidate = trimmedInput.includes("://")
    ? trimmedInput
    : `https://${trimmedInput}`;

  try {
    const parsedUrl = new URL(candidate);
    const domain = parsedUrl.hostname.replace(/^www\./, "");

    if (!/^[a-z0-9.-]+\.[a-z]{2,}$/.test(domain)) {
      return null;
    }

    return domain;
  } catch {
    return null;
  }
}

export function createBlockedSite(input: string): BlockedSite | null {
  const domain = normalizeBlockedDomain(input);

  if (!domain) {
    return null;
  }

  return {
    domain,
    id: domain
  };
}

export function createHostsEntries(blockedSites: BlockedSite[]): string {
  return blockedSites
    .flatMap((site) => [
      `0.0.0.0 ${site.domain}`,
      `0.0.0.0 www.${site.domain}`
    ])
    .join("\n");
}

export function createWindowsHostsScript(blockedSites: BlockedSite[]): string {
  const entries = createHostsEntries(blockedSites);

  if (!entries) {
    return "";
  }

  return [
    "$hostsPath = \"$env:SystemRoot\\System32\\drivers\\etc\\hosts\"",
    "$markerStart = \"# FocusFlow strict mode start\"",
    "$markerEnd = \"# FocusFlow strict mode end\"",
    "$entries = @\"",
    entries,
    "\"@",
    "$content = Get-Content -LiteralPath $hostsPath -Raw",
    "$pattern = \"(?ms)`r?`n?# FocusFlow strict mode start.*?# FocusFlow strict mode end`r?`n?\"",
    "$content = [regex]::Replace($content, $pattern, \"\")",
    "$block = \"`r`n$markerStart`r`n$entries`r`n$markerEnd`r`n\"",
    "Set-Content -LiteralPath $hostsPath -Value ($content.TrimEnd() + $block) -Encoding ASCII"
  ].join("\n");
}
