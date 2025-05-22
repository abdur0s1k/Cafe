import React from 'react';
import './aboutus.css';

function AboutUs() {
  return (
    <div className="about-us">
      <h1>О нас</h1>
      <div className="about-us__section">
        <h2>Добро пожаловать в Viva Cup</h2>
        <p>Мы — кофейня, которая предлагает лучший кофе в городе. Мы стремимся создавать атмосферу уюта и радости, предлагая нашим клиентам качественные напитки и продукты.</p>
      </div>
      <div className="about-us__section">
        <h2>Наша миссия</h2>
        <p>Мы гордимся тем, что можем предложить нашим гостям не просто кофе, а целый опыт, который оставит в их памяти теплые воспоминания.</p>
      </div>
      <div className="about-us__section">
        <h2>Наша команда</h2>
        <p>В команде Viva Cup работают профессионалы, для которых кофе — это не просто работа, а настоящее искусство. Мы обучаемся постоянно, чтобы радовать вас каждый день.</p>
      </div>
      <div className="contacts__map">
        <h2>Наше местоположение</h2>
        <iframe 
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2568.9843780898356!2d37.6173!3d55.7558!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x46dbcfd0668e6131%3A0x525df2b7ccf7f816!2z0JrQsNC30YDRg9C10YHQuNGB0L_QsA!5e0!3m2!1sru!2sru&markers=53.8963107,27.5535803"
          width="100%" 
          height="450" 
          style={{ border: 0 }} 
          allowFullScreen="" 
          loading="lazy"
        ></iframe>
      </div>
    </div>
  );
}

export default AboutUs;
