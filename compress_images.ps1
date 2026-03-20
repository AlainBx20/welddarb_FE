Add-Type -AssemblyName System.Drawing

$quality = 65
$encoder = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq 'image/jpeg' }
$params = New-Object System.Drawing.Imaging.EncoderParameters(1)
$params.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter([System.Drawing.Imaging.Encoder]::Quality, $quality)

$files = Get-ChildItem -Path "src\app\components\ressources" -Recurse -Include "*.JPG","*.jpg"

foreach ($f in $files) {
    $tmpPath = $f.FullName + ".tmp.jpg"
    try {
        $img = [System.Drawing.Image]::FromFile($f.FullName)
        $img.Save($tmpPath, $encoder, $params)
        $img.Dispose()
        Remove-Item $f.FullName -Force
        Rename-Item $tmpPath $f.FullName
        $sizeMB = [math]::Round((Get-Item $f.FullName).Length / 1MB, 2)
        Write-Host "✅ Compressed: $($f.Name) → $sizeMB MB"
    } catch {
        Write-Host "❌ Error on $($f.Name): $_"
        if (Test-Path $tmpPath) { Remove-Item $tmpPath -Force }
    }
}

Write-Host "`nDone! All images compressed."
