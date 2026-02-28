/**
 * CATALYST - Weekly Meeting with Tahir
 *
 * Agenda: Brand Templates, Meta Ads, Website Analytics, AgentCRM,
 * Videos, Ed/Prime Capital Page, Prime Private, Hiring, Weekly Focus
 */

"use client"

import "./page.css"

import { usePathname } from "next/navigation"
import {
  SlidesShell,
  Slide,
  SlideContainer,
  SlideDots,
  ScrollHint,
  usePresentationSlides,
} from "../../_surface"
import { getPresentationByPath } from "@/lib/navigation"
import {
  CalendarIcon,
  PaletteIcon,
  MegaphoneIcon,
  BarChart3Icon,
  MonitorSmartphoneIcon,
  VideoIcon,
  BuildingIcon,
  CrownIcon,
  UsersIcon,
  TargetIcon,
  CheckIcon,
  ArrowRightIcon,
  ChevronDownIcon,
  ImageIcon,
  LayoutTemplateIcon,
  FileTextIcon,
  MailIcon,
  PresentationIcon,
  BookOpenIcon,
  GlobeIcon,
  SmartphoneIcon,
  TrendingUpIcon,
  ClockIcon,
  AlertCircleIcon,
  SparklesIcon,
  BriefcaseIcon,
  DollarSignIcon,
  ShieldIcon,
  UserPlusIcon,
  MapPinIcon,
  LinkedinIcon,
  ListChecksIcon,
  SearchIcon,
  YoutubeIcon,
  GraduationCapIcon,
  NewspaperIcon,
  PlayIcon,
} from "lucide-react"

