@echo off
cd /d "%~dp0"
title Restful Booker — API Test Runner

echo ================================================
echo   API Test Suite — Restful Booker
echo ================================================
echo.
echo   [1] Run tests
echo   [2] Run tests + open Allure report
echo.
set /p choice="Enter choice (1-2): "

if "%choice%"=="1" (
    echo.
    echo Running API tests...
    call npm run test:api
) else if "%choice%"=="2" (
    echo.
    echo Running API tests with Allure report...
    call npm run test:api:allure
) else (
    echo Invalid choice. Running API tests...
    call npm run test:api
)

echo.
echo ================================================
echo   Done!
echo ================================================
pause
