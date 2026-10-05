import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { toEmail, studentName, universityId, eventName, orgName, whatsappGroupUrl } = await req.json();

    if (!toEmail || !studentName) {
      return new Response(JSON.stringify({ error: 'Missing required parameters' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (!RESEND_API_KEY) {
      console.warn('RESEND_API_KEY is not configured in environment variables.');
      return new Response(
        JSON.stringify({ message: 'Email service skipped: RESEND_API_KEY missing' }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const emailHtml = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 16px; background-color: #ffffff;">
        <div style="text-align: center; margin-bottom: 24px;">
          <h2 style="color: #5B21B6; margin: 0;">${orgName}</h2>
          <h3 style="color: #0F172A; margin-top: 8px;">${eventName}</h3>
        </div>

        <p style="color: #334155; font-size: 16px;">Dear <strong>${studentName}</strong>,</p>

        <p style="color: #475569; line-height: 1.6;">
          Thank you for applying to the <strong>Web Development Journey</strong>! Your application has been successfully received and registered under status: <span style="background-color: #DBEAFE; color: #1E40AF; padding: 4px 8px; border-radius: 6px; font-weight: bold;">Submitted</span>.
        </p>

        <div style="background-color: #F8FAFC; border-left: 4px solid #5B21B6; padding: 16px; margin: 24px 0; border-radius: 8px;">
          <p style="margin: 0; font-size: 14px; color: #334155;"><strong>University ID:</strong> ${universityId}</p>
          <p style="margin: 6px 0 0 0; font-size: 14px; color: #334155;"><strong>Status:</strong> Under Review</p>
        </div>

        <div style="text-align: center; margin: 32px 0;">
          <a href="${whatsappGroupUrl}" style="background-color: #059669; color: #ffffff; padding: 14px 28px; border-radius: 12px; text-decoration: none; font-weight: bold; display: inline-block;">
            Join Official WhatsApp Group
          </a>
        </div>

        <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 32px 0;" />

        <p style="font-size: 12px; color: #94A3B8; text-align: center;">
          ${orgName} — Innovation Starts Here.<br />
          Innovation University
        </p>
      </div>
    `;

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: `${orgName} <no-reply@ieee-innovation.edu>`,
        to: [toEmail],
        subject: `Application Confirmation — ${eventName}`,
        html: emailHtml,
      }),
    });

    const resData = await res.json();

    return new Response(JSON.stringify(resData), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
