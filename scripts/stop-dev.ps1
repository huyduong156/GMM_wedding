$ErrorActionPreference = 'Stop'

$processes = @()

try {
  $processes = @(Get-CimInstance Win32_Process | Where-Object {
    $commandLine = $_.CommandLine
    $isViteDev = $commandLine -and $commandLine -match '(?i)(^|\s|\\)vite(\\|/|\.cmd|\.js|\s|$)'
    $isNextDev = $commandLine -and $commandLine -match '(?i)(^|\s|\\)next(\\|/|\.cmd|\.js|\s).*\bdev(\s|$)'
    $_.Name -eq 'node.exe' -and ($isViteDev -or $isNextDev)
  })
}
catch {
  Write-Warning "Could not inspect process command lines through CIM: $($_.Exception.Message)"
  Write-Warning 'Falling back to common local dev ports and stopping node.exe listeners only.'

  $devPorts = @()
  if ($env:STOP_DEV_PORTS) {
    $devPorts = @($env:STOP_DEV_PORTS -split ',' | ForEach-Object { $_.Trim() } | Where-Object { $_ })
  }
  else {
    $devPorts = @('3000', '5173')
  }

  $netstatOutput = @(& netstat.exe -ano -p tcp)
  $listenerIds = @(
    foreach ($line in $netstatOutput) {
      if ($line -notmatch 'LISTENING') {
        continue
      }

      $parts = @($line -split '\s+' | Where-Object { $_ })
      if ($parts.Length -lt 5) {
        continue
      }

      $localAddress = $parts[1]
      $processPid = $parts[4]
      foreach ($port in $devPorts) {
        if ($localAddress -match "[:.]$([regex]::Escape($port))$") {
          $processPid
        }
      }
    }
  ) | Sort-Object -Unique

  foreach ($processId in $listenerIds) {
    $nodeProcess = Get-Process -Id $processId -ErrorAction SilentlyContinue | Where-Object {
      $_.ProcessName -eq 'node'
    }
    if ($nodeProcess) {
      $processes += [pscustomobject]@{
        Name = "$($nodeProcess.ProcessName).exe"
        ProcessId = $nodeProcess.Id
        CommandLine = "node listener on port(s) $($devPorts -join ',')"
      }
    }
  }
}

foreach ($process in $processes) {
  Write-Host "Stopping $($process.Name) PID $($process.ProcessId): $($process.CommandLine)"
  & taskkill.exe /PID $process.ProcessId /T /F | Out-Host
  if ($LASTEXITCODE -ne 0) {
    throw "Failed to stop development process PID $($process.ProcessId)."
  }
}

# Vite can leave an esbuild child alive after its parent exits. esbuild is a
# short-lived local dev helper and must be stopped before npm replaces it.
$orphanedBuildProcesses = Get-Process -Name esbuild -ErrorAction SilentlyContinue | Where-Object {
  $_.Path -and $_.Path -match '(?i)[\\/]node_modules[\\/]@?esbuild[\\/]'
}

foreach ($process in $orphanedBuildProcesses) {
  Write-Host "Stopping orphaned esbuild PID $($process.Id): $($process.Path)"
  Stop-Process -Id $process.Id -Force
}

if (-not $processes -and -not $orphanedBuildProcesses) {
  Write-Host 'No local Vite/Next development process found.'
}
