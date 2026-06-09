import { analyticsService } from '../services/analyticsService';
import { useAsync } from './useAsync';

export function useAnalytics() {
  return useAsync(() => analyticsService.summary(), []);
}
