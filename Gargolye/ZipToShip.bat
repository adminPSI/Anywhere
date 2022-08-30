C:\"Program Files"\7-Zip\7z.exe a -tzip gargolye.zip ./Gargolye/webroot ./Gargolye/service ./Gargolye/bin -xr!*.cs -xr!*.pdb -xr!x64 -xr!x86 -xr!App_Data -xr!obj -xr!Properties -x!*.* -xr!.svn
Copy gargolye.zip Z:\Unstable\%1
Z:
cd Z:\Unstable\Advisor
C:\"Program Files"\7-Zip\7z.exe x gargolye.zip -y
DEL gargolye.zip
C: 
DEL gargolye.zip