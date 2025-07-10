import React, { useState } from 'react';
import { FilterOptions, SortOptions } from '../types';

interface SearchFilterProps {
  onSearch: (query: string) => void;
  onFilter: (filters: FilterOptions) => void;
  onSort: (sort: SortOptions) => void;
  isLoading?: boolean;
}

const SearchFilter: React.FC<SearchFilterProps> = ({
  onSearch,
  onFilter,
  onSort,
  isLoading = false
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<FilterOptions>({});
  const [sortField, setSortField] = useState<string>('symbol');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  const handleFilterChange = (key: keyof FilterOptions, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilter(newFilters);
  };

  const handleSortChange = (field: string, direction: 'asc' | 'desc') => {
    setSortField(field);
    setSortDirection(direction);
    onSort({ field, direction });
  };

  const clearFilters = () => {
    setFilters({});
    setSearchQuery('');
    onFilter({});
    onSearch('');
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Search Bar */}
        <form onSubmit={handleSearch} className="flex-1">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search stocks by symbol or name..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading}
              className="absolute right-2 top-2 px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              🔍
            </button>
          </div>
        </form>

        {/* Filter Toggle */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
        >
          Filters {showFilters ? '▼' : '▶'}
        </button>

        {/* Sort Options */}
        <div className="flex gap-2">
          <select
            value={sortField}
            onChange={(e) => handleSortChange(e.target.value, sortDirection)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="symbol">Symbol</option>
            <option value="price">Price</option>
            <option value="change">Change</option>
            <option value="changePercent">Change %</option>
            <option value="volume">Volume</option>
          </select>
          <button
            onClick={() => handleSortChange(sortField, sortDirection === 'asc' ? 'desc' : 'asc')}
            className="px-3 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
          >
            {sortDirection === 'asc' ? '↑' : '↓'}
          </button>
        </div>
      </div>

      {/* Advanced Filters */}
      {showFilters && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Min Price
              </label>
              <input
                type="number"
                value={filters.minPrice || ''}
                onChange={(e) => handleFilterChange('minPrice', e.target.value ? Number(e.target.value) : undefined)}
                placeholder="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Max Price
              </label>
              <input
                type="number"
                value={filters.maxPrice || ''}
                onChange={(e) => handleFilterChange('maxPrice', e.target.value ? Number(e.target.value) : undefined)}
                placeholder="1000"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Market Cap
              </label>
              <select
                value={filters.marketCap || ''}
                onChange={(e) => handleFilterChange('marketCap', e.target.value || undefined)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All</option>
                <option value="small">Small Cap</option>
                <option value="medium">Mid Cap</option>
                <option value="large">Large Cap</option>
              </select>
            </div>
            <div className="flex items-end">
              <button
                onClick={clearFilters}
                className="w-full px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchFilter;
