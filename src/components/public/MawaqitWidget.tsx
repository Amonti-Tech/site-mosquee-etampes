import React from 'react';
import { ExternalLink, Clock } from 'lucide-react';

export function MawaqitWidget() {
  return (
    <section className="mawaqit-section" aria-labelledby="titre-horaires-priere">
      <div className="container">
        <div className="mawaqit-card">
          <div className="mawaqit-header">
            <div>
              <span className="section-subtitle">Temps de prière en direct</span>
              <h2 id="titre-horaires-priere">Horaires des Prières</h2>
            </div>
            <div className="badge badge-gold">
              <Clock size={16} aria-hidden="true" />
              <span>Synchronisé Mawaqit</span>
            </div>
          </div>

          <div className="mawaqit-wrapper">
            <iframe
              src="https://mawaqit.net/fr/w/centre-cultuel-mohamed-6-etampes?showOnly5PrayerTimes=0"
              title="Horaires de prière — Mosquée d'Etampes Centre (Mawaqit)"
              frameBorder="0"
              scrolling="no"
              loading="lazy"
              className="widget mawaqit-iframe"
            />
          </div>

          <div className="mawaqit-fallback">
            <a
              href="https://mawaqit.net/fr/w/centre-cultuel-mohamed-6-etampes"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Consulter les horaires de prière directement sur la plateforme Mawaqit (ouvre un nouvel onglet)"
            >
              <span>Voir les horaires sur Mawaqit</span>
              <ExternalLink size={16} aria-hidden="true" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

export default MawaqitWidget;
