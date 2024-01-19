import React,{useContext} from "react";
import "../styles/home.css";
import { Container, Row, Col, Button } from "reactstrap";
import { AuthContext } from "../context/AuthContext.js"
import heroVideo from "../assets/videos/landing_vid.mp4";
import Testimonials from "../components/Testimonial/Testimonial";
import Newsletter from "../shared/Newsletter";

import { Link,useNavigate } from "react-router-dom";

const Home = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const checkLogin = () => {
    
      if (!user) {
        navigate("/signin");
      }
      else{
        navigate("/view");
      }
    
  };

  return (
    <div>
      <div id="video-container">
        <video autoPlay muted loop>
          <source src={heroVideo} type="video/mp4" alt="" />
        </video>

        <div className="text-overlay center-button">
          <Container>
            <Row>
              <Col lg="12" className="heading text-left">
                <h1>Unlock Your Investing Potential!</h1>
              </Col>
              <Col lg="12" className="text-left">
              <p className="info">Stay ahead with real-time market updates.</p>  
              <p  className="info">Streamlined analysis for confident investing.</p>
                  <p className="info"> Make Informed decisions through expert insights.</p>
                
                  
                  
              </Col>
              <Col lg="12" className="button_pad text-left">
                <Button type="button" className="button_link btn ">
                  <Link  to= {checkLogin()} className="start_link  opacity-100">
                    Get Started
                  </Link>
                </Button>
              </Col>
            </Row>
          </Container>
        </div>
      </div>
      {/* Testimonial Section */}
      <Container>
        <Row>
          <Col lg="12" className="text-center ">
            <h2 className="testimonial__title "> Testimonials</h2>
          </Col>
          <Col lg="12">
            <Testimonials />
          </Col>
        </Row>
      </Container>

      {/* Newsletter Section */}
      <Container>
        <Row>
          <Col lg="12">
            <Newsletter />
          </Col>
        </Row>
      </Container>
    </div>
  )
};

export default Home;
