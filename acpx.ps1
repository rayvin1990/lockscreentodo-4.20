#!/usr/bin/env pwsh
$env:ACPX_STATE_DIR = "C:\Users\57684\saasfly\tmp\acpx-state"
& node "C:\Users\57684\saasfly\vendor\acpx\dist\cli.js" $args
exit $LASTEXITCODE
