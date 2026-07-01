import { useLocation } from 'react-router-dom';

export function useSearchMode() {
  const location = useLocation();

  const isFacilityPage = location.pathname.startsWith('/facility');

  return {
    isFacilityPage,
    isOverviewPage: location.pathname === '/',
  };
}
