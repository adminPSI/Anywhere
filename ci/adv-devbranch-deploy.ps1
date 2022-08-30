Write-Output "build folder structure"
robocopy c:\inetpub\wwwroot\dev\advbase $env:DEV_DEPLOY_PATH /e
Write-Output "customize connection file"
(Get-Content ($env:DEV_DEPLOY_PATH + "\webroot\session\Connections.js")) | ForEach-Object {$_.replace('changeServName', $env:DEV_SERVICE_PATH)} | Set-Content  ($env:DEV_DEPLOY_PATH + "\webroot\session\Connections.js")
# Set-Content -Path ($env:DEV_DEPLOY_PATH + "\webroot\session\Connections.js") -Value ('$.webServer = {};$.webServer.protocol = "https";$.webServer.address = "anyw-dev-ci.primarysolutions.net";$.webServer.port = "443";$.webServer.serviceName = "' + $env:DEV_SERVICE_PATH + '";$.webServer.anyerr = "http://anyerr.primarysolutions.net/Default.aspx";')
Write-Output "copy new build files"
robocopy "C:\anywhere\builder\Gargolye\bin" $env:DEV_DEPLOY_PATH\bin Anywhere.dll
robocopy "C:\anywhere\builder\Gargolye\webroot\dist" $env:DEV_DEPLOY_PATH\webroot\dist /e
robocopy "C:\anywhere\builder\Gargolye\webroot" $env:DEV_DEPLOY_PATH\webroot\ anywhere.html
robocopy "C:\anywhere\builder\Gargolye\webroot" $env:DEV_DEPLOY_PATH\webroot\ infalAnywhere.html
robocopy "C:\anywhere\builder\Gargolye\webroot" $env:DEV_DEPLOY_PATH\webroot\ infalLogin.html
robocopy "C:\anywhere\builder\Gargolye\webroot" $env:DEV_DEPLOY_PATH\webroot\ login.html
Write-Output "Create App in IIS"
New-WebApplication -Name $env:CI_ENVIRONMENT_SLUG -Site 'Dev' -PhysicalPath $env:DEV_DEPLOY_PATH -ApplicationPool Dev -Force
