-- CATALYST - Certificate ID Generation RPC
--
-- Wraps certificate_seq to generate atomic, collision-free certificate IDs.
-- Replaces the count+1 pattern in lib/actions/certificate.ts.

CREATE OR REPLACE FUNCTION generate_certificate_id()
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  seq_num BIGINT;
  cert_year INT;
BEGIN
  seq_num := nextval('certificate_seq');
  cert_year := EXTRACT(YEAR FROM NOW())::INT;
  RETURN 'PCD-' || cert_year || '-' || LPAD(seq_num::TEXT, 4, '0');
END;
$$;
