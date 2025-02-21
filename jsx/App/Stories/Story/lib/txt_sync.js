// Based on http://community.village.virginia.edu/etst/

import {highlightIfNeeded} from './annotate.js';

let player; // object for Youtube player

var timeCheck = 0;

let ts_tag_array = []; // Array that stores all timestamps/sentence id
let ts_start_time_array = [];
let ts_stop_time_array = [];




/* Sets up syncing between AV file and text scrolling and highlighting. */
function setupTextSync() {

    // "media" is undefined if there are no AV files associated with the current text. 
    const media = document.querySelectorAll("[data-live='true']")[0];
    


    if (media) {
        // For files with AV files, link the media file with the syncing functions.
        media.setAttribute("ontimeupdate", "sync(this.currentTime)");
        media.setAttribute("onclick", "sync(this.currentTime)");
        // For each sentence, sets up the sentence's start and end time. 
        ts_tag_array = document.getElementsByClassName("labeledTimeBlock");
        for (var i = 0; i < ts_tag_array.length; i++) {
            ts_start_time_array[i] = ts_tag_array[i].getAttribute("data-start_time");
            ts_stop_time_array[i] = ts_tag_array[i].getAttribute("data-end_time");
        }
    } else {
        ts_tag_array = document.getElementsByClassName("untimedBlock");
    }


    /* Scrolls to a selected sentence. */
    function scrollIntoViewIfNeeded(target) {
        
       //highlightIfNeeded(target);
       var rect = target.getBoundingClientRect();
      
        if (rect.bottom > window.innerHeight) {
            target.scrollIntoView(true);
        }
        if (rect.top < 0) {
            target.scrollIntoView();
        } 
        
        
        
    }
    function featureDetect(current_time)
    {

        if(current_time > 0)
        {
                const divs = document.querySelectorAll('div.labeledSentence');
                //console.log(divs)
                
                let previousDiv = null;
                divs.forEach(div => {
                    //console.log(div.textContent);

                    if (div.textContent.includes('AAOH Feature:')) 
                    {
                        div.style.fontStyle = 'italic';
                        if(previousDiv !== null)
                        {
                            if(previousDiv.textContent.includes('AAOH Feature:'))
                            {
                                previousDiv.style.fontStyle = 'italic';
                            }
                            else{
                                previousDiv.style.backgroundColor = 'yellow'; 
                            }
                            
                        }
                        
                    }
                    
                    previousDiv = div
                    // var textDivs =div.querySelectorAll('textContent');
                    // console.log(textDivs);
                    // let previousDiv = null;
                    // //console.log(textDivs);
                    // const textContents = [];
                    // textDivs.forEach(div => {
                    //     textContents.push(div.textContent);
                        
                    //     let firstTwoWords = div.textContent.split(' ').slice(0, 2).join(' ');
                    //     if(firstTwoWords === 'AAOH Feature:')
                    //     {
                    //         div.style.backgroundColor = 'yellow'; 
                            
                    //         previousDiv.style.fontStyle = 'italic'; 
                    //     }

                    //     previousDiv = div
                    //  });
                });
        }

    }

    /* Sync function for files with AV */
    function sync(current_time) {
 
        var count = 0;
        ts_stop_time_array[0] = ts_start_time_array[1];

        for(var i = 0;i<ts_tag_array.length - 1; i++ )
        {
            ts_stop_time_array[i] = ts_start_time_array[i+1];

        }
        
        const selected = [];
        for (var i=0; i<ts_tag_array.length; i++) {
            // Somewhat hacky solution: decrease current_time by 0.001 to avoid highlighting before player starts
            if ((current_time-0.001 >= parseFloat(ts_start_time_array[i])/1000.0) && (current_time <= parseFloat(ts_stop_time_array[i])/1000.0)) {
                count += 1;
                selected.push(i);
                // console.log(ts_start_time_array[i]);
                // console.log(ts_stop_time_array[i]);
                // if(count > 1)
                // {
                //     ts_tag_array[selected[1]].setAttribute("id", "current");
                //     scrollIntoViewIfNeeded($("#current")[0]);
                //     highlightSentence(selected[1]); 

                
                // }
                // else
                // {
                //     ts_tag_array[i].setAttribute("id", "current");
                //     scrollIntoViewIfNeeded($("#current")[0]);
                //     highlightSentence(i); 

                // }
                
            }
            else {
                unHighlightSentence(i);
                try { ts_tag_array[i].removeAttribute("id"); }
                catch (err) { }
            }
        }
       
      
        if(timeCheck == current_time)
        {

        }
        else
        {
            timeCheck = current_time;
        

            if(count > 1)
            {
                try {
                    ts_tag_array[selected[1]].setAttribute("id", "current");
                    scrollIntoViewIfNeeded($("#current")[0]);
                    highlightSentence(selected[1]); 
                    
                } catch (error) {
                    
                }
                

                    
            }
            else
            {
                try {
                    ts_tag_array[selected[0]].setAttribute("id", "current");
                    scrollIntoViewIfNeeded($("#current")[0]);
                    highlightSentence(selected[0]); 
                    
                } catch (error) {
                    
                }
                

            }
        }
        
        
    }

    window.sync = sync;

    /* Two functions that highlights/unhighlights a sentence. */
    function highlightSentence(timestampIndex) {
        ts_tag_array[timestampIndex].style.backgroundColor = "rgb(209, 200, 225)";
    }
    function unHighlightSentence(timestampIndex) {
        ts_tag_array[timestampIndex].style.backgroundColor = "transparent";
    }

    /* OnClick function for each timestamp */
    $(".timeStamp").click(function() {
        const newTime = $(this).data('start_time');
        if (newTime) {
            updateTimestampQuery(newTime);
            setMediaCurrentTime(newTime);
        } else {
            // A file without AV files will not have newTime associated with each sentence.
            // In this case, use the sentence id as part of the new URL after selecting a sentence. 
            const sentId = $(this).data('sentence_id');
            updateForUntimedFile(sentId);
        }
    });

    /* For files without AV, change the selected sentence's color and update query URL. */
    function updateForUntimedFile(sentId) {
        for (var i = 0; i < ts_tag_array.length; i++) {
            // sentence id starts with 1
            if (i+1 == sentId) {
                highlightSentence(i);
            } else {
                unHighlightSentence(i);
            }
        }
        updateTimestampQuery(sentId);
    }

    // I/P: t, an integer number of milliseconds
    // O/P: the player updates to the given time
    // Status: untested
    // This function adjusts the AV file(s)' timestamp according to the 
    // selected sentence's URL
    function setMediaCurrentTime(timestampMilliseconds) {
        if (getYoutubeMedia()) {
            // The timestamp unit on Youtube videos is seconds,
            // so need to divide t, which is in ms, by 1000.
            player.seekTo(timestampMilliseconds / 1000);
            player.playVideo();
        } else {
            const media = $("[data-live='true']").get(0);
            if (media) {
                media.currentTime = (timestampMilliseconds + 2) / 1000;
            } 
        }
        
    }

    /* Updates the URL according to a sentence's index id. */
    function updateTimestampQuery(newSentenceIndex) {
        if (window.history.replaceState) {
            // For files with AV, the intended behavior on the site is that
            // the first sentence doesn't highlight until things actually start playing.
            // That way, the first sentence becomes highlighted 1 ms into the recording if its start time was 0 ms.
            // So, here if media files are present, decrement sentence index by 1.
            if (media) {
                newSentenceIndex -= 1;
            }
            const newurl = window.location.href.replace(/\?.*$/,'') + `?${newSentenceIndex}`; // hacky...
            window.history.replaceState({ path: newurl }, '', newurl);
        }
    }


    /* 
     * Reads the page's current URL, and if the sentence query index is specified, 
     * performs the corresponding functions to jump to the requested sentence. 
     */
    // Source: http://snydersoft.com/blog/2009/11/14/get-parameters-to-html-page-with-javascript/
    $( document ).ready(function() {
        // This sentenceTimestampId is the timestamp for a file with AV, 
        // and a sentence id for a file without AV. 
        let query_index = document.URL.indexOf("?");
        let sentenceTimestampId = Number(document.URL.substr(query_index+1));
        if (isFinite(sentenceTimestampId)) {
            if (media) {
                setMediaCurrentTime(sentenceTimestampId + 1);
            } else {
                updateForUntimedFile(sentenceTimestampId);
                ts_tag_array[sentenceTimestampId].setAttribute("id", "current");
                scrollIntoViewIfNeeded($("#current")[0]);
            } 
        }

        // Call the sync function on the Youtube video every 0.1 second.
        // This ensures that the corresponding text is highlighted when
        // the text's timestamp matches the video's timestamp. 
        if (getYoutubeMedia()) {
            setInterval(function(){
                const currentTime = player.playerInfo.currentTime;
                sync(currentTime);
                featureDetect(currentTime);
            }, 100);
        }
        
    });
  
}

