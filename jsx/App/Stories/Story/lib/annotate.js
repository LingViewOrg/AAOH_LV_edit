//import  {getMediaFilePath} from '~./jsx/App/Stories/Story/Story.jsx'
import  dataEmitter  from './emitter/dataEmitter.js';

//const fs = require('fs');
//const path = require('path');
const dir = "./csvFiles";
let lastSearchText = '';
let features = ['Text','Null copula','Person/num. agreement','Multiple negators','Existential it/dey','Perfect done','Remote past BIN', 'Habitual be'];
let found = false;
let currFeatures = [];
let featureTagText = '';



let tooltipContent;
let currentTarget;
let currTitle;
const testEmit = dataEmitter;
let currPath;
try {
    dataEmitter.on('newStory', (data) => {
        //console.log('Data received:', data);
        
        currTitle = data + ".csv";
      });
    
} catch (error) {
    
}


//console.log(testEmit);

function preprocessText(text) {
    return text
      .replace(/;/g, '')              // Remove semicolons
      .replace(/[-–—]/g, ' ')              // Removes Hyphens
      .replace(/\s+/g, ' ')           // Replace multiple spaces with a single space
      .trim();                        // Trim leading and trailing spaces
  }

function parseCSV(csvContent) {
    const data = csvContent.trim().split('\n').map(row => row.split(',').map(cell => preprocessText(cell)));

    return data;

}
function searchCSV(data,columnName, text) {

    const headers = data[0];
    const columnIndex = headers.indexOf(columnName);
    //console.log(columnIndex);
    if (columnIndex === -1) {
      return [];
    }
    const lowerCaseSearchText = text.toLowerCase();
    const result = data.filter(row => row[columnIndex] && row[columnIndex].toLowerCase().includes(lowerCaseSearchText));
    return result;
  }
    





function createTooltip(text) {
    if(!tooltipContent)
    {

        tooltipContent = document.createElement('div');
        tooltipContent.classList.add('tooltip-content');
        tooltipContent.textContent = text;
        document.body.appendChild(tooltipContent);
    }
    
}
function removeTooltip() {

    try {
        tooltipContent.style.visibility = 'hidden';
        tooltipContent.style.opacity = '0';
        setTimeout(() => {
            if (tooltipContent) {
                document.body.removeChild(tooltipContent);
                tooltipContent = null;
            }
        }, 300);
        
    } catch (error) {
        
    }
    
}

export function highlightIfNeeded(target)
{
    //console.log("got to highlight function");
    //const index =  import('~./data/index.json').default;
   //searchFiles(dir,currTitle);

    var rect = target.getBoundingClientRect();
    var textDivs =target.querySelectorAll('.topRow');
    let previousDiv = null;
    //console.log(textDivs);
    const textContents = [];
    textDivs.forEach(div => {
        textContents.push(div.textContent);
        
        let firstTwoWords = div.textContent.split(' ').slice(0, 2).join(' ');
        if(firstTwoWords === 'AAOH Feature:')
        {
            div.style.backgroundColor = 'yellow'; 
            
            previousDiv.style.fontStyle = 'italic'; 
        }

        previousDiv = div
        
    });
    currPath = 'data/csv_files/' + currTitle;
    

    // fetch(currPath)
    // .then(response => response.text())
    // .then(data => {

    //     //console.log(data);
    //     const rows = parseCSV(data);
    //     //console.log(rows);
    //     for (let i = 0; i < textContents.length; i++) {
            
    //         if (textContents[i].trim() !== "") {
    //             if(lastSearchText != textContents[i])
    //             {
    //                 lastSearchText = textContents[i];
    //                 const result = searchCSV(rows, 'Text',textContents[i]);
    //                 //console.log(result);
    //                 //console.log(rows);
    //                 if(result[0] !== undefined)
    //                 {
    //                     for (let j = 0; j < result[0].length; j++) {
    //                         if(result[0][j] == "1")
    //                         {
    //                             found = true;
    //                             console.log(result);
    //                             console.log(features[j]);
    //                             currFeatures.push(features[j]);
    //                         }
                            
    //                     }
    //                     if(found)
    //                     {
    //                         featureTagText = "This Sentence Contains the Following Features: "
                            
    //                         for (let i = 0; i < currFeatures.length; i++) {
    //                             if(i === currFeatures.length -1)
    //                             {
    //                                 featureTagText += currFeatures[i];

    //                             }
    //                             else{
    //                                 featureTagText += currFeatures[i] + ', ';
    //                             }
                                
                                    
    //                         }

                            
                            
    //                         found = false;
    //                         target.addEventListener('mouseenter', (event) => {
    //                             createTooltip(featureTagText);
    //                             tooltipContent.style.visibility = 'visible';
    //                             tooltipContent.style.opacity = '1';
    //                         });

    //                         target.addEventListener('mouseleave', () => {
        
    //                             removeTooltip();
    //                         });
    //                         textDivs.forEach(div => {
                                
    //                             div.classList.add('highlight');
    //                             //console.log(div.textContent);
    //                         });


    //                     }else{
    //                         currFeatures = [];
    //                         featureTagText = '';
    //                     }
    //                 }   

    //             }
    //         }
            
    //     }
       
        
        
    // })
    // .catch(error => console.error('Error fetching CSV:', error));

    
    
    


    

    // document.addEventListener('mousemove', (event) => {

    //     if (!tooltipContent) return;

    //     const tooltipX = event.clientX + 10; // Offset from the cursor
    //     const tooltipY = event.clientY + 10;

    //     tooltipContent.style.left = `${tooltipX + window.scrollX}px`;
    //     tooltipContent.style.top = `${tooltipY + window.scrollY}px`;

        

    // });

    
}

