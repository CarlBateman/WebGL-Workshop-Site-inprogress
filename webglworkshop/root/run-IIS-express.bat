SET EX="C:\Program Files\IIS Express\iisexpress.exe"
CALL %EX% /config:%CD%/config.config
if not "%1" == "" (
CALL %EX% /path:%CD% /port:%1
start "http://localhost:"%1
) else (
start "" localhost:8080
CALL %EX% /path:%CD%
)
