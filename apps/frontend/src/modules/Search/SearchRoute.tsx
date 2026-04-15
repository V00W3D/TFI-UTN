import type { RouteObject } from 'react-router-dom';
import SearchView from '@/modules/Search/SearchView';

export const SearchRoute: RouteObject = {
  path: '/search',
  element: <SearchView />,
};
