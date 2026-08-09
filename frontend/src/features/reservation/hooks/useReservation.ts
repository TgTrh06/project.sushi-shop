import { useMemo, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "react-hot-toast";

import {
  reservationFormSchema,
  type ReservationFormValues,
} from "../schemas/reservation.schema";
import {
  createReservation,
  getOccupiedSeats,
  getReservationConfig,
} from "../api/reservation.api";
import { calculateTotalDeposit } from "../utils/reservation.utils";
import { RESERVATION_QUERY_KEYS } from "../constants/reservation.constants";
import { useAuthStore } from "@/stores/useAuthStore";

/**
 * Main hook for managing reservation form and data fetching
 */
export function useReservation() {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  // ====== LOCAL STATE ======
  const [selectedSeats, setSelectedSeats] = useState<Set<string>>(new Set());

  // ====== FORM SETUP ======
  const form = useForm<ReservationFormValues>({
    resolver: zodResolver(reservationFormSchema),
    defaultValues: {
      customerName: user?.username || "",
      customerPhone: user?.phoneNumber?.toString() || "",
      reservationDate: new Date().toISOString().split("T")[0],
      session: undefined,
      slotId: "",
      seatCodes: [],
    },
    mode: "onBlur",
  });

  // ====== FORM WATCHERS ======
  const reservationDate = form.watch("reservationDate");
  const session = form.watch("session");
  const slotId = form.watch("slotId");

  // ====== QUERIES ======

  /**
   * Fetch reservation configuration (sessions, slots, pricing)
   */
  const {
    data: config,
    isLoading: configLoading,
    isError: configError,
  } = useQuery({
    queryKey: RESERVATION_QUERY_KEYS.config,
    queryFn: getReservationConfig,
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 2,
  });

  /**
   * Fetch occupied seats for selected date/session/slot
   */
  const {
    data: occupiedSeatsData = [],
    isLoading: seatsLoading,
    isError: seatsError,
  } = useQuery({
    queryKey: RESERVATION_QUERY_KEYS.occupiedSeats(
      reservationDate,
      session,
      slotId
    ),
    queryFn: () => getOccupiedSeats(reservationDate, session, slotId),
    enabled: !!reservationDate && !!session && !!slotId,
    staleTime: 1000 * 30, // 30 seconds
    retry: 1,
  });

  // ====== COMPUTED VALUES ======

  /**
   * Calculate total deposit based on selected seats
   */
  const totalDeposit = useMemo(() => {
    if (!config) return 0;
    return calculateTotalDeposit(selectedSeats.size, config.depositPerSeat);
  }, [selectedSeats, config]);

  /**
   * Convert array to Set for efficient lookup
   */
  const occupiedSeats = useMemo(() => {
    return new Set(occupiedSeatsData);
  }, [occupiedSeatsData]);

  // ====== MUTATIONS ======

  /**
   * Create reservation and redirect to payment
   */
  const {
    mutate: submitReservation,
    isPending: isSubmitting,
  } = useMutation({
    mutationFn: (payload: ReservationFormValues & { totalDeposit: number }) =>
      createReservation(payload),
    onSuccess: (data: { paymentUrl: string }) => {
      toast.success("Đang chuyển hướng đến thanh toán...");
      // Reset form after success
      form.reset();
      setSelectedSeats(new Set());
      
      setTimeout(() => {
        window.location.href = data.paymentUrl;
      }, 500);
    },
    onError: (rawError: unknown) => {
      const error = rawError as { response?: { data?: { message?: string } } };
      const message =
        error?.response?.data?.message || "Đặt chỗ thất bại, vui lòng thử lại";
      toast.error(message);
    },
  });

  // ====== EVENT HANDLERS ======

  /**
   * Toggle seat selection
   */
  const toggleSeat = useCallback(
    (seatCode: string) => {
      setSelectedSeats((prev) => {
        const next = new Set(prev);
        if (next.has(seatCode)) {
          next.delete(seatCode);
        } else {
          next.add(seatCode);
        }
        // Update form field
        form.setValue("seatCodes", Array.from(next), {
          shouldValidate: true,
        });
        return next;
      });
    },
    [form]
  );

  /**
   * Handle form submission
   */
  const onSubmit = form.handleSubmit((values) => {
    if (!user) {
      toast.error("Vui lòng đăng nhập để đặt chỗ");
      navigate("/login");
      return;
    }

    if (selectedSeats.size === 0) {
      toast.error("Vui lòng chọn ít nhất một ghế");
      return;
    }

    submitReservation({
      ...values,
      totalDeposit,
    });
  });

  // ====== COMPUTED LOADING STATES ======
  const isLoading = configLoading || seatsLoading;
  const hasError = configError || seatsError;

  return {
    // Form
    form,
    onSubmit,

    // Data
    config,
    occupiedSeats,
    selectedSeats,
    totalDeposit,

    // State
    isLoading,
    configLoading,
    seatsLoading,
    hasError,
    isSubmitting,

    // Actions
    toggleSeat,
  };
}
