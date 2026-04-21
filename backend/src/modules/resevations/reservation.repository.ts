import { ReservationModel } from "./reservation.model";
import { IReservation } from "@shared/schemas/reservation.schema";

export default class ReservationRepository {
  async create(data: Partial<IReservation>) {
    return await ReservationModel.create(data);
  }

  async findByTxnRef(txnRef: string) {
    return await ReservationModel.findOne({ vnp_TxnRef: txnRef });
  }
  
  async updateStatus(id: string, status: string) {
    return await ReservationModel.findByIdAndUpdate(
      id,
      { status },
      { new: true },
    );
  }

  async findAll() {
    return await ReservationModel.find().sort({ createdAt: -1 });
  }

  async findById(id: string) {
    return ReservationModel.findById(id);
  }
}
