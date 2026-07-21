import { useQuery } from "@tanstack/react-query";
import { movementService } from "../services/movementService";

export function useMovements(clientId: number | null, page = 0, size = 20) {
  return useQuery({
    queryKey: ["movements", clientId, page, size],
    queryFn: () => movementService.getByClientId(clientId!, page, size),
    enabled: clientId !== null,
  });
}