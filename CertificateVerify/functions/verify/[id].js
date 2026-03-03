export async function onRequest(context) {
  const { params, env, request } = context;
  const id = params.id; // FULL certificate_id

  const SUPABASE_URL = env.SUPABASE_URL;
  const SUPABASE_ANON_KEY = env.SUPABASE_ANON_KEY;

  try {
    // 🔥 Fetch certificate using FULL certificate_id
    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/certificates?certificate_id=eq.${encodeURIComponent(id)}&select=*`,
      {
        headers: {
          apikey: SUPABASE_ANON_KEY,
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        },
      }
    );

    if (!response.ok) {
      return new Response("Error fetching certificate", { status: 500 });
    }

    const data = await response.json();
    const cert = data[0];

    if (!cert) {
      return new Response("Certificate not found", { status: 404 });
    }

    // Format issue date
    const formattedDate = cert.issue_date
      ? new Date(cert.issue_date).toLocaleDateString("en-GB")
      : "";

    const verifyUrl = `https://verify.innoknowvex.com/verify/${encodeURIComponent(id)}`;

    // 🔥 Detect social media crawlers
    const userAgent = request.headers.get("user-agent") || "";
    const isCrawler =
      userAgent.includes("facebookexternalhit") ||
      userAgent.includes("Twitterbot") ||
      userAgent.includes("LinkedInBot") ||
      userAgent.includes("WhatsApp") ||
      userAgent.includes("TelegramBot");

    // 🔥 If crawler → return pure meta HTML
    if (isCrawler) {
      const html = `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />

<title>${cert.name} - ${cert.course}</title>

<!-- Open Graph -->
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
<body>
Certificate Preview
</body>
</html>
`;
      return new Response(html, {
        headers: { "content-type": "text/html; charset=UTF-8" },
      });
    }

    // 🔥 If real user → redirect to React app
    return Response.redirect(verifyUrl, 302);

  } catch (error) {
    return new Response("Server error", { status: 500 });
  }
}