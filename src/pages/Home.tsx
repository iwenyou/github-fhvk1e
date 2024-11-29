import React from 'react';
import { Link } from 'react-router-dom';
import {
  ClipboardList,
  Settings,
  Database,
  Files,
  FileEdit,
  ShoppingBag,
} from 'lucide-react';

const features = [
  {
    name: 'Generate Quote',
    description: 'Create professional quotes for your cabinet projects',
    href: '/generate-quote',
    icon: ClipboardList,
    color: 'bg-blue-500',
  },
  {
    name: 'Orders',
    description: 'View and manage all your orders',
    href: '/orders',
    icon: ShoppingBag,
    color: 'bg-green-500',
  },
  {
    name: 'Catalog',
    description: 'Browse and manage your product catalog',
    href: '/catalog',
    icon: Database,
    color: 'bg-purple-500',
  },
  {
    name: 'Quotes',
    description: 'View and manage all your quotes',
    href: '/quotes',
    icon: Files,
    color: 'bg-yellow-500',
  },
  {
    name: 'Quote Template',
    description: 'Customize your quote template and branding',
    href: '/quote-template',
    icon: FileEdit,
    color: 'bg-pink-500',
  }
];

export function Home() {
  return (
    <div className="py-12">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Professional Cabinet Quoting Made Easy
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Generate accurate quotes, manage your catalog, and streamline your workflow with our comprehensive quoting solution.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((feature) => (
          <Link
            key={feature.name}
            to={feature.href}
            className="group relative bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
          >
            <div className={`${feature.color} w-12 h-12 rounded-xl flex items-center justify-center mb-6`}>
              <feature.icon className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {feature.name}
            </h3>
            <p className="text-gray-600">{feature.description}</p>
            <div className="absolute bottom-8 right-8 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <span className="text-indigo-600">Get started →</span>
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-20 text-center">
        <img
          src="https://images.unsplash.com/photo-1600585152220-90363fe7e115?auto=format&fit=crop&q=80&w=2940"
          alt="Modern Cabinet Design"
          className="rounded-2xl shadow-2xl mx-auto max-w-4xl"
        />
      </div>
    </div>
  );
}