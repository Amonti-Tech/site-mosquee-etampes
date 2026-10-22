'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';

interface HeaderProps {
  officialName?: string;
}

export function Header({ officialName = "Mosquée d'Etampes Centre" }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { label: 'Accueil', href: '/' },
    { label: 'La mosquée', href: '/la-mosquee' },
    { label: 'Actualités', href: '/actualites' },
    { label: 'Événements', href: '/evenements' },
    { label: 'Activités', href: '/activites' },
    { label: 'Informations pratiques', href: '/informations-pratiques' },
    { label: 'Contact', href: '/contact' }
  ];

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <header className="site-header" role="banner">
      <div className="container header-content">
        <Link href="/" className="brand-link" aria-label="Retour à l'accueil de la Mosquée d'Etampes Centre">
          <img
            src="/logo-mosquee.svg"
            alt="Logo de la Mosquée d'Etampes Centre"
            className="brand-logo-img"
            width={58}
            height={72}
          />
          <div className="brand-text">
            <span className="brand-title">{officialName}</span>
            <span className="brand-subtitle">Lieu de culte &amp; de paix</span>
          </div>
        </Link>

        {/* Navigation Desktop */}
        <nav className="main-nav" aria-label="Navigation principale">
          {navLinks.map((link) => {
            const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`nav-link ${isActive ? 'active' : ''}`}
                aria-current={isActive ? 'page' : undefined}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Bouton Menu Mobile */}
        <button
          type="button"
          className="mobile-menu-btn"
          aria-expanded={mobileMenuOpen}
          aria-controls="mobile-nav-drawer"
          aria-label={mobileMenuOpen ? 'Fermer le menu' : 'Ouvrir le menu de navigation'}
          onClick={toggleMobileMenu}
        >
          {mobileMenuOpen ? <X size={26} aria-hidden="true" /> : <Menu size={26} aria-hidden="true" />}
        </button>
      </div>

      {/* Menu Déroulant Mobile */}
      <nav
        id="mobile-nav-drawer"
        className={`mobile-nav-drawer ${mobileMenuOpen ? 'open' : ''}`}
        aria-label="Menu mobile"
      >
        <ul className="mobile-nav-list">
          {navLinks.map((link) => {
            const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`mobile-nav-link ${isActive ? 'active' : ''}`}
                  aria-current={isActive ? 'page' : undefined}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </header>
  );
}

export default Header;