// Returns the element on the page with the tag "is-youtube=true".
function getYoutubeMedia() {
    const youtubeMedia = document.querySelectorAll("[is-youtube='true']")[0];
    return youtubeMedia;
}

/* First sets up Youtube player and related functionality, if the story has a 
* Youtube video. When the YT player is ready, or if the story does
* not require Youtube setup, calls setupTextSync.
*/
// export function setupYoutubeAndTextSync() {
//     const youtubeMedia = getYoutubeMedia();
//     if (!youtubeMedia) {
//         setupTextSync();
//         return; 
//     }

//     const youtubeID = youtubeMedia.getAttribute('youtube-id');
//     //Problem found with original Youtube Player setup, this function was being called before the Youtube API was ready,
//     //and window.YT was undefined
//     if (typeof window.YT !== 'undefined' && typeof window.YT.ready === 'function') {
//         player = new window.YT.Player("video", {
//             height: "270",
//             width: "480",
//             videoId: youtubeID
//         });
//         player.addEventListener('onReady', onPlayerReady);

//     }
//     else {
//         //Temporary Solution: wait until window.YT is defined
//         setTimeout(setupYoutubeAndTextSync, 200);
//     }
    
    
//         // // Initialize YouTube player: 
//         // window.YT.ready(function() {
//         //     player = new window.YT.Player("video", {
//         //         height: "270",
//         //         width: "480",
//         //         videoId: youtubeID
//         //     });
//         //     player.addEventListener('onReady', onPlayerReady);
//         // });
    
   

