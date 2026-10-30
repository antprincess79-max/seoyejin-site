@echo off
cd /d "%~dp0"
echo http://localhost:5173 에서 확인하세요. 종료: Ctrl+C
python -m http.server 5173
