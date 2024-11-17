#!/bin/bash

# Check if input audio file is provided
if [ -z "$1" ]; then
  echo "Usage: $0 input.wav [output.mp4]"
  exit 1
fi

input_audio="$1"
default_image="black.png"  # Default image to use
output_file="${2:-output.mp4}"  # Default to output.mp4 if not provided

eaf_file="${input_audio%.wav}.eaf"
csv_file="${input_audio%.wav}.csv"
python3 aaoh_tierAdd.py "$eaf_file" "$csv_file"

# Run FFmpeg command to combine the default image and audio into an MP4
ffmpeg -loop 1 -i "$default_image" -i "$input_audio" -c:v libx264 -tune stillimage -c:a aac -b:a 192k -pix_fmt yuv420p -shortest "$output_file"