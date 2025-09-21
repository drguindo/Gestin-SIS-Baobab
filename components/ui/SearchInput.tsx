/**
 * @file Fournit un composant de champ de recherche (SearchInput) réutilisable
 * avec une icône de loupe et un style cohérent.
 */

import React from 'react';
import { MagnifyingGlassIcon } from './icons';

/**
 * Props pour le composant SearchInput.
 * @interface SearchInputProps
 */
interface SearchInputProps {
  /** La valeur actuelle du champ de recherche. */
  value: string;
  /** Fonction de rappel appelée lorsque la valeur du champ change. */
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  /** Texte indicatif affiché lorsque le champ est vide. */
  placeholder?: string;
  /** Classes CSS supplémentaires pour personnaliser le conteneur. */
  className?: string;
}

/**
 * Un composant de champ de recherche contrôlé. Il inclut une icône de loupe
 * pour une meilleure expérience utilisateur et est stylisé pour s'intégrer
 * de manière cohérente dans l'application.
 *
 * @param {SearchInputProps} props - Les props du composant.
 * @returns {React.ReactElement} Un champ de saisie de recherche.
 */
const SearchInput: React.FC<SearchInputProps> = ({ value, onChange, placeholder = "Rechercher...", className = '' }) => {
  return (
    <div className={`relative w-full max-w-sm ${className}`}>
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
      </div>
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary focus:border-primary sm:text-sm"
        aria-label="Search"
      />
    </div>
  );
};

export default SearchInput;
