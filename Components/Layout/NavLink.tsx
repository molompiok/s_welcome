// src/Components/Layout/NavLink.tsx
import React from 'react';
import { usePageContext } from '../../renderer/usePageContext'; // Ajustez le chemin si nécessaire
import { Link } from '../../renderer/Link'; // Importez votre composant Link de Vike

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  activeClassName?: string;
  exact?: boolean; // Pour une correspondance exacte de l'URL
}

export function NavLink({
  href,
  children,
  className = "text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors",
  activeClassName = "text-blue-600 bg-blue-50",
  exact = false,
}: NavLinkProps) {
  const pageContext = usePageContext();
  const currentPath = pageContext.urlPathname;

  const isActive = exact ? currentPath === href : currentPath.startsWith(href);

  return (
    <Link href={href} className={`${className} ${isActive ? activeClassName : ''}`}>
      {children}
    </Link>
  );
}