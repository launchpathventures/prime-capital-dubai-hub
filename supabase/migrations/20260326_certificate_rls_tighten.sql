-- CATALYST - Tighten certificate RLS SELECT policy
--
-- The original USING(true) policy allowed full-table enumeration including
-- revocation metadata. Replace with a policy that only exposes active certificates.
-- Admin FOR ALL policy still covers getAllCertificates() unrestricted.

DROP POLICY IF EXISTS "Anyone can view certificates by certificate_id" ON completion_certificates;
DROP POLICY IF EXISTS "Users can view own certificates" ON completion_certificates;

CREATE POLICY "Public can view active certificates"
  ON completion_certificates FOR SELECT
  USING (revoked_at IS NULL);
