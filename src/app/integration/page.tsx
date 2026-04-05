import type { Metadata } from "next";
import { WidgetSlot } from "@/components/widget-slot";

export const metadata: Metadata = {
  title: "Integration & widgets",
  description:
    "How to embed SaaS widgets, call the QR API from your product, and map multi-tenant colour profiles.",
};

export default function IntegrationPage() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:max-w-4xl">
      <header className="border-b border-zinc-200 pb-10 dark:border-zinc-800">
        <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          Integration guide for SaaS and widget ecosystems
        </h1>
        <p className="mt-4 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
          This document is intentionally long. Product, marketing, and solutions engineering teams
          often need enough on-page context to justify dropping another third-party script or iframe
          into an approved layout. The sections below mix API reference material with narrative
          guidance so you can paste excerpts into Notion, Confluence, or your own docs portal without
          rewriting tone or structure.
        </p>
      </header>

      <div className="mt-10 space-y-14 text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
        <section id="widget-philosophy" data-doc-section="widget-philosophy">
          <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
            Philosophy: composable surfaces
          </h2>
          <p className="mt-4">
            A mature SaaS stack rarely keeps every capability in-house. You might use Stripe for
            payments, Segment for event routing, Datadog for observability, and a dedicated customer
            success platform for health scores. Each vendor ships a JavaScript snippet or React wrapper
            that expects a stable container. QR Brand Studio reserves multiple labelled regions so you
            can mount those tools without forking the UI every quarter.
          </p>
          <p className="mt-4">
            When planning your embed strategy, document which environments load which widgets. For
            example, you might enable a verbose analytics beacon only in production, while staging uses
            a lightweight placeholder. The{" "}
            <code className="rounded bg-zinc-200 px-1 text-xs dark:bg-zinc-800">data-widget-region</code>{" "}
            attributes are stable contracts: treat breaking them like breaking semver for internal
            integrators.
          </p>
        </section>

        <WidgetSlot
          id="widget-integration-toolbar"
          title="Toolbar / quick actions"
          description="Suitable for Algolia DocSearch, Command+K palettes, or a universal “Contact sales” launcher. Keep max height constrained in your CSS so the article column remains readable."
          data-widget-kind="toolbar"
        />

        <section id="api-customers" data-doc-section="api-customers">
          <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
            Customer profiles and multi-tenancy
          </h2>
          <p className="mt-4">
            In a B2B2C scenario, your “customer” might be a retailer, a franchisee, or an agency
            managing dozens of sub-brands. Each logical tenant should map to one row in the Customer
            table. The slug field is unique and URL-safe; if you omit it at creation time, the server
            derives one from the display name and appends numeric suffixes when collisions occur.
          </p>
          <p className="mt-4">
            Colour values must be hexadecimal strings with a leading hash. Three-digit shorthand,
            six-digit sRGB, and eight-digit values with alpha are accepted by the validator. High
            contrast between module and background colours improves scan reliability on low-end
            cameras; warn users in your own UI if their choices fall below WCAG contrast guidelines,
            even though the encoder itself does not block low-contrast pairs.
          </p>
          <p className="mt-4">
            Updating colours is a PATCH away. Many teams trigger this from a “Brand settings” screen
            inside their admin console. Because QR codes are static bitmaps or vectors at export time,
            remind customers that previously printed materials will not magically update—only newly
            generated assets pick up the revised palette.
          </p>
        </section>

        <section id="api-qr" data-doc-section="api-qr">
          <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
            Generating images server-side
          </h2>
          <p className="mt-4">
            POST /api/qr with a JSON body. Required fields are content (the string to encode),
            darkColor, lightColor, and format unless you supply customerId. When customerId is
            present, the server loads stored colours and ignores any colour fields you might still
            send—this prevents accidental drift between your database of record and the rendered
            output.
          </p>
          <p className="mt-4">
            Width is optional and clamped between 128 and 2048 pixels for PNG output. SVG responses
            scale vectorially; width still influences the viewBox sizing. Error correction defaults to
            M; choose H when the code will appear on outdoor signage or when you expect partial
            occlusion from stickers or logos in the center (this app does not render logo overlays
            yet, but higher correction leaves room for future composition pipelines).
          </p>
          <p className="mt-4">
            From your backend worker, treat the response as an opaque binary stream. Store it in
            object storage, attach it to transactional email, or return a signed URL to the browser.
            If you expose the endpoint publicly, add authentication and rate limiting in front—this
            template deliberately keeps the route simple for clarity.
          </p>
        </section>

        <WidgetSlot
          id="widget-integration-analytics"
          title="In-page analytics or heatmaps"
          description="Use for Hotjar, FullStory, or LogRocket session capture disclaimers paired with UI. Some teams pair this slot with a collapsible “Privacy” note managed by their CMP."
          data-widget-kind="analytics"
        />

        <section id="billing-widgets" data-doc-section="billing-widgets">
          <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
            Billing, quotas, and upgrade paths
          </h2>
          <p className="mt-4">
            Even if this repository does not implement metering, your commercial product probably
            will. Common patterns include counting QR generations per month, limiting the number of
            active customer profiles on lower tiers, or charging for higher error-correction levels
            that produce denser modules. Whatever logic you add, keep the enforcement on the server.
            Client-side checks improve UX but must never be authoritative.
          </p>
          <p className="mt-4">
            Many SaaS companies embed Stripe Customer Portal or Chargebee drop-ins beside technical
            documentation so account administrators can self-serve. The footer of this application
            exposes another hook, <code className="rounded bg-zinc-200 px-1 text-xs dark:bg-zinc-800">#footer-widget-slot</code>
            , suitable for trust badges or a compact subscription management iframe. If your legal
            team requires explicit consent before loading finance-related scripts, gate the mount with
            the same mechanism you use for marketing cookies.
          </p>
          <p className="mt-4">
            When you announce new limits, update both this integration narrative and your public
            changelog. Long-form pages reduce support tickets because customers can forward a single
            URL to their security reviewers instead of piecing together Slack threads.
          </p>
        </section>

        <section id="security-review" data-doc-section="security-review">
          <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
            Security review checklist
          </h2>
          <p className="mt-4">
            Security teams frequently ask how user-supplied strings flow through the system. The QR
            content field allows up to 4096 characters—enough for complex Wi-Fi configurations or
            signed deep links. That string is passed to the encoder library on the server; it is not
            interpreted as HTML. Still, if you display the same string elsewhere in your product,
            apply your standard escaping rules to prevent cross-site scripting in a different
            context.
          </p>
          <p className="mt-4">
            Database credentials belong in environment variables. Rotate them on the same schedule as
            your other application secrets. For PostgreSQL, enable TLS to the instance and restrict
            network access to your application subnets. SQLite is appropriate for demos and
            single-tenant appliances, not for horizontally scaled web fleets.
          </p>
        </section>

        <WidgetSlot
          id="widget-integration-nps"
          title="Feedback or NPS"
          description="Wootric, Delighted, or custom micro-surveys fit here. Delay mounting until scroll depth or time-on-page thresholds fire so you do not interrupt readers who came only for the API tables."
          data-widget-kind="feedback"
        />

        <section id="observability" data-doc-section="observability">
          <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
            Observability and on-call
          </h2>
          <p className="mt-4">
            Wire your synthetic monitors to hit /api/health on a short interval. The handler performs
            a trivial database query; if it fails, return a 503 so load balancers can pull unhealthy
            instances from rotation. Combine that signal with application traces around POST /api/qr
            to catch regressions when upgrading the encoder dependency.
          </p>
          <p className="mt-4">
            Log structured fields such as customerId, output format, and duration. Avoid logging full
            QR payloads if they may contain personally identifiable information or one-time tokens.
            Instead, log a salted hash or an internal job identifier that your support team can
            correlate with back-office tools.
          </p>
        </section>

        <section id="roadmap-copy" data-doc-section="roadmap-copy">
          <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
            Extending the template
          </h2>
          <p className="mt-4">
            Likely next steps include authenticated routes, organization-level scoping, batch CSV
            import for customer colours, and template presets for Wi-Fi, vCard, and SMS schemes. Each
            feature should extend the API first, then surface controls in the studio. Maintaining
            parity between programmatic and interactive paths prevents enterprise buyers from
            discovering gaps during a proof of concept.
          </p>
          <p className="mt-4">
            If you ship a white-label mobile app, expose the same customer slugs through your GraphQL
            or REST gateway so mobile clients can fetch palette tokens alongside other brand assets.
            Consistency across touchpoints reinforces trust, especially when the QR code is the bridge
            between offline and online experiences.
          </p>
        </section>
      </div>
    </article>
  );
}
