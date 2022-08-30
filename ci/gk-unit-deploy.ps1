Write-Output "Copy DLL"
# robocopy "C:\anywhere\builder\Gargolye\bin" C:\inetpub\wwwroot\TESTING\gk-unit-test\bin Anywhere.dll
Write-Output "Copy Dist"
robocopy "C:\anywhere\builder\Gargolye\webroot\dist" C:\inetpub\wwwroot\TESTING\gk-unit-test\webroot\dist /e
robocopy "C:\anywhere\builder\Gargolye\webroot\WebViewer" C:\inetpub\wwwroot\TESTING\gk-unit-test\webroot\WebViewer /e
Write-Output "Copy HTML"
robocopy "C:\anywhere\builder\Gargolye\webroot" C:\inetpub\wwwroot\TESTING\gk-unit-test\webroot\ anywhere.html
robocopy "C:\anywhere\builder\Gargolye\webroot" C:\inetpub\wwwroot\TESTING\gk-unit-test\webroot\ infalAnywhere.html
robocopy "C:\anywhere\builder\Gargolye\webroot" C:\inetpub\wwwroot\TESTING\gk-unit-test\webroot\ infalLogin.html
robocopy "C:\anywhere\builder\Gargolye\webroot" C:\inetpub\wwwroot\TESTING\gk-unit-test\webroot\ login.html