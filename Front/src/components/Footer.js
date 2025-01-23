import React from 'react';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <p>&copy; {new Date().getFullYear()} Boite Annonces. Tous droits réservés.</p>
        <p>
          Développé dans le cadre d'un projet académique. Code disponible sur{' '}
          <a href="https://github.com/votre-repo" target="_blank" rel="noopener noreferrer">
            GitHub
          </a>.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
