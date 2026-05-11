@echo off
cd /d "%~dp0"
title MeDirect — UI Test Runner

echo ================================================
echo   UI Test Suite — MeDirect Equities
echo ================================================
echo.
echo   [1] Run tests (headless)
echo   [2] Run tests (headed — browser visible)
echo   [3] Run tests + open Allure report
echo.
set /p choice="Enter choice (1-3): "

if "%choice%"=="1" (
    echo.
    echo Running UI tests headless...
    call npm run test:ui
) else if "%choice%"=="2" (
    echo.
    echo Running UI tests in browser...
    call npm run test:ui:headed
) else if "%choice%"=="3" (
    echo.
    echo Running UI tests with Allure report...
    call npm run test:ui:allure
) else (
    echo Invalid choice. Running UI tests headless...
    call npm run test:ui
)

echo.
echo ================================================
echo   Done!
echo ================================================
pause
