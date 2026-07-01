-- CATALYST - Unique Active Completion Certificate
--
-- Automatic issuance can be triggered from module completion and quiz completion.
-- Keep the database idempotent under concurrent requests.

WITH ranked_active_certificates AS (
  SELECT
    id,
    ROW_NUMBER() OVER (
      PARTITION BY user_id
      ORDER BY issued_at ASC, created_at ASC, id ASC
    ) AS active_rank
  FROM completion_certificates
  WHERE revoked_at IS NULL
)
UPDATE completion_certificates
SET
  revoked_at = NOW(),
  revoke_reason = COALESCE(
    revoke_reason,
    'Automatically revoked duplicate active certificate during one-active-certificate migration'
  )
WHERE id IN (
  SELECT id
  FROM ranked_active_certificates
  WHERE active_rank > 1
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_completion_certificates_one_active_per_user
  ON completion_certificates(user_id)
  WHERE revoked_at IS NULL;
