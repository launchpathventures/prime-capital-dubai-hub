-- CATALYST - YouTube lead magnet delivery and private document storage

CREATE TABLE IF NOT EXISTS public.lead_magnet_deliveries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  submission_id TEXT NOT NULL UNIQUE,
  form_mode TEXT NOT NULL,
  payload JSONB NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'retrying', 'delivered', 'exhausted')),
  attempts INTEGER NOT NULL DEFAULT 0,
  last_status_code INTEGER,
  last_attempt_at TIMESTAMPTZ,
  next_attempt_at TIMESTAMPTZ DEFAULT NOW(),
  delivered_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS lead_magnet_deliveries_retry_idx
  ON public.lead_magnet_deliveries (status, next_attempt_at)
  WHERE status IN ('pending', 'retrying');

ALTER TABLE public.lead_magnet_deliveries ENABLE ROW LEVEL SECURITY;

CREATE TABLE IF NOT EXISTS public.lead_magnet_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  submission_id TEXT NOT NULL,
  access_token UUID NOT NULL UNIQUE DEFAULT gen_random_uuid(),
  storage_path TEXT NOT NULL UNIQUE,
  filename TEXT NOT NULL,
  content_type TEXT NOT NULL,
  size_bytes BIGINT NOT NULL CHECK (size_bytes > 0),
  expires_at TIMESTAMPTZ NOT NULL DEFAULT (NOW() + INTERVAL '180 days'),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS lead_magnet_documents_submission_idx
  ON public.lead_magnet_documents (submission_id);

ALTER TABLE public.lead_magnet_documents ENABLE ROW LEVEL SECURITY;

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'lead-magnet-documents',
  'lead-magnet-documents',
  FALSE,
  10485760,
  ARRAY[
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'image/jpeg',
    'image/png',
    'image/webp'
  ]
)
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

COMMENT ON TABLE public.lead_magnet_deliveries IS
  'Service-role-only retry queue for website lead magnet submissions.';
COMMENT ON TABLE public.lead_magnet_documents IS
  'Private Second Opinion uploads retained for at least 180 days.';

NOTIFY pgrst, 'reload schema';
