import { useNavigate } from 'react-router-dom'
import './About.css'
import archaeologyImage from '../../images/download.jpeg'
import ArrowButton from '../common/ArrowButton'

const About = () => {
  const navigate = useNavigate()

  return (
    <div className="about-page">
      <ArrowButton onClick={() => navigate(-1)} />

      <div className="about-content">
        <div className="about-left">
          <h1>
            Preserving heritage<br />
            through the use of <br />
            digital innovation<br/>
          </h1>
          <p>
            Cultural heritage is the future of preservation in this digital-focused world. 
            Kalanjiyam uses technology to change the way archaeologists connect and 
            communicate. We help organizations of all sizes digitize their historical 
            findings and personalize their research experience.
          </p>
          <button onClick={() => navigate("/contact")} className="contact-button">
            Contact Us
          </button>
        </div>
        
        <div className="about-right">
          <div className="about-image-container">
            <img 
              src={archaeologyImage} 
              alt="Archaeological excavation"
              className="about-image" 
            />
            <div className="image-background"></div>
            <div className="dotted-pattern"></div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default About 