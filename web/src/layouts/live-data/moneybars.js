import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export const options = {
  plugins: {
    title: {
      display: true,
      text: 'Funds',
    },
  },
  responsive: true,
  scales: {
    x: {
      stacked: true,
    },
    y: {
      stacked: true,
    },
  },
};

const labels = ['unified payment','visual ICT', 'upper link'];

export const data = {
  labels,
  datasets: [
    {
      label: 'Total Disbursment',
      data: [20,30,50],
      backgroundColor: 'rgb(255, 99, 132)',
    },
    {
      label: 'Total spend',
      data: [0,0,0],
      backgroundColor: 'rgb(75, 192, 192)',
    },
  
  ],
};

export function Chartss() {
  return <Bar options={options} data={data} />;
}