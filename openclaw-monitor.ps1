# OpenCLAW Gateway Monitor Script
# Checks every 15 seconds, auto-restart on failure

$LOG_FILE = "$PSScriptRoot\logs\openclaw-monitor.log"
$PORT = 18789

if (!(Test-Path "$PSScriptRoot\logs")) {
    New-Item -ItemType Directory -Path "$PSScriptRoot\logs" -Force | Out-Null
}

function Test-GatewayOnline {
    $c = Get-NetTCPConnection -LocalPort $PORT -ErrorAction SilentlyContinue
    return ($c -and ($c.State -contains "Listen"))
}

function Write-Log {
    $msg = "[{0}] {1}" -f (Get-Date -Format "yyyy-MM-dd HH:mm:ss"), $args[0]
    Add-Content -Path $LOG_FILE -Value $msg
    Write-Host $msg
}

function Restart-Gateway {
    Write-Log "Gateway offline, stopping existing process..."
    Get-NetTCPConnection -LocalPort $PORT -ErrorAction SilentlyContinue | ForEach-Object {
        Stop-Process -Id $_.OwningProcess -Force -ErrorAction SilentlyContinue
    }
    Start-Sleep -Seconds 2

    Write-Log "Starting gateway..."
    Start-Process -FilePath "openclaw" -ArgumentList "gateway","start" -NoNewWindow
    Start-Sleep -Seconds 5
    return (Test-GatewayOnline)
}

Write-Log "=== Monitor Started ==="

while ($true) {
    if (Test-GatewayOnline) {
        Write-Log "[OK] Gateway online"
    } else {
        Write-Log "[WARN] Gateway offline, waiting..."
        Start-Sleep -Seconds 3
        if (!(Test-GatewayOnline)) {
            Write-Log "[DOWN] Gateway down! Attempting restart..."
            if (Restart-Gateway) {
                Write-Log "[OK] Gateway restarted successfully"
            } else {
                Write-Log "[ERROR] Restart failed - manual intervention required"
            }
        }
    }
    Start-Sleep -Seconds 15
}
