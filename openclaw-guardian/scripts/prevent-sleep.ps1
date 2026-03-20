
# Prevent system sleep, allow display to turn off
Add-Type -Namespace Win32 -Name NativeMethods -MemberDefinition @"
[DllImport("kernel32.dll", ExactSpelling = true, SetLastError = true)]
public static extern uint SetThreadExecutionState(uint esFlags);
"@

# Set continuous execution state to prevent sleep
[Win32.NativeMethods]::SetThreadExecutionState(0x80000001) | Out-Null
