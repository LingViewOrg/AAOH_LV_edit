// import React, { useEffect, useState } from 'react';
// import { ts_tag_array,player } from '../../lib/txt_sync';
// import { hasFeatureDetected } from '../../lib/globals';



// export function Features({  }) {
// 	// I/P: metadata, in JSON format
// 	// O/P: description from txt file
//     //const filteredDivs = ts_tag_array.filter(div => div.content.includes("textContent"));

//     let featuresList = [];
//     let currentFeature = 0;

//     React.useEffect(() => {
//         featuresList = [];
//         currentFeature = 0;
//     }, []);


//     const [hasFeatures, setHasFeatures] = useState(false);

//     React.useEffect(() => {
        
//         const interval = setInterval(() => {
//             setHasFeatures(hasFeatureDetected);
//         }, 500); 

        
//         return () => clearInterval(interval);
//     }, []);
    

//     const handleClick = () => {
//         //player.playerInfo.currentTime = 300;
//         // player.seekTo(300, true);
//         //  console.log(ts_tag_array);

//         // console.log(typeof ts_tag_array);
//         // console.log(Array.isArray(ts_tag_array));

//         for(const index of ts_tag_array )
//         {
      

//             if (index.textContent.includes('AAOH Feature:')) 
//             {

//                 if (!featuresList.includes(index.dataset.start_time)) {
//                     featuresList.push(index.dataset.start_time);
//                 }
                
                
//             }
//         }
//         if(currentFeature === 0)
//         {
//             currentFeature = featuresList[0];
//         }else{
//             console.log(currentFeature);
//             console.log(featuresList[0]);

//             for (let index = 0; index < featuresList.length; index++) {
//                 if(currentFeature ===featuresList[index] )
//                 {
//                     console.log("same");
                    
//                     if(index ===(featuresList.length -1) )
//                     {
//                         currentFeature = featuresList[0];
//                     }
//                     else{
//                         console.log("setting");
//                         currentFeature = featuresList[index + 1];
//                         break;
//                     }
//                 }
                
//             }
//         }
//         console.log(currentFeature);
//         player.seekTo(currentFeature/1000, true);
//       };


	
// 	return (
// 		<div >
//             {hasFeatures && (
// 			<button           style={{
//           padding: '10px 20px',
//           backgroundColor: '#007bff',
//           color: '#fff',
//           border: 'none',
//           borderRadius: '5px',
//           cursor: 'pointer'
//         }} type="button" onClick={handleClick}>Next Feature</button>

//         )}

// 		</div>
// 	);
// }
import React, { useEffect, useState } from 'react';
import { ts_tag_array, player } from '../../lib/txt_sync';
import { hasFeatureDetected } from '../../lib/globals';

export function Features() {
    const [hasFeatures, setHasFeatures] = useState(false);
    
    // USE STATE instead of 'let' so the data survives re-renders
    const [featuresList, setFeaturesList] = useState([]);
    const [currentFeatureTime, setCurrentFeatureTime] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setHasFeatures(hasFeatureDetected);
        }, 500); 
        return () => clearInterval(interval);
    }, []);

    const handleClick = () => {
        // 1. Build the list if it's empty
        let list = featuresList;
        if (list.length === 0) {
            const temp = [];
            for (const index of ts_tag_array) {
                if (index.textContent.includes('AAOH Feature:')) {
                    temp.push(index.dataset.start_time);
                }
            }
            setFeaturesList(temp);
            list = temp;
        }

        if (list.length === 0) return;

        // 2. Logic to find the next feature
        let nextTime;
        if (currentFeatureTime === 0) {
            nextTime = list[0];
        } else {
            // Find the index of the current time in the list
            const currentIndex = list.indexOf(currentFeatureTime);
            // Go to next, or back to 0 if at the end
            const nextIndex = (currentIndex + 1) % list.length;
            nextTime = list[nextIndex];
        }

        // 3. Update state and Player
        setCurrentFeatureTime(nextTime);
        player.seekTo(nextTime / 1000, true);
    };

    return (
        <div>
            {hasFeatures && (
                <button 
                    style={{
                        padding: '10px 20px',
                        backgroundColor: '#007bff',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer'
                    }} 
                    type="button" 
                    onClick={handleClick}
                >
                    Next Feature
                </button>
            )}
        </div>
    );
}