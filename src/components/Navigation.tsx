import React from 'react';

interface NavigationProps {
  items: { label: string; href: string }[];
}

const Navigation: React.FC<NavigationProps> = ({ items }) => {
  return (
    <nav className="bg-white shadow mb-4">
      <div className="container mx-auto px-4 py-3">
        <ul className="flex space-x-6">
          {items.map((item) => (
            <li key={item.href}>
              <a
                href={item.href}
                className="text-gray-800 hover:text-blue-500"
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

export default Navigation;

