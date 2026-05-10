import { ReservationModel } from "./reservation.model";
import { ReservationEntity, CreateReservationDTO } from "./reservation.types";

export default class ReservationRepository {
    protected mapToEntity(doc: any): ReservationEntity {
        return {
            id: doc._id.toString(),
            userId: doc.userId?.toString(),

            customerName: doc.customerName,
            customerPhone: doc.customerPhone,

            reservationDate: doc.reservationDate,
            session: doc.session,
            slotId: doc.slotId,
            seatCodes: doc.seatCodes,

            totalDeposit: doc.totalDeposit,
            vnp_TxnRef: doc.vnp_TxnRef,
            paymentExpiredAt: doc.paymentExpiredAt,

            status: doc.status,

            createdAt: doc.createdAt,
            updatedAt: doc.updatedAt,
        };
    }

    async create(data: CreateReservationDTO & { vnp_TxnRef: string; status: string; paymentExpiredAt?: Date }): Promise<ReservationEntity> {
        const doc = await ReservationModel.create(data);
        return this.mapToEntity(doc);
    }

    async findByTxnRef(txnRef: string): Promise<ReservationEntity | null> {
        const doc = await ReservationModel.findOne({ vnp_TxnRef: txnRef });
        return doc ? this.mapToEntity(doc) : null;
    }

    async updateStatus(txnRef: string, status: string): Promise<ReservationEntity | null> {
        const doc = await ReservationModel.findOneAndUpdate(
            { vnp_TxnRef: txnRef },
            { status },
            { returnDocument: 'after' }
        );
        return doc ? this.mapToEntity(doc) : null;
    }

    async findAll(): Promise<ReservationEntity[]> {
        const docs = await ReservationModel.find().sort({ createdAt: -1 });
        return docs.map((doc) => this.mapToEntity(doc));
    }

    async findByUserId(userId: string): Promise<ReservationEntity[]> {
        const docs = await ReservationModel.find({ userId }).sort({ createdAt: -1 });
        return docs.map((doc) => this.mapToEntity(doc));
    }

    async findById(id: string): Promise<ReservationEntity | null> {
        const doc = await ReservationModel.findById(id);
        return doc ? this.mapToEntity(doc) : null;
    }

    /**
     * Find occupied seats for a specific date, session, and slot
     * Only considers PAID or PENDING_PAYMENT (not expired) reservations
     */
    async findOccupiedSeats(date: string, session: string, slotId: string): Promise<string[]> {
        const now = new Date();
        
        const reservations = await ReservationModel.find({
            reservationDate: date,
            session: session,
            slotId: slotId,
            $or: [
                { status: "PAID" },
                { 
                    status: "PENDING_PAYMENT",
                    paymentExpiredAt: { $gt: now }
                }
            ],
        }).select("seatCodes");

        const occupiedSeats = reservations.flatMap((res) => res.seatCodes);
        return [...new Set(occupiedSeats)]; // Return unique seat codes
    }
}