//     function onPlayerReady(event) {
//         setupTextSync();
//     }
// }
function waitForVideoElement() {
    return new Promise((resolve) => {
        const check = setInterval(() => {
            const videoEl = document.getElementById("video");
            if (videoEl) {
                clearInterval(check);
                resolve(videoEl);
            }
        }, 100);
    });
}

function loadYouTubeAPI() {
    return new Promise((resolve, reject) => {
        if (window.YT && window.YT.Player) {
            window.YT.ready(resolve);
            return;
        }

        const existingScript = document.getElementById("youtube-iframe-api");
        if (!existingScript) {
            const tag = document.createElement('script');
            tag.id = "youtube-iframe-api";
            tag.src = "https://www.youtube.com/iframe_api";
            tag.onload = () => {
                if (window.YT && window.YT.ready) {
                    window.YT.ready(resolve);
                }
            };
            tag.onerror = reject;
            document.head.appendChild(tag);
        } else {
            window.YT.ready(resolve);
        }
    });
}

export async function setupYoutubeAndTextSync() {
    const youtubeMedia = getYoutubeMedia();
    if (!youtubeMedia) {
        setupTextSync();
        return;
    }

    const youtubeID = youtubeMedia.getAttribute('youtube-id');

    await waitForVideoElement();
    await loadYouTubeAPI();

    window.YT.ready(() => {
        if (window.player && window.player.destroy) {
            window.player.destroy(); // Cleanup any old player
        }

        window.player = new window.YT.Player("video", {
            height: "270",
            width: "480",
            videoId: youtubeID,
            events: { onReady: onPlayerReady }
        });
    });

    function onPlayerReady() {
        setupTextSync();
    }
}
export  {ts_tag_array,player};