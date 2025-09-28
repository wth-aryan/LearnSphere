@echo off
echo Starting Cloud File Sharing System...
echo.

echo Installing backend dependencies...
call npm install
if %errorlevel% neq 0 (
    echo Error installing backend dependencies
    pause
    exit /b 1
)

echo.
echo Installing frontend dependencies...
cd client
call npm install
if %errorlevel% neq 0 (
    echo Error installing frontend dependencies
    pause
    exit /b 1
)

echo.
echo Starting the application...
echo Backend will run on http://localhost:5000
echo Frontend will run on http://localhost:3000
echo.

cd ..
start "Backend Server" cmd /k "npm run dev"
timeout /t 3 /nobreak > nul
cd client
start "Frontend Server" cmd /k "npm start"

echo.
echo Application started successfully!
echo Please wait for both servers to start up.
echo.
pause
