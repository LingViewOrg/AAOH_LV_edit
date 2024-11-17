import React from 'react';
import { ENGLISH, ESPANOL, FRANCAIS } from './locale/LocaleConstants.jsx';
import { TranslatableText } from './locale/TranslatableText.jsx';
import AAOH_logo1 from "./../../images/AAOH_logo1.png";
import AAOH_logo2 from "./../../images/AAOH_logo2.png";
import AAOH_logo3 from "./../../images/AAOH_logo3.png";
import AAOH_logo4 from "./../../images/AAOH_logo4.png";
import AAOH_logo4Copy from "./../../images/AAOH_logo4Copy.png";

const aboutPageJSX = {
  [ENGLISH]:
  <body className='about' style={{margin:0}}>
  <div  style={{margin:0}}>
  <div id="header1">
    <div id="header1Text">Reanimating African American Histories of the Gulf South</div>
  </div>

    
  <div id="slider">
    <figure>
      <img src={AAOH_logo4} ></img>
      <img src={AAOH_logo2}></img>
      <img src={AAOH_logo3}></img>
      <img src={AAOH_logo4Copy}></img>
      
      
    </figure>

  </div>
  <div id="aboutInfo">Samuel Proctor Oral History Program (SPOHP), UF Department of Linguistics, and George A. Smathers 
      Libraries are proud to announce the establishment of an NEH-funded collaborative project entitled, 
      Reanimating African American Oral Histories of the Gulf South (RGS). The project’s 
      foundation is the Joel Buchanan African American Oral History Archive, which is ongoing and 
      currently contains over 1000 interviews with African Americans in the Gulf South, a population absent from many other oral 
      history collections. Contained within this archive are the stories of African Americans who lived through the transatlantic slave trade, 
      the Jim Crow era, the Civil Rights Movement, the wars of the 20th Century, and the first Black presidency, along with the voices of those typically 
      marginalized in the study of African American histories such as the Gullah-Geechee and Black Seminoles. This project emphasizes the aforementioned 
      subjects and an extensive analysis of African American Language in the Gulf South (AALGS). The RGS project organizes these elements into a curriculum 
      with enormous potential for educators and their students, or in alternative educational environments such as teacher, adult, senior, or museum education programs.</div>
  </div>
  <div id='line'></div>
  <div id='linkText'>
    <p>Check out the official <a href="https://www.youtube.com/channel/UCPyiAStrnYuTEqCZ03Jp7rQ" target="_blank">AAOH Youtube Channel</a>
    for videos of all interviews and extra content!</p>
  </div>
  

</body>,
  [ESPANOL]:
    <div>
      <p>Ingrese el contenido aquí :) </p>
      <p>Para personalizar este texto de bienvenida, edite el archivo 'jsx/App/AboutPage.jsx' y luego ejecute el paquete web para que los cambios surtan efecto. </p>
    </div>,
  [FRANCAIS]:
    <div>
      <p>Saisissez le contenu ici :) </p>
      <p>Pour personnaliser ce texte de bienvenue, modifiez le fichier 'jsx/App/AboutPage.jsx', puis exécutez webpack pour que vos modifications prennent effet. </p>
    </div>,
};

export function AboutPage() {
  return <TranslatableText dictionary={aboutPageJSX} />;
}
