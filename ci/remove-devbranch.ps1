Remove-WebApplication -Site 'Dev' -Name $env:CI_ENVIRONMENT_SLUG
Remove-Item $env:DEV_DEPLOY_PATH -Recurse -Force