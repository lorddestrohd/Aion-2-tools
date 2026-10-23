$ErrorActionPreference = "Stop"

$projectRoot = $PSScriptRoot
$env:AION2CALC_HOME = Join-Path $projectRoot ".aion2calc-local"
$dataDirectory = Join-Path $env:AION2CALC_HOME "data"
$settingsPath = Join-Path $dataDirectory "ui.json"

if (-not (Test-Path -LiteralPath $settingsPath)) {
    New-Item -ItemType Directory -Path $dataDirectory -Force | Out-Null
    $settings = @{
        community_heartbeat = $false
        community_contribute_character = $false
        meter_auto_upload = $false
        meter_catch_up_uploads = $false
        meter_upload_per_fight = $false
        meter_upload_before_prune = $false
        meter_report_boss_kills = $false
        meter_report_enemy_hp = $false
        meter_report_diagnostics = $false
        meter_autostart = $false
        overlay_open_on_app_start = $false
    }
    $json = $settings | ConvertTo-Json
    [System.IO.File]::WriteAllText($settingsPath, $json, [System.Text.UTF8Encoding]::new($false))
}

Push-Location $projectRoot
try {
    python -m aion2calc app
}
finally {
    Pop-Location
}
