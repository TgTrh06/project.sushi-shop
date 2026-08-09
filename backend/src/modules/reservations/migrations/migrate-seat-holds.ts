import mongoose from "mongoose";
import { connectDatabase } from "@/core/database/mongoose.connection";
import { ReservationModel } from "../infrastructure/persistence/mongoose/reservation.model";
import { SeatHoldModel, type SeatHoldDocument } from "../infrastructure/persistence/mongoose/seat-hold.model";
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
  await connectDatabase();
  await SeatHoldModel.syncIndexes();

  const reservations = await ReservationModel.find({
    status: { $in: ["PAID", "PENDING_PAYMENT", "PENDING_APPROVAL"] },
  }).lean();
  let inserted = 0;
  let skipped = 0;

  for (const reservation of reservations) {
    const status = reservation.status as "PAID" | "PENDING_PAYMENT" | "PENDING_APPROVAL";
    const expiresAt = status === "PAID"
      ? paidSeatExpiry(reservation.reservationDate, reservation.session, reservation.slotId)
      : status === "PENDING_APPROVAL" ? reservation.approvalExpiresAt : reservation.paymentExpiredAt;

    if (!expiresAt || expiresAt <= new Date()) {
      skipped += reservation.seatCodes.length;
      continue;
    }

    const holdStatus: SeatHoldDocument["status"] = status === "PAID" ? "CONFIRMED" : status === "PENDING_APPROVAL" ? "PENDING_APPROVAL" : "HELD";
    for (const seatCode of new Set(reservation.seatCodes)) {
      inserted += 1;
      if (dryRun) continue;

      await SeatHoldModel.updateOne(
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
