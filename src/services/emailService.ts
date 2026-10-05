import { supabase, isSupabaseConfigured } from './supabaseClient';
import { EVENT_CONFIG } from '../config/eventConfig';

export interface ConfirmationEmailPayload {
  studentName: string;
  universityEmail: string;
  universityId: string;
}

/**
 * Sends confirmation email upon registration.
 * Calls Supabase Edge Function 'send-confirmation-email' if configured.
 * Safely handles missing email API keys without blocking registration UX.
 */
export async function sendConfirmationEmail(payload: ConfirmationEmailPayload): Promise<boolean> {
  console.log(`[Email Service] Triggering confirmation email for: ${payload.universityEmail}`);

  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase.functions.invoke('send-confirmation-email', {
        body: {
          toEmail: payload.universityEmail,
          studentName: payload.studentName,
          universityId: payload.universityId,
          eventName: EVENT_CONFIG.eventName,
          orgName: EVENT_CONFIG.orgName,
          whatsappGroupUrl: EVENT_CONFIG.whatsappGroupUrl,
        },
      });

      if (error) {
        console.warn('[Email Service] Edge function returned notice/error:', error);
        return false;
      }

      console.log('[Email Service] Confirmation email dispatched successfully:', data);
      return true;
    } catch (err) {
      console.warn('[Email Service] Failed to invoke email Edge function:', err);
    }
  }

  // Graceful development log simulation
  console.log('[Email Service - Dev Mode] Simulated email body:');
  console.log(`To: ${payload.universityEmail}`);
  console.log(`Subject: Application Received - Web Development Journey`);
  console.log(
    `Dear ${payload.studentName},\nThank you for applying to the Web Development Journey! Your application has been received with status: Submitted.`
  );

  return true;
}
