# Add Windows Terminal profile for LLMReady

$settingsPath = "$env:LOCALAPPDATA\Packages\Microsoft.WindowsTerminal_8wekyb3d8bbwe\LocalState\settings.json"
$settings = Get-Content $settingsPath -Raw -Encoding UTF8 | ConvertFrom-Json

# Check if profile already exists
$existingProfile = $settings.profiles.list | Where-Object { $_.name -eq 'LLMReady' }
if ($existingProfile) {
    Write-Host 'Profile already exists'
    exit 0
}

# Create new profile
$newProfile = @{
    name = 'LLMReady'
    commandline = 'claude'
    startingDirectory = 'C:\Projects\LLMReady'
    tabTitle = "`u{2733} LLM"
    tabColor = '#10b981'
    guid = '{' + [guid]::NewGuid().ToString() + '}'
}

# Add to profiles list
$settings.profiles.list += $newProfile

# Save with UTF-8 NO BOM
$utf8NoBom = [System.Text.UTF8Encoding]::new($false)
$json = $settings | ConvertTo-Json -Depth 100
[System.IO.File]::WriteAllText($settingsPath, $json, $utf8NoBom)

Write-Host 'Profile added successfully'

# Create desktop shortcut
$WshShell = New-Object -ComObject WScript.Shell
$Shortcut = $WshShell.CreateShortcut("$env:USERPROFILE\OneDrive\Desktop\LLMReady.lnk")
$Shortcut.TargetPath = "$env:LOCALAPPDATA\Microsoft\WindowsApps\wt.exe"
$Shortcut.Arguments = '-p "LLMReady"'
$Shortcut.WorkingDirectory = "C:\Projects\LLMReady"
$Shortcut.Save()

Write-Host 'Desktop shortcut created'
