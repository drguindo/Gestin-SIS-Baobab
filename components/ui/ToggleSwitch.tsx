/**
 * @file Fournit un composant d'interrupteur (Toggle Switch) stylisé et réutilisable
 * pour gérer des états booléens.
 */

import React from 'react';

/**
 * Props pour le composant ToggleSwitch.
 * @interface ToggleSwitchProps
 */
interface ToggleSwitchProps {
  /** L'état actuel de l'interrupteur (activé ou désactivé). */
  enabled: boolean;
  /** Fonction de rappel appelée lorsque l'état de l'interrupteur change. */
  onChange?: (enabled: boolean) => void;
}

/**
 * Un composant d'interrupteur simple et accessible qui peut être utilisé dans
 * des formulaires ou des tableaux pour modifier des valeurs booléennes.
 *
 * @param {ToggleSwitchProps} props - Les props du composant.
 * @returns {React.ReactElement} Un bouton stylisé comme un interrupteur.
 */
const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ enabled, onChange }) => (
    <button
        type="button"
        onClick={() => onChange && onChange(!enabled)}
        className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary dark:focus:ring-offset-secondary ${enabled ? 'bg-primary' : 'bg-gray-300 dark:bg-gray-600'}`}
        aria-pressed={enabled}
    >
        <span className="sr-only">Use setting</span>
        <span className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform duration-300 ${enabled ? 'translate-x-6' : 'translate-x-1'}`} />
    </button>
);

export default ToggleSwitch;
