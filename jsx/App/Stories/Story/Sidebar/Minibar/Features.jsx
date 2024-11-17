
import React from 'react';
import { ts_tag_array,player } from '../../lib/txt_sync';

let featuresList = [];
let currentFeature = 0;
export function Features({  }) {
	// I/P: metadata, in JSON format
	// O/P: description from txt file
    //const filteredDivs = ts_tag_array.filter(div => div.content.includes("textContent"));

    

    const handleClick = () => {
        //player.playerInfo.currentTime = 300;
        // player.seekTo(300, true);
        //  console.log(ts_tag_array);

        // console.log(typeof ts_tag_array);
        // console.log(Array.isArray(ts_tag_array));

        for(const index of ts_tag_array )
        {
      

            if (index.textContent.includes('AAOH Feature:')) 
            {

                if (!featuresList.includes(index.dataset.start_time)) {
                    featuresList.push(index.dataset.start_time);
                }
                
                
            }
        }
        if(currentFeature === 0)
        {
            currentFeature = featuresList[0];
        }else{
            console.log(currentFeature);
            console.log(featuresList[0]);

            for (let index = 0; index < featuresList.length; index++) {
                if(currentFeature ===featuresList[index] )
                {
                    console.log("same");
                    
                    if(index ===(featuresList.length -1) )
                    {
                        currentFeature = featuresList[0];
                    }
                    else{
                        console.log("setting");
                        currentFeature = featuresList[index + 1];
                        break;
                    }
                }
                
            }
        }
        console.log(currentFeature);
        player.seekTo(currentFeature/1000, true);
      };


	
	return (
		<div >
			<button           style={{
          padding: '10px 20px',
          backgroundColor: '#007bff',
          color: '#fff',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer'
        }} type="button" onClick={handleClick}>Next Feature</button>

		</div>
	);
}
