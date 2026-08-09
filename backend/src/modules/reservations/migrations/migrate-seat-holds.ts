import mongoose from "mongoose";
import { connectDB } from "@/config/database.config";
import { ReservationModel } from "../reservation.model";
import {
  ReservationSeatHoldModel,
  type ReservationSeatHoldStatus,
} from "../reservation-seat-hold.model";
import { getSessionById } from "@itsu-sushi/shared/config/reservation.config";

const dryRun = process.argv.includes("--dry-run");

function paidSeatExpiry(
  reservationDate: string,
  session: "lunch" | "dinner",
  slotId: string,
): Date | null {
  const slot = getSessionById(session)?.slots.find((item) => item.id === slotId);
  return slot ? new Date(`${reservationDate}T${slot.endTime}:00+07:00`) : null;
}

async function migrate() {
  await connectDB();
  await ReservationSeatHoldModel.syncIndexes();

  const reservations = await ReservationModel.find({
    status: { $in: ["PAID", "PENDING_PAYMENT"] },
  }).lean();
  let inserted = 0;
  let skipped = 0;

  for (const reservation of reservations) {
    const status = reservation.status as "PAID" | "PENDING_PAYMENT";
    const expiresAt = status === "PAID"
      ? paidSeatExpiry(reservation.reservationDate, reservation.session, reservation.slotId)
      : reservation.paymentExpiredAt;

    if (!expiresAt || expiresAt <= new Date()) {
      skipped += reservation.seatCodes.length;
      continue;
    }

    const holdStatus: ReservationSeatHoldStatus = status === "PAID" ? "CONFIRMED" : "HELD";
    for (const seatCode of new Set(reservation.seatCodes)) {
      inserted += 1;
      if (dryRun) continue;

      await ReservationSeatHoldModel.updateOne(
        {
          reservationDate: reservation.reservationDate,
          session: reservation.session,
          slotId: reservation.slotId,
          seatCode,
        },
        {
          $setOnInsert: {
            reservationId: reservation._id,
            reservationDate: reservation.reservationDate,
            session: reservation.session,
            slotId: reservation.slotId,
            seatCode,
            status: holdStatus,
            expiresAt,
          },
        },
        { upsert: true },
      );
    }
  }

  console.log(JSON.stringify({ dryRun, reservations: reservations.length, inserted, skipped }));
}

migrate()
  .catch((error) => {
    console.error("Seat hold migration failed", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });
