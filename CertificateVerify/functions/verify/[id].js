export async function onRequest(context) {
  const { params, env } = context;
  const id = params.id;

  const SUPABASE_URL = env.SUPABASE_URL;
  const SUPABASE_ANON_KEY = env.SUPABASE_ANON_KEY;

  // Fetch certificate from Supabase
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

  // If certificate not found → go to 404
  if (!cert) {
    return context.next();
  }

  // Format date safely
  const formattedDate = cert.issue_date
    ? new Date(cert.issue_date).toLocaleDateString("en-GB")
    : "N/A";

  const verifyUrl = `https://verify.innoknowvex.com/verify/${id}`;

  // Continue to load HTML page
  const res = await context.next();
  let html = await res.text();

  // Inject Open Graph + Twitter Meta Tags
  html = html.replace(
    "</head>",
    `
    <!-- Open Graph Meta Tags -->
    <meta property="og:title" content="${cert.name} - ${cert.course}" />
    <meta property="og:description" content="Certificate issued to ${cert.name} for ${cert.course} on ${formattedDate}" />
    <meta property="og:image" content="${cert.certificate_url}" />
    <meta property="og:url" content="${verifyUrl}" />
    <meta property="og:type" content="website" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />

    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${cert.name} - ${cert.course}" />
    <meta name="twitter:description" content="Certificate issued to ${cert.name} for ${cert.course}" />
    <meta name="twitter:image" content="${cert.certificate_url}" />

    </head>
    `
  );

  return new Response(html, {
    headers: { "content-type": "text/html; charset=UTF-8" },
  });
}