import { ReservationModel } from "./reservation.model";
import { ReservationEntity } from "./reservation.types";

export default class ReservationRepository {
    protected mapToEntity(doc: any): ReservationEntity {
        return {
            id: doc._id.toString(),

            customerName: doc.customerName,
            customerPhone: doc.customerPhone,

            seatCodes: doc.seatCodes,
            reservationDate: doc.reservationDate,
            timeSlot: doc.timeSlot,

            totalDeposit: doc.totalDeposit,

            vnp_TxnRef: doc.vnp_TxnRef,
            status: doc.status,

            createdAt: doc.createdAt,
            updatedAt: doc.updatedAt,
        };

    }

    async create(data: any): Promise<ReservationEntity> {
        const doc = await ReservationModel.create(data);
        return this.mapToEntity(doc);
    }

    async findByTxnRef(txnRef: string) {
        return await ReservationModel.findOne({ vnp_TxnRef: txnRef });
    }

    async updateStatus(txnRef: string, status: string) {
        return ReservationModel.findOneAndUpdate(
            {
                vnp_TxnRef: txnRef,
            },
            {
                status,
            },
            {
                new: true,
            }
        );
    }

    async findAll() {
        return await ReservationModel.find().sort({ createdAt: -1 });
    }

    async findById(id: string) {
        return ReservationModel.findById(id);
    }

    async findOccupiedSeats(date: string, timeSlot: string) {
        const reservations = await ReservationModel.find({
            reservationDate: date,
            timeSlot: timeSlot,
            status: { $in: ["PAID", "PENDING_PAYMENT"] },
        }).select("seatIds");

        const occupiedSeats = reservations.flatMap((res) => res.seatCodes);
        return [...new Set(occupiedSeats)]; // Return unique seat IDs
    }
}
