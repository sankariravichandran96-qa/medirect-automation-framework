@echo off
cd /d "%~dp0"
title Restful Booker — Test Runner

echo ================================================
echo   Restful Booker Test Suite
echo ================================================
echo.
echo   Select which tests to run:
echo.
echo   [1] API Tests only
echo   [2] UI Tests only
echo   [3] All Tests (API + UI)
echo.
set /p choice="Enter choice (1-3): "

if "%choice%"=="1" (
    echo Running API Tests...
    call npm run test:api
) else if "%choice%"=="2" (
    echo Running UI Tests...
    call npm run test:ui
) else if "%choice%"=="3" (
    echo Running All Tests...
    call npm run test:all
) else (
    echo Invalid choice. Running All Tests by default...
    call npm run test:all
)

echo.
echo Generating Allure Report...
call npx allure generate allure-results --clean -o allure-report
call npx allure open allure-report

echo.
echo ================================================
echo   Done!
echo ================================================
pause