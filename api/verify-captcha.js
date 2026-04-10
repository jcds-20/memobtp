export default async function handler(req, res) {
  const { captchaToken } = req.body;

  const formData = new URLSearchParams();
  formData.append("secret", process.env.TURNSTILE_SECRET);
  formData.append("response", captchaToken);

  const result = await fetch(
    "https://challenges.cloudflare.com/turnstile/v0/siteverify",
    {
      method: "POST",
      body: formData
    }
  );

  const data = await result.json();

  if (!data.success) {
    return res.status(403).json({ error: "Captcha invalide" });
  }

  return res.status(200).json({ success: true });
}