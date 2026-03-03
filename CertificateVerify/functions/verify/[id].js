export async function onRequest(context) {
  const { params, env } = context;
  const id = params.id;

  const SUPABASE_URL = env.SUPABASE_URL;
  const SUPABASE_ANON_KEY = env.SUPABASE_ANON_KEY;

  // Fetch certificate
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
    return new Response("Certificate not found", { status: 404 });
  }

  const formattedDate = cert.issue_date
    ? new Date(cert.issue_date).toLocaleDateString("en-GB")
    : "";

  const verifyUrl = `https://verify.innoknowvex.com/verify/${id}`;

  // 🔥 Fetch static index.html manually
  const htmlResponse = await fetch("https://verify.innoknowvex.com/index.html");
  let html = await htmlResponse.text();

  // Inject meta tags
  html = html.replace(
    "</head>",
    `
    <meta property="og:title" content="${cert.name} - ${cert.course}" />
    <meta property="og:description" content="Certificate issued to ${cert.name} for ${cert.course} on ${formattedDate}" />
    <meta property="og:image" content="${cert.certificate_url}" />
    <meta property="og:url" content="${verifyUrl}" />
    <meta property="og:type" content="website" />

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