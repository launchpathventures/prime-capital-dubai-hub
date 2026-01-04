/**
 * CATALYST - Supabase Auth Integration Guide
 *
 * Step-by-step instructions for setting up Supabase authentication.
 */

import Link from "next/link"

export default function SupabaseAuthPage() {
  return (
    <article className="space-y-8">
      {/* Page header */}
      <header>
        <h1 className="text-3xl font-semibold tracking-tight">
          Supabase Authentication
        </h1>
        <p className="text-muted-foreground mt-2 text-lg">
          End-to-end auth with email/password, magic links, and session management.
        </p>
      </header>

      {/* Overview */}
      <section className="space-y-4">
        <h2 className="text-xl font-medium">Overview</h2>
        <p className="text-muted-foreground leading-relaxed">
          Catalyst supports multiple auth modes. When Supabase is configured, you get
          full authentication with registration, password reset, email verification,
          and protected routes.
        </p>
        <div className="bg-muted/50 rounded-lg p-4 text-sm space-y-2">
          <p className="font-medium">What&apos;s included:</p>
          <ul className="text-muted-foreground list-inside list-disc space-y-1">
            <li>Sign in, Register, Forgot Password, Reset Password pages</li>
            <li>Session management with automatic refresh</li>
            <li>Protected <code>/app/*</code> routes via middleware</li>
            <li>Sign out functionality</li>
            <li>Dynamic redirect URLs for multi-environment support</li>
          </ul>
        </div>
      </section>

      {/* Step 1: Create Supabase Project */}
      <section className="space-y-4">
        <h2 className="text-xl font-medium">Step 1: Create Supabase Project</h2>
        <ol className="text-muted-foreground list-inside list-decimal space-y-3">
          <li>
            Go to{" "}
            <a
              href="https://supabase.com/dashboard"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary underline"
            >
              supabase.com/dashboard
            </a>
          </li>
          <li>Click <strong>New project</strong></li>
          <li>Choose your organization, name your project, set a database password</li>
          <li>Select a region close to your users</li>
          <li>Wait for the project to finish provisioning (~2 minutes)</li>
        </ol>
      </section>

      {/* Step 2: Get API Keys */}
      <section className="space-y-4">
        <h2 className="text-xl font-medium">Step 2: Get API Keys</h2>
        <ol className="text-muted-foreground list-inside list-decimal space-y-3">
          <li>
            In your Supabase project, go to{" "}
            <strong>Project Settings → API</strong>
          </li>
          <li>
            Copy the <strong>Project URL</strong> → this is your{" "}
            <code>NEXT_PUBLIC_SUPABASE_URL</code>
          </li>
          <li>
            Copy the <strong>anon/public</strong> key → this is your{" "}
            <code>NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY</code>
          </li>
        </ol>
        <div className="border-l-4 border-amber-500 bg-amber-500/10 p-4 text-sm">
          <p className="font-medium text-amber-700 dark:text-amber-400">⚠️ Important</p>
          <p className="text-muted-foreground mt-1">
            Never use the <code>service_role</code> key in the browser. It bypasses
            Row Level Security and should only be used server-side.
          </p>
        </div>
      </section>

      {/* Step 3: Configure Redirect URLs */}
      <section className="space-y-4">
        <h2 className="text-xl font-medium">Step 3: Configure Redirect URLs</h2>
        <p className="text-muted-foreground">
          Supabase needs to know which URLs are allowed for auth redirects
          (email confirmation links, password reset links, etc.).
        </p>
        <ol className="text-muted-foreground list-inside list-decimal space-y-3">
          <li>
            Go to <strong>Authentication → URL Configuration</strong>
          </li>
          <li>
            Set <strong>Site URL</strong> to your production URL:
            <code className="ml-2 bg-muted px-2 py-0.5 rounded text-xs">
              https://your-domain.com
            </code>
          </li>
          <li>
            Add these to <strong>Redirect URLs</strong>:
          </li>
        </ol>
        <div className="bg-muted rounded-lg p-4 font-mono text-sm space-y-1">
          <p>http://localhost:3000/**</p>
          <p>https://your-domain.com/**</p>
          <p>https://*.vercel.app/**</p>
        </div>
        <p className="text-muted-foreground text-sm">
          The <code>**</code> wildcard allows any path on that domain.
        </p>
      </section>

      {/* Step 4: Configure Environment Variables */}
      <section className="space-y-4">
        <h2 className="text-xl font-medium">Step 4: Configure Environment Variables</h2>
        <p className="text-muted-foreground">
          Add these to your <code>.env.local</code> file:
        </p>
        <div className="bg-muted rounded-lg p-4 font-mono text-sm space-y-2">
          <p className="text-muted-foreground"># Supabase</p>
          <p>NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co</p>
          <p>NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=eyJhbGc...</p>
          <p></p>
          <p className="text-muted-foreground"># App URL (for production)</p>
          <p>NEXT_PUBLIC_APP_URL=https://your-domain.com</p>
        </div>
        <p className="text-muted-foreground text-sm">
          Leave <code>NEXT_PUBLIC_APP_URL</code> unset for local development —
          it defaults to <code>http://localhost:3000</code>.
        </p>
      </section>

      {/* Step 5: Customize Email Templates */}
      <section className="space-y-4">
        <h2 className="text-xl font-medium">Step 5: Customize Email Templates</h2>
        <p className="text-muted-foreground">
          Supabase sends emails for signup confirmation, password reset, etc.
          Customize them to match your brand.
        </p>
        <ol className="text-muted-foreground list-inside list-decimal space-y-3">
          <li>
            Go to <strong>Authentication → Emails</strong> (under Notifications)
          </li>
          <li>
            Select a template (e.g., <strong>Confirm sign up</strong>)
          </li>
          <li>
            Edit the <strong>Subject</strong> and <strong>Body</strong>
          </li>
        </ol>

        <p className="text-muted-foreground text-sm font-medium mt-4">
          Suggested template for &quot;Confirm sign up&quot;:
        </p>
        <div className="space-y-2">
          <div className="bg-muted rounded-lg p-4 font-mono text-sm">
            <p className="text-muted-foreground text-xs mb-1"># Subject</p>
            <p>Catalyst - Confirm Account</p>
          </div>
          <div className="bg-muted rounded-lg p-4 font-mono text-sm space-y-1">
            <p className="text-muted-foreground text-xs mb-1"># Body</p>
            <p>&lt;h3&gt;Hi there,&lt;/h3&gt;</p>
            <p></p>
            <p>&lt;p&gt;Thanks for registering an account.&lt;/p&gt;</p>
            <p></p>
            <p>&lt;p&gt;Follow this link to confirm your email:&lt;/p&gt;</p>
            <p>&lt;ul&gt;</p>
            <p className="pl-4">&lt;li&gt;&lt;a href=&quot;{'{{ .ConfirmationURL }}'}&quot;&gt;Confirm Email Address&lt;/a&gt;&lt;/li&gt;</p>
            <p>&lt;/ul&gt;</p>
            <p></p>
            <p>&lt;p&gt;These are your account details:&lt;/p&gt;</p>
            <p>&lt;ul&gt;</p>
            <p className="pl-4">&lt;li&gt;Email: {'{{ .Email }}'}&lt;/li&gt;</p>
            <p className="pl-4">&lt;li&gt;App: {'{{ .SiteURL }}'}&lt;/li&gt;</p>
            <p>&lt;/ul&gt;</p>
          </div>
        </div>

        <p className="text-muted-foreground text-sm mt-3">
          Available variables: <code>{'{{ .ConfirmationURL }}'}</code>,{" "}
          <code>{'{{ .Email }}'}</code>, <code>{'{{ .SiteURL }}'}</code>,{" "}
          <code>{'{{ .Token }}'}</code>, <code>{'{{ .TokenHash }}'}</code>,{" "}
          <code>{'{{ .Data }}'}</code>, <code>{'{{ .RedirectTo }}'}</code>
        </p>
      </section>

      {/* Step 6: Optional Auth Settings */}
      <section className="space-y-4">
        <h2 className="text-xl font-medium">Step 6: Optional Auth Settings</h2>
        <p className="text-muted-foreground">
          In <strong>Authentication → Sign In / Providers</strong>, you can configure:
        </p>
        <ul className="text-muted-foreground list-inside list-disc space-y-2">
          <li>
            <strong>Allow new users to sign up</strong> — Whether new users can register via Supabase
          </li>
          <li>
            <strong>Confirm email</strong> — Enable for production, disable for
            faster dev testing
          </li>
          <li>
            <strong>Secure email change</strong> — Requires confirmation for
            email changes
          </li>
          <li>
            <strong>Password requirements</strong> — Set minimum length, complexity
          </li>
        </ul>
      </section>

      {/* Step 7: Create a Test User */}
      <section className="space-y-4">
        <h2 className="text-xl font-medium">Step 7: Create a Test User</h2>
        <p className="text-muted-foreground">
          You have two options:
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="border rounded-lg p-4 space-y-2">
            <p className="font-medium">Supabase Dashboard</p>
            <ol className="text-muted-foreground text-sm list-inside list-decimal space-y-1">
              <li>Go to <strong>Authentication → Users</strong></li>
              <li>Click <strong>Add user</strong></li>
              <li>Enter email and password</li>
              <li>User is pre-confirmed</li>
            </ol>
          </div>
          <div className="border rounded-lg p-4 space-y-2">
            <p className="font-medium">Register Page</p>
            <ol className="text-muted-foreground text-sm list-inside list-decimal space-y-1">
              <li>Start your app: <code>pnpm dev</code></li>
              <li>Go to <code>/auth/register</code></li>
              <li>Create an account</li>
              <li>Confirm via email (if enabled)</li>
            </ol>
          </div>
        </div>
      </section>

      {/* Step 8: Test the Flow */}
      <section className="space-y-4">
        <h2 className="text-xl font-medium">Step 8: Test the Flow</h2>
        <ol className="text-muted-foreground list-inside list-decimal space-y-2">
          <li>
            Start the dev server: <code className="bg-muted px-2 py-0.5 rounded text-xs">pnpm dev</code>
          </li>
          <li>
            Go to <code>/auth/login</code> — you should see the sign in form
          </li>
          <li>
            Sign in with your test user
          </li>
          <li>
            You should be redirected to <code>/app</code>
          </li>
          <li>
            Try accessing <code>/app</code> while signed out — you should be redirected to sign in
          </li>
        </ol>
      </section>

      {/* How It Works */}
      <section className="space-y-4">
        <h2 className="text-xl font-medium">How It Works</h2>
        <div className="space-y-3">
          <div className="border rounded-lg p-4">
            <p className="font-medium font-mono text-sm">/auth/login</p>
            <p className="text-muted-foreground text-sm mt-1">
              Calls <code>supabase.auth.signInWithPassword()</code>. On success,
              Supabase sets session cookies automatically.
            </p>
          </div>
          <div className="border rounded-lg p-4">
            <p className="font-medium font-mono text-sm">/auth/register</p>
            <p className="text-muted-foreground text-sm mt-1">
              Calls <code>supabase.auth.signUp()</code>. If email confirmation is enabled,
              sends email with link to <code>/api/auth/callback</code>. Otherwise, logs in immediately.
            </p>
          </div>
          <div className="border rounded-lg p-4">
            <p className="font-medium font-mono text-sm">/api/auth/callback</p>
            <p className="text-muted-foreground text-sm mt-1">
              Handles Supabase email links. Exchanges the auth code for a session
              and redirects to the app.
            </p>
          </div>
          <div className="border rounded-lg p-4">
            <p className="font-medium font-mono text-sm">proxy.ts</p>
            <p className="text-muted-foreground text-sm mt-1">
              Refreshes session on every request. Protects <code>/app/*</code> routes —
              redirects unauthenticated users to sign in.
            </p>
          </div>
          <div className="border rounded-lg p-4">
            <p className="font-medium font-mono text-sm">/auth/signout</p>
            <p className="text-muted-foreground text-sm mt-1">
              Signs out the user and clears session cookies. Redirects to sign in.
            </p>
          </div>
        </div>
      </section>

      {/* Sign Out */}
      <section className="space-y-4">
        <h2 className="text-xl font-medium">Adding a Sign Out Button</h2>
        <p className="text-muted-foreground">
          Add a sign out link anywhere in your app:
        </p>
        <div className="bg-muted rounded-lg p-4 font-mono text-sm">
          <p>&lt;a href=&quot;/auth/signout&quot;&gt;Sign out&lt;/a&gt;</p>
        </div>
        <p className="text-muted-foreground text-sm">
          Or use a Link component:
        </p>
        <div className="bg-muted rounded-lg p-4 font-mono text-sm space-y-1">
          <p>import Link from &quot;next/link&quot;</p>
          <p></p>
          <p>&lt;Link href=&quot;/auth/signout&quot;&gt;Sign out&lt;/Link&gt;</p>
        </div>
      </section>

      {/* Deployment */}
      <section className="space-y-4">
        <h2 className="text-xl font-medium">Deployment Checklist</h2>
        <ul className="text-muted-foreground list-inside list-disc space-y-2">
          <li>
            Set <code>NEXT_PUBLIC_APP_URL</code> to your production domain in
            Vercel/hosting environment variables
          </li>
          <li>
            Add your production domain to Supabase <strong>Redirect URLs</strong>
          </li>
          <li>
            Update Supabase <strong>Site URL</strong> to your production domain
          </li>
          <li>
            Enable <strong>Confirm email</strong> for production
          </li>
          <li>
            Enable <strong>Row Level Security</strong> on tables with user data (see below)
          </li>
        </ul>
      </section>

      {/* Row Level Security */}
      <section className="space-y-4">
        <h2 className="text-xl font-medium">Security: Row Level Security (RLS)</h2>
        <p className="text-muted-foreground">
          RLS controls which rows users can access in your database. Without it,
          any authenticated user can read/write all data.
        </p>

        <div className="border-l-4 border-amber-500 bg-amber-500/10 p-4 text-sm">
          <p className="font-medium text-amber-700 dark:text-amber-400">When to enable RLS</p>
          <p className="text-muted-foreground mt-1">
            <strong>POC/Development:</strong> Keep RLS off for fast iteration — you can query freely without policies.<br />
            <strong>Before Production:</strong> Enable RLS and add policies — this is a security requirement.
          </p>
        </div>

        <div className="space-y-3 mt-4">
          <p className="font-medium text-sm">Why RLS matters:</p>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="border rounded-lg p-4 border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950">
              <p className="font-medium text-sm text-red-700 dark:text-red-400">❌ Without RLS</p>
              <p className="text-muted-foreground text-xs mt-1">
                User A can query <code>SELECT * FROM posts</code> and see ALL posts from ALL users.
              </p>
            </div>
            <div className="border rounded-lg p-4 border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-950">
              <p className="font-medium text-sm text-green-700 dark:text-green-400">✓ With RLS</p>
              <p className="text-muted-foreground text-xs mt-1">
                User A can only see their own posts. The policy enforces <code>user_id = auth.uid()</code>.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-3 mt-4">
          <p className="font-medium text-sm">How to enable RLS:</p>
          <ol className="text-muted-foreground list-inside list-decimal space-y-2 text-sm">
            <li>Go to <strong>Database → Tables</strong> in Supabase dashboard</li>
            <li>Select your table (e.g., <code>posts</code>)</li>
            <li>Click <strong>RLS Disabled</strong> → <strong>Enable RLS</strong></li>
            <li>Add a policy (see examples below)</li>
          </ol>
        </div>

        <div className="space-y-3 mt-4">
          <p className="font-medium text-sm">Common policy patterns:</p>
          <div className="bg-muted rounded-lg p-4 font-mono text-xs space-y-4">
            <div>
              <p className="text-muted-foreground mb-1">-- Users can only view their own rows</p>
              <p>CREATE POLICY &quot;Users view own data&quot; ON posts</p>
              <p className="pl-4">FOR SELECT USING (auth.uid() = user_id);</p>
            </div>
            <div>
              <p className="text-muted-foreground mb-1">-- Users can insert rows for themselves</p>
              <p>CREATE POLICY &quot;Users insert own data&quot; ON posts</p>
              <p className="pl-4">FOR INSERT WITH CHECK (auth.uid() = user_id);</p>
            </div>
            <div>
              <p className="text-muted-foreground mb-1">-- Users can update/delete their own rows</p>
              <p>CREATE POLICY &quot;Users modify own data&quot; ON posts</p>
              <p className="pl-4">FOR ALL USING (auth.uid() = user_id);</p>
            </div>
            <div>
              <p className="text-muted-foreground mb-1">-- Public read, authenticated write</p>
              <p>CREATE POLICY &quot;Public read&quot; ON articles FOR SELECT USING (true);</p>
              <p>CREATE POLICY &quot;Auth write&quot; ON articles FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);</p>
            </div>
          </div>
        </div>

        <p className="text-muted-foreground text-sm mt-4">
          <strong>Tip:</strong> Supabase dashboard has a policy editor with templates.
          Go to <strong>Authentication → Policies</strong> for a visual interface.
        </p>
      </section>

      {/* Troubleshooting */}
      <section className="space-y-4">
        <h2 className="text-xl font-medium">Troubleshooting</h2>
        <div className="space-y-3">
          <div className="border-l-4 border-red-500 bg-red-500/10 p-4">
            <p className="font-medium text-sm">Email link redirects to wrong URL</p>
            <p className="text-muted-foreground text-sm mt-1">
              Check that your domain is in the <strong>Redirect URLs</strong> list
              in Supabase. Make sure <code>NEXT_PUBLIC_APP_URL</code> is set correctly.
            </p>
          </div>
          <div className="border-l-4 border-red-500 bg-red-500/10 p-4">
            <p className="font-medium text-sm">Session not persisting</p>
            <p className="text-muted-foreground text-sm mt-1">
              Ensure the middleware is running (check <code>middleware.ts</code> exists
              at project root). Check browser cookies are enabled.
            </p>
          </div>
          <div className="border-l-4 border-red-500 bg-red-500/10 p-4">
            <p className="font-medium text-sm">&quot;Invalid login credentials&quot;</p>
            <p className="text-muted-foreground text-sm mt-1">
              User may not be confirmed. Check <strong>Authentication → Users</strong>
              in Supabase dashboard. Try creating a user via the dashboard.
            </p>
          </div>
        </div>
      </section>

      {/* Back link */}
      <div className="pt-4 border-t">
        <Link
          href="/docs"
          className="text-primary text-sm hover:underline"
        >
          ← Back to Documentation
        </Link>
      </div>
    </article>
  )
}
