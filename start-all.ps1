$env:JAVA_HOME = "C:\Users\benja\.jdks\ms-21.0.11"
$env:Path = "$env:JAVA_HOME\bin;$env:Path"
$base = "C:\Users\benja\Downloads\Gymweb-v2"

$services = @(
    @{ name="ms-usuarios";       dir="ms-usuarios";       port=8081 },
    @{ name="ms-asistencia";     dir="ms-asistencia";     port=8082 },
    @{ name="ms-suscripciones";  dir="ms-suscripciones";  port=8083 },
    @{ name="ms-pagos";          dir="ms-pagos";          port=8084 },
    @{ name="ms-gateway";        dir="ms-gateway";        port=8080 }
)

foreach ($svc in $services) {
    $dir = Join-Path $base $svc.dir
    Write-Host "Starting $($svc.name) on port $($svc.port)..."
    Start-Process -FilePath "cmd.exe" `
        -ArgumentList "/c", "cd /d `"$dir`" && set JAVA_HOME=C:\Users\benja\.jdks\ms-21.0.11 && .\mvnw.cmd spring-boot:run" `
        -WindowStyle Minimized
}

Write-Host ""
Write-Host "All 5 services launching. Wait ~60s then check ports."
Start-Sleep -Seconds 60

foreach ($svc in $services) {
    $r = Test-NetConnection -ComputerName localhost -Port $svc.port -WarningAction SilentlyContinue
    $status = if ($r.TcpTestSucceeded) { "UP" } else { "DOWN" }
    Write-Host "  $($svc.name) port $($svc.port) - $status"
}
