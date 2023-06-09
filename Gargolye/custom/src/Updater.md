## Updating Customer Install Files for Anyhwere

1. **COPY** the bin folder, dist folder, the 3 OISP.rpt files (Anywhere\webroot\reportfiles), and all 4 html files (anywhere, login, infalAnywhere, infalLogin) into a new folder called UpdateFolder
2. **DELETE** PSIOSP.dll config and the PRIMARY_DODD_ISP_API_UAT.pfx from the bin inside newly created UpdateFolder
3. **RENAME** UpdateFolder to 2023.3_Upgrade
4. **ZIP** the now renamed UpdateFolder
5. **COPY** the zipped folder to c:\inetpub\wwwroot\updates.primarysolutions\apps\Anywhere

#### \*Possible changes to how the updates folder is setup before zipped basse off Josh's response
