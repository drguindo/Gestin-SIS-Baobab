/**
 * @file Affiche un graphique linéaire montrant l'évolution du nombre
 * de consultations sur les 7 derniers jours.
 */

import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { ConsultationDataPoint } from '../../types';
import Card from '../ui/Card';

/**
 * Props pour le composant ConsultationsChart.
 * @interface ConsultationsChartProps
 */
interface ConsultationsChartProps {
  /** Un tableau de points de données pour les consultations. */
  data: ConsultationDataPoint[];
}

/**
 * Un composant de graphique qui utilise la bibliothèque Recharts pour afficher
 * un graphique linéaire des consultations récentes. Il est encapsulé dans une
 * Card pour une apparence cohérente.
 *
 * @param {ConsultationsChartProps} props - Les props du composant.
 * @returns {React.ReactElement} Un graphique linéaire responsive.
 */
const ConsultationsChart: React.FC<ConsultationsChartProps> = ({ data }) => {
  return (
    <Card>
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">Consultations des 7 derniers jours</h3>
        <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
                <LineChart
                    data={data}
                    margin={{
                        top: 5, right: 30, left: 0, bottom: 5,
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(128, 128, 128, 0.2)" />
                    <XAxis dataKey="date" stroke="#9CA3AF"/>
                    <YAxis stroke="#9CA3AF"/>
                    <Tooltip 
                        contentStyle={{ 
                            backgroundColor: '#1E293B',
                            borderColor: '#334155'
                        }}
                        labelStyle={{ color: '#F1F5F9' }}
                    />
                    <Legend />
                    <Line type="monotone" dataKey="count" name="Consultations" stroke="#0D9488" strokeWidth={2} activeDot={{ r: 8 }} />
                </LineChart>
            </ResponsiveContainer>
        </div>
    </Card>
  );
};

export default ConsultationsChart;
