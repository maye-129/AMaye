Add-Type -AssemblyName System.Drawing

$inputPath = "c:\Users\ADMIN\Downloads\port\assets\images\logo_aml.png"
$outputPath = "c:\Users\ADMIN\Downloads\port\assets\images\logo_aml_transparent.png"

$img = [System.Drawing.Bitmap]::FromFile($inputPath)
$bmp = New-Object System.Drawing.Bitmap($img.Width, $img.Height)

for ($x = 0; $x -lt $img.Width; $x++) {
    for ($y = 0; $y -lt $img.Height; $y++) {
        $c = $img.GetPixel($x, $y)
        # White / light gray background -> 100% Transparent
        if ($c.R -gt 210 -and $c.G -gt 210 -and $c.B -gt 210) {
            $bmp.SetPixel($x, $y, [System.Drawing.Color]::FromArgb(0, 0, 0, 0))
        }
        # Black lines -> Convert to crisp bright White so it stands out against dark maroon/black theme
        elseif ($c.R -lt 70 -and $c.G -lt 70 -and $c.B -lt 70) {
            $bmp.SetPixel($x, $y, [System.Drawing.Color]::FromArgb(255, 255, 255, 255))
        }
        # Red accents -> Keep vibrant red
        else {
            $bmp.SetPixel($x, $y, [System.Drawing.Color]::FromArgb(255, 255, 42, 75))
        }
    }
}

$img.Dispose()
$bmp.Save($outputPath, [System.Drawing.Imaging.ImageFormat]::Png)
$bmp.Dispose()

Write-Host "Transparent logo generated at: $outputPath"
