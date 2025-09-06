
import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { EpidemiologyDataPoint } from '../../types';
import Card from '../ui/Card';

interface EpidemiologyChartProps {
  data: EpidemiologyDataPoint[];
}

const COLORS = ['#0D9488', '#14B8A6', '#2DD4BF', '#5EEAD4', '#99F6E4'];

const EpidemiologyChart: React.FC<EpidemiologyChartProps> = ({ data }) => {
  return (
     <Card>
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">Répartition Épidémiologique</h3>
        <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                        nameKey="name"
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip 
                         contentStyle={{ 
                            backgroundColor: '#1E293B',
                            borderColor: '#334155'
                        }}
                    />
                    <Legend />
                </PieChart>
            </ResponsiveContainer>
        </div>
    </Card>
  );
};

export default EpidemiologyChart;
