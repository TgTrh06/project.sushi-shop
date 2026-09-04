import mongoose from "mongoose";
import { connectDatabase } from "@/core/database/mongoose.connection";
import { ReservationModel } from "@/modules/reservations/infrastructure/mongoose/reservation.model";
import { ReservationPaymentModel } from "@/modules/payments/infrastructure/mongoose/payment.model";
import crypto from "crypto";

const dryRun = process.argv.includes("--dry-run");

async function migrate() {
  await connectDatabase();
  const legacy = await ReservationModel.find({ $or: [{ transactionReference: { $exists: false } }, { transactionReference: null }] }).lean();
  let reservations = 0;
  let payments = 0;
  for (const item of legacy) {
    const reference = item.transactionReference ?? item.vnp_TxnRef ?? `LEGACY_${crypto.randomUUID().replace(/-/g, "")}`;
    reservations += 1;
    if (dryRun) continue;
    await ReservationModel.updateOne({ _id: item._id, transactionReference: { $exists: false } }, { $set: { transactionReference: reference } });
    const exists = await ReservationPaymentModel.exists({ reservationId: item._id });
    if (!exists) {
      await ReservationPaymentModel.create({ reservationId: item._id, method: "VIETQR", amount: item.totalDeposit, transactionReference: reference, transferContent: reference, status: item.status === "PAID" ? "CONFIRMED" : "PENDING", bankCode: "", bankName: "", accountNumber: "", accountName: "", qrTemplate: "compact2", qrImageUrl: "", ...(item.status === "PAID" ? { confirmedAt: item.updatedAt } : {}) });
      payments += 1;
    }
  }
  console.log(JSON.stringify({ dryRun, reservations: legacy.length, updatedReservations: reservations, createdPayments: payments }));
}

migrate().catch((error) => { console.error("Reservation migration failed", error); process.exitCode = 1; }).finally(async () => { await mongoose.disconnect(); });
