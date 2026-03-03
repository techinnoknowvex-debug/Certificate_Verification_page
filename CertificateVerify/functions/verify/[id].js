export async function onRequest(context) {
  const { params, env } = context;
  const id = params.id;

  const SUPABASE_URL = env.SUPABASE_URL;
  const SUPABASE_ANON_KEY = env.SUPABASE_ANON_KEY;

  const response = await fetch(
    `${SUPABASE_URL}/rest/v1/certificates?short_id=eq.${id}&select=*`,
    {
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      },
    }
  );

  const data = await response.json();
  const cert = data[0];

  if (!cert) {
    return context.next();
  }

  const res = await context.next();
  let html = await res.text();

  html = html.replace(
    "</head>",
    `
    <meta property="og:title" content="${cert.name} - ${cert.course}" />
    <meta property="og:description" content="Issued by ${cert.issuer} on ${cert.issue_date}" />
    <meta property="og:image" content="${cert.certificate_url}" />
    <meta property="og:type" content="website" />
    </head>
    `
  );

  return new Response(html, {
    headers: { "content-type": "text/html" },
  });
}