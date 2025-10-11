
import React from 'react';
import { Gem } from '../components/icons/Icons';

interface PlaceholderPageProps {
  title: string;
}

const PlaceholderPage: React.FC<PlaceholderPageProps> = ({ title }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center">
      <Gem className="w-24 h-24 text-coral-300 dark:text-coral-700 mb-6" />
      <h1 className="text-4xl font-bold font-heading mb-2">{title}</h1>
      <p className="text-lg text-slate-500 dark:text-slate-400">This module is under construction.</p>
      <p className="mt-4 max-w-md">Our team is working hard to bring you an exciting and interactive learning experience. Please check back soon!</p>
    </div>
  );
};

export default PlaceholderPage;
