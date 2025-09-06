/**
 * @file Fournit un composant de tableau (Table) générique et réutilisable
 * pour afficher des données tabulaires avec un style cohérent.
 */

import React from 'react';

/**
 * Props pour le composant Table.
 * @interface TableProps
 */
interface TableProps {
  /** Un tableau de chaînes de caractères pour les en-têtes de colonne. */
  headers: string[];
  /** Un tableau de tableaux (lignes) contenant les données des cellules.
   * Les cellules peuvent être des chaînes, des nombres ou d'autres composants React.
   */
  data: (string | React.ReactNode)[][];
}

/**
 * Un composant de tableau simple et stylisé avec Tailwind CSS.
 * Il est conçu pour être flexible et accepter n'importe quel type de données
 * pour ses cellules, y compris d'autres composants React comme des badges ou des boutons.
 *
 * @param {TableProps} props - Les props du composant.
 * @returns {React.ReactElement} Un tableau HTML stylisé.
 */
const Table: React.FC<TableProps> = ({ headers, data }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white dark:bg-secondary divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-800">
          <tr>
            {headers.map((header) => (
              <th key={header} scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
          {data.map((row, rowIndex) => (
            <tr key={rowIndex} className="hover:bg-gray-100 dark:hover:bg-gray-800">
              {row.map((cell, cellIndex) => (
                <td key={cellIndex} className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-200">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
