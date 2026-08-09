import { useQuery, useQueryClient } from "@tanstack/react-query";
import type { SessionType } from "@itsu-sushi/shared/config/reservation.config";
import { getOccupiedSeats } from "../api/reservation.api";
import { RESERVATION_QUERY_KEYS } from "../constants/reservation.constants";

/**
 * Hook for fetching and managing seat availability
 * Automatically handles caching and refetching through TanStack Query
 */
export function useSeatAvailability(
  date: string,
  session: SessionType,
  slotId: string
) {
  const queryClient = useQueryClient();

  const {
    data: occupiedSeats = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: RESERVATION_QUERY_KEYS.occupiedSeats(date, session, slotId),
    queryFn: () => getOccupiedSeats(date, session, slotId),
    enabled: !!date && !!session && !!slotId,
    staleTime: 1000 * 30, // 30 seconds
    retry: 1,
  });

  /**
   * Manually refetch seat availability
   */
  const refetch = async () => {
    return queryClient.refetchQueries({
      queryKey: RESERVATION_QUERY_KEYS.occupiedSeats(date, session, slotId),
    });
  };

  /**
   * Invalidate cache to force refetch on next use
   */
  const invalidate = () => {
    queryClient.invalidateQueries({
      queryKey: RESERVATION_QUERY_KEYS.occupiedSeats(date, session, slotId),
    });
  };

  return {
    occupiedSeats: new Set(occupiedSeats),
    isLoading,
    isError,
    error,
    refetch,
    invalidate,
  };
}
