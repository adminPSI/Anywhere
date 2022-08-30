Write-Output "Copy Build dependencies and install Node dependencies"
robocopy "C:\gitlab-runner\builds\anywhereProj\Gargolye\service" C:\anywhere\builder\Gargolye\service /e
robocopy "C:\gitlab-runner\builds\anywhereProj\Gargolye\webroot\WebViewer" C:\anywhere\builder\Gargolye\webroot\WebViewer /e
robocopy "C:\gitlab-runner\builds\anywhereProj\Gargolye" C:\anywhere\builder\Gargolye Blue.sln
robocopy "C:\gitlab-runner\builds\anywhereProj\Gargolye" C:\anywhere\builder\Gargolye Blue.csproj
Write-Output "Install node dependencies"
robocopy "C:\gitlab-runner\builds\anywhereProj\Gargolye\custom" C:\anywhere\builder\Gargolye\custom /e
robocopy "C:\gitlab-runner\builds\anywhereProj\Gargolye\custom\src" C:\anywhere\builder\Gargolye\custom\src /mir
Start-Sleep -s 5
Set-Location C:\anywhere\builder\Gargolye\custom
npm install
# Write-Output "Build SLN"
# msbuild.exe C:\anywhere\builder\Gargolye\Blue.sln
Write-Output "Build JS HTML SCSS"
npm run build
Start-Sleep -s 10

