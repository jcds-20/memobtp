import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { nom, entreprise, email, nb_employes } = req.body;

  // validation basique
  if (!nom || !entreprise || !email || !nb_employes) {
    return res.status(400).json({ error: 'Missing fields' });
  }

  // anti-spam simple (email invalide)
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Invalid email' });
  }

  const { error } = await supabase.from('prospects').insert([
    { nom, entreprise, email, nb_employes }
  ]);

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  return res.status(200).json({ success: true });
}