export default function TahirWeeklyMeeting() {
  const pathname = usePathname()
  const presentation = getPresentationByPath(pathname)

  const {
    containerRef,
    activeSlide,
    totalSlides,
    slideLabels,
    scrollToSlide,
  } = usePresentationSlides()

  return (
    <SlidesShell
      title={presentation?.title ?? "Weekly Meeting"}
      addendum={presentation?.addendum}
    >
      <SlideDots
        total={totalSlides}
        active={activeSlide}
        labels={slideLabels}
        onDotClick={scrollToSlide}
      />

      <SlideContainer ref={containerRef}>

        {/* ================================================================ */}
        {/* SLIDE 1: Title */}
        {/* ================================================================ */}
        <Slide
          slug="title"
          label="Title"
          className="relative overflow-hidden bg-background"
          innerClassName="items-center px-8 py-20"
        >
          <div className="present-slide__background bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/20 via-background to-background opacity-70" />
          <div className="present-blob -bottom-32 -left-32 h-96 w-96" />
          <div className="present-blob top-20 right-20 h-64 w-64 catalyst-float-b" />

          <div className="present-slide__content max-w-4xl text-center my-auto">
            <div className="mb-8">
              <div className="present-badge">
                <CalendarIcon className="h-4 w-4" />
                <span>Wednesday 26 February 2026</span>
              </div>
            </div>
            <h1 className="mb-6 text-5xl font-extrabold tracking-tighter md:text-7xl text-balance">
              Weekly <br />
              <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                Progress Update
              </span>
            </h1>
            <p className="mx-auto max-w-2xl text-xl text-muted-foreground md:text-2xl text-balance">
              Brand, Marketing, Tech & Growth
            </p>
          </div>
          {activeSlide === 0 && <ScrollHint className="animate-bounce" />}
        </Slide>

        {/* ================================================================ */}
        {/* SLIDE 2: Actions from Meeting */}
        {/* ================================================================ */}
        <Slide
          slug="meeting-actions"
          label="Actions"
          className="present-slide--tinted relative overflow-hidden"
          innerClassName="px-8 py-16"
        >
          <div className="present-slide__background bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/10 to-transparent opacity-70" />

          <div className="max-w-5xl mx-auto w-full">
            <div className="flex items-center gap-4 mb-8">
              <div className="h-12 w-1 bg-primary rounded-full" />
              <div>
                <div className="present-badge mb-2">
                  <ListChecksIcon className="h-4 w-4" />
                  <span>Meeting Actions</span>
                </div>
                <h2 className="text-3xl font-bold md:text-4xl">Actions & Decisions</h2>
                <p className="text-muted-foreground">Key outcomes from today's meeting</p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div className="present-card-glow p-5">
                <h4 className="font-bold text-sm mb-3 flex items-center gap-2 text-primary">
                  <PaletteIcon className="h-4 w-4" />
                  Brand & Templates
                </h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <ArrowRightIcon className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                    <span>Tahir to use Google Sheet to prioritise which content templates to produce first</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ArrowRightIcon className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                    <span>Add templates and guidebook to the learning hub</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ArrowRightIcon className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                    <span>Set up shared Canva & Gamma accounts for the team</span>
                  </li>
                </ul>
              </div>

              <div className="present-card-glow p-5">
                <h4 className="font-bold text-sm mb-3 flex items-center gap-2 text-primary">
                  <GraduationCapIcon className="h-4 w-4" />
                  Learning Hub Access
                </h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <ArrowRightIcon className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                    <span>All staff need access — requires <strong>@primecapitaldubai.com</strong> Google accounts</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ArrowRightIcon className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                    <span>Set up accounts for anyone who doesn't have one yet</span>
                  </li>
                </ul>
              </div>

              <div className="present-card-glow p-5">
                <h4 className="font-bold text-sm mb-3 flex items-center gap-2 text-primary">
                  <YoutubeIcon className="h-4 w-4" />
                  YouTube & Video
                </h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <ArrowRightIcon className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                    <span>YouTube: design thumbnail, trailer, CTAs in videos with links</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ArrowRightIcon className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                    <span>Harvest lessons from Ed's team — set up the process</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ArrowRightIcon className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                    <span><strong>2 project-based + 2 generic</strong> — project videos must include evergreen educational insights</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ArrowRightIcon className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                    <span>First project: <strong>House of Tenet</strong></span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ArrowRightIcon className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                    <span><strong>VidIQ</strong> — try for ideas, titles & thumbnails on our 4 videos</span>
                  </li>
                </ul>
              </div>

              <div className="present-card-glow p-5">
                <h4 className="font-bold text-sm mb-3 flex items-center gap-2 text-primary">
                  <GlobeIcon className="h-4 w-4" />
                  SEO & Marketing
                </h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <ArrowRightIcon className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                    <span>Google SEO — fix the logo appearing in Google search results</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ArrowRightIcon className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                    <span>Include Shaad Shamani podcast in the newsletter</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="present-card-glass p-4 text-center">
              <p className="text-sm text-muted-foreground">
                <CrownIcon className="inline h-4 w-4 text-primary mr-1.5 -mt-0.5" />
                <strong>Prime Private</strong> — revisit in 1 month. Focus on current priorities first.
              </p>
            </div>
          </div>
        </Slide>

        {/* ================================================================ */}
        {/* SLIDE 3: Agenda */}
        {/* ================================================================ */}
        <Slide
          slug="agenda"
          label="Agenda"
          className="present-slide--tinted relative overflow-hidden"
          innerClassName="items-center px-8 py-20"
        >
          <div className="present-slide__background bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/10 to-transparent opacity-70" />

          <div className="present-slide__content max-w-4xl w-full my-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold md:text-5xl mb-4">Today's Agenda</h2>
              <p className="text-lg text-muted-foreground">8 items to cover</p>
            </div>

            <div className="grid md:grid-cols-2 gap-3">
              <AgendaItem number={1} icon={PaletteIcon} title="Brand Template Design" subtitle="Canva, Gamma, Google Docs" />
              <AgendaItem number={2} icon={MegaphoneIcon} title="Meta Ads" subtitle="Re-optimised campaigns" />
              <AgendaItem number={3} icon={BarChart3Icon} title="Website Analytics" subtitle="Traffic & performance" />
              <AgendaItem number={4} icon={MonitorSmartphoneIcon} title="AgentCRM" subtitle="Preview, training, rollout" />
              <AgendaItem number={5} icon={VideoIcon} title="Video Content" subtitle="Script tracking & production" />
              <AgendaItem number={6} icon={BuildingIcon} title="Ed — Prime Capital Page" subtitle="Pricing update" />
              <AgendaItem number={7} icon={CrownIcon} title="Prime Private" subtitle="Upmarket strategy next steps" />
              <AgendaItem number={8} icon={UsersIcon} title="Hiring Senior Associates" subtitle="Recruitment strategy" />
            </div>
          </div>
        </Slide>

        {/* ================================================================ */}
        {/* SLIDE 3: Brand Template Design */}
        {/* ================================================================ */}
        <Slide
          slug="templates"
          label="Templates"
          className="relative overflow-hidden"
          innerClassName="px-8 py-16"
        >
          <div className="present-slide__background bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background opacity-80" />

          <div className="max-w-6xl mx-auto w-full">
            <div className="flex items-center gap-4 mb-8">
              <div className="h-12 w-1 bg-primary rounded-full" />
              <div>
                <div className="present-badge mb-2">
                  <PaletteIcon className="h-4 w-4" />
                  <span>Brand Design</span>
                </div>
                <h2 className="text-3xl font-bold md:text-4xl">Template Design Package</h2>
                <p className="text-muted-foreground">Estimated investment: $5,000–$7,500</p>
              </div>
            </div>

            <p className="text-lg text-muted-foreground mb-6 max-w-3xl">
              Design branded templates with usage guides so the team can produce
              consistent content independently going forward.
            </p>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mb-8">
              <TemplateCard icon={SmartphoneIcon} title="Social Media" items={["Instagram Carousels", "Story Templates", "Facebook/LinkedIn Banners", "YouTube Thumbnails"]} />
              <TemplateCard icon={FileTextIcon} title="Documents" items={["Company Brochure", "Property Factsheets", "Investment Proposals", "Listing Presentations"]} />
              <TemplateCard icon={MailIcon} title="Communications" items={["Newsletter Templates", "Email Signatures", "Welcome Packs", "Client Reports"]} />
              <TemplateCard icon={PresentationIcon} title="Presentations" items={["Pitch Decks", "Market Reports", "Investor Briefings", "Meeting Agendas"]} />
              <TemplateCard icon={ImageIcon} title="Marketing" items={["Property Flyers", "Event Invitations", "Open House Materials", "Market Update Cards"]} />
              <TemplateCard icon={GlobeIcon} title="Digital Ads" items={["Meta Ad Creatives", "Google Display Ads", "Retargeting Banners", "Portal Listings"]} />
              <TemplateCard icon={BookOpenIcon} title="Guides" items={["Area Guides", "Golden Visa Guide", "Investor Guides", "Buyer Handbooks"]} />
              <TemplateCard icon={LayoutTemplateIcon} title="Internal" items={["Onboarding Docs", "Team Playbooks", "Brand Guidelines", "SOPs & Checklists"]} />
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div className="present-card-glow p-4 text-center">
                <h4 className="font-bold text-primary mb-1">Canva</h4>
                <p className="text-sm text-muted-foreground">Social, flyers, marketing materials — team self-serve</p>
              </div>
              <div className="present-card-glow p-4 text-center">
                <h4 className="font-bold text-primary mb-1">Gamma</h4>
                <p className="text-sm text-muted-foreground">Presentations, proposals, investor docs</p>
              </div>
              <div className="present-card-glow p-4 text-center">
                <h4 className="font-bold text-primary mb-1">Google Docs</h4>
                <p className="text-sm text-muted-foreground">Reports, internal docs, shared editing</p>
              </div>
            </div>

            <div className="h-4" />
          </div>
        </Slide>

        {/* ================================================================ */}
        {/* SLIDE 4: Meta Ads */}
        {/* ================================================================ */}
        <Slide
          slug="meta-ads"
          label="Meta Ads"
          className="present-slide--tinted relative overflow-hidden"
          innerClassName="items-center px-8 py-20"
        >
          <div className="present-slide__background bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/10 to-transparent opacity-70" />

          <div className="present-slide__content max-w-4xl w-full my-auto">
            <div className="text-center mb-12">
              <div className="present-badge mb-4">
                <MegaphoneIcon className="h-4 w-4" />
                <span>Paid Media</span>
              </div>
              <h2 className="text-4xl font-bold md:text-5xl mb-4">Meta Ads</h2>
              <p className="text-xl text-muted-foreground">Flagged issue resolved — campaigns running</p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="present-card-glow p-8">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <CheckIcon className="h-5 w-5 text-green-500" />
                  What Happened
                </h3>
                <ul className="space-y-3 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <ArrowRightIcon className="h-4 w-4 text-primary mt-1 shrink-0" />
                    <span>Meta flagged an issue with the account</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ArrowRightIcon className="h-4 w-4 text-primary mt-1 shrink-0" />
                    <span>Issue has been addressed and resolved</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ArrowRightIcon className="h-4 w-4 text-primary mt-1 shrink-0" />
                    <span>No changes to targeting or creative</span>
                  </li>
                </ul>
              </div>
              <div className="present-card-glow p-8">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <TrendingUpIcon className="h-5 w-5 text-primary" />
                  Current Status
                </h3>
                <ul className="space-y-3 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <ArrowRightIcon className="h-4 w-4 text-primary mt-1 shrink-0" />
                    <span>Campaigns back up and running as before</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ArrowRightIcon className="h-4 w-4 text-primary mt-1 shrink-0" />
                    <span>Same targeting and creative in place</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ArrowRightIcon className="h-4 w-4 text-primary mt-1 shrink-0" />
                    <span>Continue monitoring performance</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </Slide>

        {/* ================================================================ */}
        {/* SLIDE 5: Website Analytics */}
        {/* ================================================================ */}
        <Slide
          slug="analytics"
          label="Analytics"
          className="relative overflow-hidden"
          innerClassName="items-center px-8 py-20"
        >
          <div className="present-slide__background bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background opacity-80" />

          <div className="present-slide__content max-w-5xl w-full my-auto">
            <div className="text-center mb-12">
              <div className="present-badge mb-4">
                <BarChart3Icon className="h-4 w-4" />
                <span>Website Performance</span>
              </div>
              <h2 className="text-4xl font-bold md:text-5xl mb-4">Prime Capital Website</h2>
              <p className="text-lg text-muted-foreground">February 2026 — strong growth across all metrics</p>
            </div>

            <div className="grid grid-cols-3 gap-6 mb-10">
              <div className="stat-highlight">
                <span className="text-4xl font-bold text-primary">416</span>
                <span className="text-sm text-muted-foreground">Visitors</span>
                <span className="text-xs font-semibold text-green-500">+995%</span>
              </div>
              <div className="stat-highlight">
                <span className="text-4xl font-bold text-primary">1,615</span>
                <span className="text-sm text-muted-foreground">Page Views</span>
                <span className="text-xs font-semibold text-green-500">+301%</span>
              </div>
              <div className="stat-highlight">
                <span className="text-4xl font-bold text-primary">40%</span>
                <span className="text-sm text-muted-foreground">Bounce Rate</span>
                <span className="text-xs font-semibold text-red-400">+27%</span>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="present-card-glow p-6">
                <h4 className="font-bold mb-3 flex items-center gap-2">
                  <MapPinIcon className="h-4 w-4 text-primary" />
                  Top Countries
                </h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex justify-between"><span>UAE</span><span className="font-semibold">48%</span></li>
                  <li className="flex justify-between"><span>India</span><span className="font-semibold">19%</span></li>
                  <li className="flex justify-between"><span>United States</span><span className="font-semibold">9%</span></li>
                  <li className="flex justify-between"><span>New Zealand</span><span className="font-semibold">3%</span></li>
                  <li className="flex justify-between"><span>Ireland</span><span className="font-semibold">2%</span></li>
                </ul>
              </div>
              <div className="present-card-glow p-6">
                <h4 className="font-bold mb-3 flex items-center gap-2">
                  <SmartphoneIcon className="h-4 w-4 text-primary" />
                  Devices
                </h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex justify-between"><span>Mobile</span><span className="font-semibold">50%</span></li>
                  <li className="flex justify-between"><span>Desktop</span><span className="font-semibold">49%</span></li>
                  <li className="flex justify-between"><span>Tablet</span><span className="font-semibold">1%</span></li>
                </ul>
              </div>
              <div className="present-card-glow p-6">
                <h4 className="font-bold mb-3 flex items-center gap-2">
                  <GlobeIcon className="h-4 w-4 text-primary" />
                  Operating Systems
                </h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex justify-between"><span>iOS</span><span className="font-semibold">31%</span></li>
                  <li className="flex justify-between"><span>Mac</span><span className="font-semibold">25%</span></li>
                  <li className="flex justify-between"><span>Windows</span><span className="font-semibold">22%</span></li>
                  <li className="flex justify-between"><span>Android</span><span className="font-semibold">20%</span></li>
                </ul>
              </div>
            </div>

            <div className="mt-8 text-center">
              <p className="text-muted-foreground">New photos coming soon to refresh content</p>
            </div>
          </div>
        </Slide>

        {/* ================================================================ */}
        {/* SLIDE 6: AgentCRM */}
        {/* ================================================================ */}
        <Slide
          slug="agentcrm"
          label="AgentCRM"
          className="present-slide--tinted relative overflow-hidden"
          innerClassName="items-center px-8 py-20"
        >
          <div className="present-slide__background bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/10 to-transparent opacity-70" />

          <div className="present-slide__content max-w-4xl w-full my-auto">
            <div className="text-center mb-12">
              <div className="present-badge mb-4">
                <MonitorSmartphoneIcon className="h-4 w-4" />
                <span>Technology</span>
              </div>
              <h2 className="text-4xl font-bold md:text-5xl mb-4">AgentCRM Rollout</h2>
              <p className="text-xl text-muted-foreground">Phased rollout — change management is key</p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 mb-10">
              <div className="timeline-step">
                <div className="step-dot" />
                <div className="present-card-glow p-6">
                  <h4 className="font-bold text-lg mb-2">Mid-March</h4>
                  <p className="text-sm text-muted-foreground mb-3">Team Preview</p>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <CheckIcon className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                      <span>Demo to the full team</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckIcon className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                      <span>Initial feedback & questions</span>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="timeline-step">
                <div className="step-dot" />
                <div className="present-card-glow p-6">
                  <h4 className="font-bold text-lg mb-2">Late March</h4>
                  <p className="text-sm text-muted-foreground mb-3">Training Phase</p>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <CheckIcon className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                      <span>Hands-on training sessions</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckIcon className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                      <span>Side-by-side with current tools</span>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="timeline-step">
                <div className="step-dot" />
                <div className="present-card-glow p-6">
                  <h4 className="font-bold text-lg mb-2">End of March</h4>
                  <p className="text-sm text-muted-foreground mb-3">Full Crossover</p>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <CheckIcon className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                      <span>Switch to AgentCRM</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckIcon className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                      <span>Support & troubleshooting</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="present-card-glass p-6 text-center">
              <p className="text-lg">
                <AlertCircleIcon className="inline h-5 w-5 text-amber-500 mr-2 -mt-0.5" />
                <strong>Change management is critical</strong> — we don't want to lose anyone along the way.
                Gradual rollout ensures everyone is comfortable before the full switch.
              </p>
            </div>
          </div>
        </Slide>

        {/* ================================================================ */}
        {/* SLIDE 7: Videos & Ed */}
        {/* ================================================================ */}
        <Slide
          slug="videos"
          label="Videos & Ed"
          className="relative overflow-hidden"
          innerClassName="items-center px-8 py-20"
        >
          <div className="present-slide__background bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background opacity-80" />

          <div className="present-slide__content max-w-4xl w-full my-auto">
            <div className="grid md:grid-cols-2 gap-10">
              {/* Video Content */}
              <div>
                <div className="present-badge mb-4">
                  <VideoIcon className="h-4 w-4" />
                  <span>Content</span>
                </div>
                <h2 className="text-3xl font-bold mb-4">Video Production</h2>
                <p className="text-muted-foreground mb-6">
                  Tracking scripts and production via shared Google Sheet.
                </p>

                <div className="present-card-glow p-6 mb-4">
                  <h4 className="font-bold mb-3">Video Process</h4>
                  <ul className="space-y-3 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <SparklesIcon className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                      <span>Harvest lessons from Ed's team and set up the process</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <PlayIcon className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                      <span><strong>2 project-based</strong> + <strong>2 generic</strong> videos</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <GraduationCapIcon className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                      <span>Project videos must include evergreen educational insights — e.g. "when you see this in a project, this is why it's important"</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <BuildingIcon className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                      <span>First project: <strong>House of Tenet</strong></span>
                    </li>
                  </ul>
                </div>

                <div className="present-card-glow p-6 mb-4">
                  <h4 className="font-bold mb-3 flex items-center gap-2">
                    <YoutubeIcon className="h-5 w-5 text-red-500" />
                    YouTube Setup
                  </h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <ArrowRightIcon className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                      <span>Design channel thumbnail & branding</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <ArrowRightIcon className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                      <span>Create channel trailer</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <ArrowRightIcon className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                      <span>CTAs in all videos with links</span>
                    </li>
                  </ul>
                </div>

                <a
                  href="https://docs.google.com/spreadsheets/d/1rTsbo5LkXxRloMcU3sjWQ2J3yG7_I_JeCSdWxFgIB8g/edit?usp=sharing"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="present-card-glass p-4 flex items-center gap-2 hover:border-primary/50 transition-colors"
                >
                  <FileTextIcon className="h-4 w-4 text-primary shrink-0" />
                  <p className="text-xs text-primary font-medium underline underline-offset-2">
                    Open Video Scripts Tracker
                  </p>
                  <ArrowRightIcon className="h-3 w-3 text-primary shrink-0 ml-auto" />
                </a>
              </div>

              {/* Ed / Prime Capital Page */}
              <div>
                <div className="present-badge mb-4">
                  <BuildingIcon className="h-4 w-4" />
                  <span>Ed Update</span>
                </div>
                <h2 className="text-3xl font-bold mb-4">Prime Capital Page</h2>
                <p className="text-muted-foreground mb-6">
                  Waiting on pricing from Ed's team.
                </p>

                <div className="present-card-glow p-6">
                  <h4 className="font-bold mb-3 flex items-center gap-2">
                    <ClockIcon className="h-5 w-5 text-amber-500" />
                    Status: Awaiting Pricing
                  </h4>
                  <ul className="space-y-3 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <ArrowRightIcon className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                      <span>No pricing received yet</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <ArrowRightIcon className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                      <span>Follow up with Ed this week</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <ArrowRightIcon className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                      <span>Need pricing to make a decision and move forward</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </Slide>

        {/* ================================================================ */}
        {/* SLIDE 8: Prime Private */}
        {/* ================================================================ */}
        <Slide
          slug="prime-private"
          label="Prime Private"
          className="present-slide--tinted relative overflow-hidden"
          innerClassName="px-8 py-16"
        >
          <div className="present-slide__background bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/10 to-transparent opacity-70" />
          <div className="present-blob top-20 right-20 h-64 w-64 catalyst-float-a" />

          <div className="max-w-5xl mx-auto w-full">
            <div className="flex items-center gap-4 mb-8">
              <div className="h-12 w-1 bg-primary rounded-full" />
              <div>
                <div className="present-badge mb-2">
                  <CrownIcon className="h-4 w-4" />
                  <span>Growth Strategy</span>
                </div>
                <h2 className="text-3xl font-bold md:text-4xl">Prime Private — Moving Upmarket</h2>
                <p className="text-muted-foreground">Attracting $5–10M investors</p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div className="present-card-glow p-6">
                <h4 className="font-bold text-lg mb-3 flex items-center gap-2">
                  <TargetIcon className="h-5 w-5 text-primary" />
                  The Opportunity
                </h4>
                <p className="text-sm text-muted-foreground mb-4">
                  3 clients at $7M average = similar revenue to 10 clients at $2M — fewer clients, deeper relationships, better margins.
                </p>
                <div className="grid grid-cols-2 gap-3 text-center text-sm">
                  <div className="bg-muted/50 rounded-lg p-3">
                    <div className="font-bold text-lg">$1–3M</div>
                    <div className="text-muted-foreground">Current</div>
                  </div>
                  <div className="bg-primary/10 rounded-lg p-3 border border-primary/20">
                    <div className="font-bold text-lg text-primary">$5–10M</div>
                    <div className="text-muted-foreground">Target</div>
                  </div>
                </div>
              </div>

              <div className="present-card-glow p-6">
                <h4 className="font-bold text-lg mb-3 flex items-center gap-2">
                  <SparklesIcon className="h-5 w-5 text-primary" />
                  Core Insight
                </h4>
                <p className="text-sm text-muted-foreground mb-3">
                  $5–10M clients come through <strong>intermediaries they trust</strong> — wealth advisors, tax consultants, lawyers, peers.
                </p>
                <p className="text-sm text-muted-foreground">
                  Strategy focuses on becoming the firm these intermediaries recommend.
                </p>
              </div>
            </div>

            <div className="present-card-glass p-6 mb-6">
              <h4 className="font-bold text-lg mb-4">90-Day Action Plan</h4>
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <h5 className="font-semibold text-primary text-sm mb-2">Weeks 1–4: Foundation</h5>
                  <ul className="space-y-1 text-xs text-muted-foreground">
                    <li>Build intermediary partner pack</li>
                    <li>Create anonymised case studies</li>
                    <li className="line-through opacity-60">Add Investor Advisory to website</li>
                    <li>Draft quarterly market report</li>
                  </ul>
                  <p className="text-[10px] text-green-500 font-semibold mt-1">Investor Advisory page — live</p>
                </div>
                <div>
                  <h5 className="font-semibold text-primary text-sm mb-2">Weeks 5–8: Outreach</h5>
                  <ul className="space-y-1 text-xs text-muted-foreground">
                    <li>Identify 20 target intermediaries</li>
                    <li>Personal outreach to top 5</li>
                    <li>Publish first market report</li>
                    <li>LinkedIn content cadence (2x/week)</li>
                  </ul>
                </div>
                <div>
                  <h5 className="font-semibold text-primary text-sm mb-2">Weeks 9–12: Accelerate</h5>
                  <ul className="space-y-1 text-xs text-muted-foreground">
                    <li>Host investor roundtable (10–15)</li>
                    <li>Follow up all intermediaries</li>
                    <li>Assess channel traction</li>
                    <li>Refine based on feedback</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="present-card-glass p-6 text-center">
              <p className="text-lg">
                <ClockIcon className="inline h-5 w-5 text-amber-500 mr-2 -mt-0.5" />
                <strong>Revisit in 1 month.</strong> Investor Advisory page is live — focus on current priorities first, then activate this channel.
              </p>
            </div>
            <div className="h-4" />
          </div>
        </Slide>

        {/* ================================================================ */}
        {/* SLIDE 9: Hiring */}
        {/* ================================================================ */}
        <Slide
          slug="hiring"
          label="Hiring"
          className="relative overflow-hidden"
          innerClassName="px-8 py-16"
        >
          <div className="present-slide__background bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background opacity-80" />

          <div className="max-w-5xl mx-auto w-full">
            <div className="flex items-center gap-4 mb-8">
              <div className="h-12 w-1 bg-primary rounded-full" />
              <div>
                <div className="present-badge mb-2">
                  <UsersIcon className="h-4 w-4" />
                  <span>Team Growth</span>
                </div>
                <h2 className="text-3xl font-bold md:text-4xl">Hiring Senior Associates</h2>
                <p className="text-muted-foreground">2–3 hires. Invitation-based. Not a job listing.</p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div className="present-card-glow p-6">
                <h4 className="font-bold text-lg mb-3">The Profile</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <BriefcaseIcon className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                    <span>5–8 years Dubai real estate</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <DollarSignIcon className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                    <span>Strong personal revenue track record</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ShieldIcon className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                    <span>Professional, discreet, client-first</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <UserPlusIcon className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                    <span>Wants autonomy + team building</span>
                  </li>
                </ul>
              </div>

              <div className="present-card-glow p-6">
                <h4 className="font-bold text-lg mb-3">The Proposition</h4>
                <p className="text-sm text-muted-foreground italic mb-3">
                  "We've built the infrastructure and the brand. We're looking for someone who wants to build their own operation inside that."
                </p>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2"><CheckIcon className="h-4 w-4 text-green-500 shrink-0" /> Own book of business</li>
                  <li className="flex items-center gap-2"><CheckIcon className="h-4 w-4 text-green-500 shrink-0" /> Build own team</li>
                  <li className="flex items-center gap-2"><CheckIcon className="h-4 w-4 text-green-500 shrink-0" /> Dedicated marketing budget</li>
                  <li className="flex items-center gap-2"><CheckIcon className="h-4 w-4 text-green-500 shrink-0" /> Full operational support</li>
                </ul>
              </div>
            </div>

            <div className="present-card-glass p-6 mb-6">
              <h4 className="font-bold text-lg mb-3 flex items-center gap-2">
                <AlertCircleIcon className="h-5 w-5 text-amber-500" />
                Why Not Recruiters?
              </h4>
              <div className="grid md:grid-cols-3 gap-4 text-sm text-muted-foreground">
                <div className="flex items-start gap-2">
                  <ArrowRightIcon className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                  <span><strong>Volume game</strong> — recruiters optimise for quantity, not the calibre of person we need</span>
                </div>
                <div className="flex items-start gap-2">
                  <ArrowRightIcon className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                  <span><strong>No brand alignment</strong> — can't assess cultural fit or long-term vision alignment</span>
                </div>
                <div className="flex items-start gap-2">
                  <ArrowRightIcon className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                  <span><strong>High cost, low signal</strong> — fees don't match ROI for an invitation-based hire</span>
                </div>
              </div>
            </div>

            <div className="present-card-glow p-6 mb-6">
              <h4 className="font-bold text-lg mb-4">Priority Channels</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="text-center p-3 rounded-lg bg-primary/5 border border-primary/10">
                  <UsersIcon className="h-5 w-5 text-primary mx-auto mb-1" />
                  <p className="text-xs font-semibold">Personal Network</p>
                  <p className="text-xs text-muted-foreground">Highest value</p>
                </div>
                <div className="text-center p-3 rounded-lg bg-primary/5 border border-primary/10">
                  <BuildingIcon className="h-5 w-5 text-primary mx-auto mb-1" />
                  <p className="text-xs font-semibold">Developer Referrals</p>
                  <p className="text-xs text-muted-foreground">Quality signal</p>
                </div>
                <div className="text-center p-3 rounded-lg bg-primary/5 border border-primary/10">
                  <LinkedinIcon className="h-5 w-5 text-primary mx-auto mb-1" />
                  <p className="text-xs font-semibold">LinkedIn DMs</p>
                  <p className="text-xs text-muted-foreground">Extended reach</p>
                </div>
                <div className="text-center p-3 rounded-lg bg-primary/5 border border-primary/10">
                  <VideoIcon className="h-5 w-5 text-primary mx-auto mb-1" />
                  <p className="text-xs font-semibold">Content Signal</p>
                  <p className="text-xs text-muted-foreground">Passive credibility</p>
                </div>
              </div>
            </div>

            <div className="present-card-glass p-6">
              <h4 className="font-bold text-lg mb-4 flex items-center gap-2">
                <TargetIcon className="h-5 w-5 text-primary" />
                Tahir's Engagement Roadmap
              </h4>
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <h5 className="font-semibold text-primary text-sm mb-2">Week 1–2: Build the List</h5>
                  <ul className="space-y-1 text-xs text-muted-foreground">
                    <li>Shortlist 10–15 names from personal network</li>
                    <li>Ask developers for referrals</li>
                    <li>LinkedIn research — identify strong profiles</li>
                  </ul>
                </div>
                <div>
                  <h5 className="font-semibold text-primary text-sm mb-2">Week 3–4: Open Conversations</h5>
                  <ul className="space-y-1 text-xs text-muted-foreground">
                    <li>Coffee meetings with top 5 candidates</li>
                    <li>Share the proposition — not a job offer</li>
                    <li>Gauge interest and cultural fit</li>
                  </ul>
                </div>
                <div>
                  <h5 className="font-semibold text-primary text-sm mb-2">Week 5–6: Close & Onboard</h5>
                  <ul className="space-y-1 text-xs text-muted-foreground">
                    <li>Make invitations to top 2–3</li>
                    <li>Agree terms and start dates</li>
                    <li>Begin onboarding with CRM & brand toolkit</li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="h-4" />
          </div>
        </Slide>

        {/* ================================================================ */}
        {/* SLIDE 10: Weekly Focus & Actions */}
        {/* ================================================================ */}
        <Slide
          slug="actions"
          label="Actions"
          className="present-slide--tinted relative overflow-hidden"
          innerClassName="items-center px-8 py-20"
        >
          <div className="present-slide__background bg-[radial-gradient(circle_800px_at_50%_200px,var(--tw-gradient-stops))] from-primary/20 via-background to-transparent" />

          <div className="present-slide__content max-w-4xl w-full my-auto">
            <div className="text-center mb-12">
              <div className="present-badge mb-4">
                <TargetIcon className="h-4 w-4" />
                <span>This Week</span>
              </div>
              <h2 className="text-4xl font-bold md:text-5xl mb-4">Focus & Actions</h2>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <ActionItem priority="high" title="Prioritise content templates via Google Sheet" owner="Tahir" />
              <ActionItem priority="high" title="Set up @primecapitaldubai.com accounts for all staff" owner="Tahir" />
              <ActionItem priority="high" title="Set up shared Canva & Gamma accounts" owner="Tim" />
              <ActionItem priority="high" title="Add templates & guidebook to learning hub" owner="Tim" />
              <ActionItem priority="high" title="Fix Google logo in search results (SEO)" owner="Tim" />
              <ActionItem priority="high" title="Include Shaad Shamani podcast in newsletter" owner="Tim" />
              <ActionItem priority="medium" title="YouTube: thumbnail, trailer, CTAs with links" owner="Tim" />
              <ActionItem priority="medium" title="Set up video process — 2 project + 2 generic (House of Tenet first)" owner="Tahir" />
              <ActionItem priority="medium" title="Follow up with Ed on pricing" owner="Tahir" />
              <ActionItem priority="medium" title="Begin hiring shortlist (10–15 names)" owner="Tahir" />
              <ActionItem priority="medium" title="Prepare AgentCRM demo for mid-March" owner="Tim" />
              <ActionItem priority="low" title="Prime Private — revisit in 1 month" owner="Tahir" />
            </div>

            <div className="mt-10 text-center">
              <p className="text-muted-foreground text-lg">
                What else should we prioritise this week?
              </p>
            </div>
          </div>
        </Slide>

      </SlideContainer>
    </SlidesShell>
  )
}

