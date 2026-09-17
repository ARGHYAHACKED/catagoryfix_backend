import { Plan } from '@catalogfix/database';

export class EntitlementService {
  canUseAI(_plan: Plan): boolean {
    return true;
  }

  canUseImageMatching(_plan: Plan): boolean {
    return true;
  }

  canUseShopifyIntegration(_plan: Plan): boolean {
    return true;
  }

  getMonthlyProductLimit(_plan: Plan): number {
    return 999999;
  }

  getMonthlyImportLimit(_plan: Plan): number {
    return 999999;
  }

  getMonthlyExportLimit(_plan: Plan): number {
    return 999999;
  }

  canProcessProducts(_plan: Plan, _used: number, _additional: number): boolean {
    return true;
  }
}
