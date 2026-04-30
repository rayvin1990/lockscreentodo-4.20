# MCP Website Integration

Date: 2026-04-29
Status: active

## Decision

Integrate Lockscreen MCP into the website as a developer-facing entry, not as the primary user-facing product flow.

## Rationale

Normal users should still see the simple generator workflow: describe tasks, generate a calm lockscreen wallpaper, scan or download. Agent and MCP language belongs on a developer page where builders can inspect endpoints, payloads, and the generator bridge.

## Implementation

- Added `/en/developers` as the public developer page.
- Added `Developers` to the home navigation and footer.
- Kept `/lockscreen-mcp` as a debug console link from the developer page.
- Added `/en/developers` and `/zh/developers` to public route matching.
- Added `/en/developers` to the sitemap.

## Future Guidance

Do not put raw MCP/debug-console language into the primary homepage headline. Homepage copy should describe user value first; developer pages can explain agent contracts and MCP tooling.
