Add-Type -AssemblyName System.Drawing
$src = [System.Drawing.Bitmap]::new('C:\source\timesheets\assets\images\Company Logo Revised.png')
$rect = [System.Drawing.Rectangle]::new(193, 288, 1083, 376)
$cropped = $src.Clone($rect, $src.PixelFormat)
$src.Dispose()
$cropped.Save('C:\source\timesheets\assets\images\Company Logo Revised.png', [System.Drawing.Imaging.ImageFormat]::Png)
$cropped.Dispose()
Write-Host "Done - cropped to 1083x376"
