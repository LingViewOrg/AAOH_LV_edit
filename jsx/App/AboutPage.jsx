import React from 'react';
import { ENGLISH, ESPANOL, FRANCAIS } from './locale/LocaleConstants.jsx';
import { TranslatableText } from './locale/TranslatableText.jsx';
import AAOH_logo1 from "./../../images/AAOH_logo1.png";
import AAOH_logo2 from "./../../images/AAOH_logo2.png";
import AAOH_logo3 from "./../../images/AAOH_logo3.png";
import AAOH_logo4 from "./../../images/AAOH_logo4.png";
import AAOH_logo4Copy from "./../../images/AAOH_logo4Copy.png";

const aboutPageJSX = {
  [ENGLISH]: (
    <div className="about-page">

      
      <section className="hero">
       
        <div className="hero-text">
          
          <p className="subtitle">Powered by LingView<br />
             <span className="line-two">an interactive interview player</span></p>
        </div>
        <img 
                  src={AAOH_logo1} 
                  alt="Logo for Samuel Proctor Oral History Program"
                  className="partner-logo" 
                />
      </section>

      
      <section className="container mission-section">
        <h2>AAOH Project</h2>
        <p>
          The Samuel Proctor Oral History Program (SPOHP), UF Department of Linguistics, and George A. Smathers Libraries are proud to establish this collaborative project. Our foundation is the Joel Buchanan African American Oral History Archive, an ongoing collection of over 1000 interviews with African Americans in the Gulf South—a population absent from many other collections. LingView is the interview player chosen to showcase this essential history. With features just as auto text scrolling and phrase identification, we are able to create a simple interface to learn and follow along with meaningful conversations hosted here.
        </p>
      </section>
      
     
      <section className="stats-bar">
        <div className="stat-item">
            <span className="stat-number">1000+</span>
            <span className="stat-label">Interviews Collected</span>
        </div>
        <div className="stat-item">
            <span className="stat-number">5+</span>
            <span className="stat-label">Decades of History</span>
        </div>
        <div className="stat-item">
            <span className="stat-number">3</span>
            <span className="stat-label">Founding Partners</span>
        </div>
      </section>


      {/* Core Focus Areas Section (using a 3-column layout) */}
      <section className="container focus-section">
        <h2>A Rich Historical & Cultural Tapestry</h2>
        <div className="focus-grid">
          <div className="focus-card">
            {/* You could add an icon here */}
            <h3>Preserving Untold Stories</h3>
            <p>Our archive contains the stories of those who lived through the transatlantic slave trade, the Jim Crow era, the Civil Rights Movement, and the wars of the 20th Century.</p>
          </div>
          <div className="focus-card">
            {/* You could add an icon here */}
            <h3>Amplifying Marginalized Voices</h3>
            <p>We place special emphasis on the voices of those typically marginalized in history, ensuring their narratives are preserved.</p>
          </div>
          <div className="focus-card">
            {/* You could add an icon here */}
            <h3>Linguistic & Educational Goals</h3>
            <p>This project features extensive analysis of African American Language in the Gulf South (AALGS) and organizes these rich materials into a curriculum for educators and students.</p>
          </div>
        </div>
      </section>

      {/* Partners Section */}
      <section className="partners-section">
          <div className="container">
              <h2>Our Partners</h2>
              <div className="partner-logos">
                  
                {/* Each placeholder is now an img tag */}
                <img 
                  src={AAOH_logo2} 
                  alt="Logo for Samuel Proctor Oral History Program"
                  className="partner-logo" 
                />

                <img 
                  src={AAOH_logo3} 
                  alt="Logo for UF Department of Linguistics"
                  className="partner-logo" 
                />

                <img 
                  src={AAOH_logo4} 
                  alt="Logo for George A. Smathers Libraries"
                  className="partner-logo"
                />
                
              </div>
          </div>
      </section>

      {/* Final Call to Action Section */}
      <section className="cta-section">
        <h2>Explore the Archives</h2>
        <p>Watch full interviews on our official YouTube channel.</p>
        <a href="https://www.youtube.com/channel/UCPyiAStrnYuTEqCZ03Jp7rQ" target="_blank" rel="noopener noreferrer" className="cta-button">
          Visit the AAOH YouTube Channel
        </a>
      </section>
    </div>
  ),
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