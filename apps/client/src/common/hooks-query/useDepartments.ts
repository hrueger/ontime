import { useQuery } from '@tanstack/react-query';

import { queryRefetchInterval } from '../../ontimeConfig';
import { DEPARTMENTS } from '../api/apiConstants';
import { getDepartments } from '../api/ontimeApi';
import { departmentsPlaceholder } from '../models/Department';

export default function useDepartments() {
  const { data, status, isFetching, isError, refetch } = useQuery({
    queryKey: DEPARTMENTS,
    queryFn: getDepartments,
    placeholderData: departmentsPlaceholder,
    retry: 5,
    retryDelay: (attempt) => attempt * 2500,
    refetchInterval: queryRefetchInterval,
    networkMode: 'always',
  });

  return { data, status, isFetching, isError, refetch };
}
