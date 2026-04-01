import type { RouteObject } from 'react-router-dom';
import SearchPage from './pages/SearchPage';

export const SearchRoutes: RouteObject = {
  path: '/search',
  element: <SearchPage />,
};
