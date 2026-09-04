import type { NextFunction, Request, Response } from "express";
import { HttpResponse } from "@/core/http/response";
import type { GetPaymentSettingsUseCase, ConfigurePaymentSettingsUseCase } from "../../application/use-cases/payment-settings.use-cases";

export class PaymentSettingsController { constructor(private readonly get: GetPaymentSettingsUseCase, private readonly configure: ConfigurePaymentSettingsUseCase) {} getSettings = async (_req: Request, res: Response, next: NextFunction) => { try { return HttpResponse.success(res, await this.get.execute(), "Payment settings retrieved successfully."); } catch (e) { next(e); } }; update = async (req: Request, res: Response, next: NextFunction) => { try { return HttpResponse.success(res, await this.configure.execute(req.body, req.user!.id), "Payment settings updated successfully."); } catch (e) { next(e); } }; }