// -----------------------------------------------------------------------------
// Supporting Components
// -----------------------------------------------------------------------------

function AgendaItem({
  number,
  icon: Icon,
  title,
  subtitle,
}: {
  number: number
  icon: React.ElementType
  title: string
  subtitle: string
}) {
  return (
    <div className="agenda-item">
      <div className="present-icon sm rounded-full shrink-0 text-sm font-bold">{number}</div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <Icon className="h-4 w-4 text-primary shrink-0" />
          <h4 className="font-semibold truncate">{title}</h4>
        </div>
        <p className="text-sm text-muted-foreground">{subtitle}</p>
      </div>
    </div>
  )
}

function TemplateCard({
  icon: Icon,
  title,
  items,
}: {
  icon: React.ElementType
  title: string
  items: string[]
}) {
  return (
    <div className="template-card">
      <div className="flex items-center gap-2 mb-1">
        <Icon className="h-4 w-4 text-primary shrink-0" />
        <h4 className="font-semibold text-sm">{title}</h4>
      </div>
      <ul className="space-y-0.5">
        {items.map((item) => (
          <li key={item} className="text-xs text-muted-foreground flex items-center gap-1.5">
            <CheckIcon className="h-3 w-3 text-primary/50 shrink-0" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  )
}

function ActionItem({
  priority,
  title,
  owner,
}: {
  priority: "high" | "medium" | "low"
  title: string
  owner: string
}) {
  const colors = {
    high: "bg-red-500/10 border-red-500/20 text-red-500",
    medium: "bg-amber-500/10 border-amber-500/20 text-amber-500",
    low: "bg-blue-500/10 border-blue-500/20 text-blue-500",
  }

  return (
    <div className="present-card-glow p-4 flex items-start gap-3">
      <div className={`shrink-0 px-2 py-0.5 rounded-full text-xs font-semibold border ${colors[priority]}`}>
        {priority}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium">{title}</p>
        <p className="text-xs text-muted-foreground">{owner}</p>
      </div>
    </div>
  )
}
