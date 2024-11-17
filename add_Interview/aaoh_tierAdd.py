import pympi
import csv
import re
import sys
import subprocess


def convert_wav_to_mp4_with_image(input_audio, image_file, output_video):
    
    command = [
        "ffmpeg",
        "-loop", "1",             
        "-i", image_file,          
        "-i", input_audio,         
        "-c:v", "libx264",         
        "-tune", "stillimage",     
        "-c:a", "aac",             
        "-b:a", "192k",            
        "-pix_fmt", "yuv420p",     
        "-shortest",               
        output_video              
    ]
        # Run FFmpeg command
    try:
        subprocess.run(command, check=True)
        print(f"Conversion successful! Saved as {output_video}")
    except subprocess.CalledProcessError as e:
        print("Error during conversion:", e)

def clean_string(text):
    
    
    no_punct = re.sub(r'[^\w\s]', '', text)
    
    
    cleaned = re.sub(r'\s+', ' ', no_punct).strip().lower()
    
    return cleaned

def compare_strings(str1, str2, match_threshold=0.7):
   
   
    clean_str1 = clean_string(str1)
    clean_str2 = clean_string(str2)
    
    
    words_str1 = set(clean_str1.split())
    words_str2 = set(clean_str2.split())
    
   
    common_words = words_str1.intersection(words_str2)
    
   
    total_words = len(words_str1.union(words_str2))
    match_ratio = len(common_words) / total_words if total_words > 0 else 0
    
   
    return match_ratio >= match_threshold





input_eaf = input("Enter the path to the input .eaf file: ")

headers = ["Text","Null copula","Person/num. agreement","Multiple negators","Existential it/dey","Perfect done","Remote past BIN","Habitual be"]
eaf_file = pympi.Elan.Eaf(input_eaf)


tier_name = 'Features'

tier_type = 'default'  

eaf_file.add_tier(tier_name)



csv_file = input_eaf.replace(".eaf", ".csv")



#print(f"New tier '{tier_name}' added and annotation added to it.")
rows = []
featuresList = []
with open(csv_file, newline='', mode='r', encoding ='utf-8') as csvfile:
    csv_reader = csv.reader(csvfile)
    for row in csv_reader:
        rows.append(row)
    
checkCount = 0
for row in rows:
        row[0] = row[0][7:]
        for col in row:
            
            if col == '1' :
                
                no_punct = re.sub(r'[^\w\s]', '', row[0])
                clean_text = re.sub(r'\s+', ' ', no_punct).strip()
                feature = [clean_text,headers[checkCount]]
                featuresList.append(feature)
                #print(row[0])
            checkCount +=1
        checkCount = 0
        
count = 0
for tier in eaf_file.tiers:
    tier_id = tier
    #print(f"Tier: {tier_id}")
    annotations = eaf_file.get_annotation_data_for_tier(tier_id)

    for annotation in annotations:
        start_time = annotation[0]
        end_time = annotation[1]
        annotation_text = annotation[2] 
        #print(annotation_text)
        for row in featuresList:
            #print(row[0])
            check = compare_strings(clean_string(row[0]),clean_string(annotation_text),0.7)
            
            if check == True:
                new_start_time = start_time 
                new_end_time = end_time   
                annotation_value = "AAOH Feature: " + row[1]
                eaf_file.add_annotation(tier_name, new_start_time, new_end_time, annotation_value)
                

        
        #print(f"Start: {start_time}, End: {end_time}, Text: {annotation_text}")
#for x in featuresList:
    #print(x)

eaf_file.to_file(input_eaf)




# Example usage
input_audio = input_eaf.replace(".eaf", ".wav")
image_file = "black.png"
output_video = input_eaf.replace(".eaf", ".mp4")
convert_wav_to_mp4_with_image(input_audio, image_file, output_video)


youtube_filename = input_eaf.replace(".eaf", ".youtube")


with open(youtube_filename, "w") as file:
    pass 