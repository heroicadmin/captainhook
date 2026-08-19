/* Tilkobling til Supabase.
   Fyll inn de to verdiene fra Supabase → Project Settings → API.
   anon-nøkkelen er ment å ligge i klienten; det er radsikkerheten (RLS) i
   schema.sql som beskytter dataene, ikke hemmelighold av denne nøkkelen.

   Lar du dette stå tomt, spør oppsettssiden om verdiene og husker dem
   i nettleseren i stedet — greit for testing, men sett dem her før deling. */

window.SUPABASE_CONFIG = {
  url: 'https://qiuiqgvkpsbkmpyyayej.supabase.co',
  anonKey: 'sb_publishable_CGNOpk616bXtzRniaYHLOQ_i-v_M8sV'
};
