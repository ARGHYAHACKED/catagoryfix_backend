import type { Job } from 'bullmq';

export async function processAiJob(_job: Job): Promise<void> {
  return;
}

export async function processEmailJob(_job: Job): Promise<void> {
  return;
}

export async function processShopifyJob(_job: Job): Promise<void> {
  return;
}
