@echo off
REM Check if an input file is provided
if "%~1"=="" (
    echo Usage: run_bash_script.bat input.wav
    exit /b 1
)

REM Set input audio file
set input_audio=%~1

REM Create output filename by replacing .wav with .mp4
set output_file=%input_audio:.wav=.mp4%

REM Call the Bash script, passing the input audio file and the generated output file name
bash convert_wav_image_to_mp4.sh %input_audio% %output_file%