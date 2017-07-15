SET EX="C:\Program Files\IIS Express\iisexpress.exe"
if not "%1" == "" (
CALL %EX% /path:%CD% /port:%1
) else (
CALL %EX% /path:"%CD%"
)
