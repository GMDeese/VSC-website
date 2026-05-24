export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const body = req.body || {};

  // Build a clean HTML table from submitted fields
  const skip = new Set(['_subject', '_replyto', 'form_type']);
  const rows = Object.entries(body)
    .filter(([k]) => !skip.has(k) && body[k])
    .map(([k, v]) => `
      <tr>
        <td style="padding:8px 16px 8px 0;font-weight:600;color:#374151;white-space:nowrap;vertical-align:top;">${k}</td>
        <td style="padding:8px 0;color:#111827;">${String(v).replace(/\n/g, '<br/>')}</td>
      </tr>`)
    .join('');

  const subject = body._subject || 'New VSC Form Submission';
  const replyTo = body['Work Email'] || body['Email'] || body['email'] || body._replyto;
  const formType = body.form_type || 'Contact';

  const html = `
    <div style="font-family:Inter,sans-serif;max-width:600px;margin:0 auto;background:#f9fafb;padding:32px;">
      <div style="background:#ffffff;border-radius:12px;padding:32px;border:1px solid #e5e7eb;">
        <h2 style="margin:0 0 4px;font-size:20px;color:#111827;">${subject}</h2>
        <p style="margin:0 0 24px;font-size:13px;color:#6b7280;">${formType} · Veteran Service Connect</p>
        <table style="width:100%;border-collapse:collapse;font-size:15px;">
          <tbody>${rows}</tbody>
        </table>
        <hr style="margin:24px 0;border:none;border-top:1px solid #e5e7eb;" />
        <p style="margin:0;font-size:12px;color:#9ca3af;">
          Submitted via veteranserviceconnect.com
          ${replyTo ? `· Reply to this email to respond to ${replyTo}` : ''}
        </p>
      </div>
    </div>`;

  try {
    const r = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.RESEND_API_KEY_VSC}`,
      },
      body: JSON.stringify({
        from: 'Veteran Service Connect <noreply@veteranserviceconnect.com>',
        to: 'info@veteranserviceconnect.com',
        reply_to: replyTo || undefined,
        subject,
        html,
      }),
    });

    if (!r.ok) {
      const err = await r.text();
      console.error('Resend error:', err);
      return res.status(500).json({ error: 'Failed to send' });
    }

    return res.status(200).json({ ok: true });
  } catch (e) {
    console.error('Contact handler error:', e);
    return res.status(500).json({ error: 'Server error' });
  }
}
