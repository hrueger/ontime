import { useMutation, useQuery } from '@tanstack/react-query';

import { queryRefetchIntervalSlow } from '../../ontimeConfig';
import { SHEETS_SYNC_SETTINGS } from '../api/apiConstants';
import { getSheetsSyncSettings, postSheetsSyncSettings } from '../api/ontimeApi';
import { sheetsSyncPlaceholderSettings } from '../models/SheetsSyncSettings';
import { ontimeQueryClient } from '../queryClient';

export default function useSheetsSyncSettings() {
  const { data, status, isFetching, isError, refetch } = useQuery({
    queryKey: SHEETS_SYNC_SETTINGS,
    queryFn: getSheetsSyncSettings,
    placeholderData: sheetsSyncPlaceholderSettings,
    retry: 5,
    retryDelay: (attempt: number) => attempt * 2500,
    refetchInterval: queryRefetchIntervalSlow,
    networkMode: 'always',
  });

  return { data: data!, status, isFetching, isError, refetch };
}

export function useSheetsSyncSettingsMutation() {
  const { isLoading, mutateAsync } = useMutation({
    mutationFn: postSheetsSyncSettings,
    onSuccess: (res) => ontimeQueryClient.setQueryData(SHEETS_SYNC_SETTINGS, res.data),
    onSettled: () => ontimeQueryClient.invalidateQueries({ queryKey: SHEETS_SYNC_SETTINGS }),
  });
  return { isLoading, mutateAsync };
}
