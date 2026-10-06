export interface SamplePreset {
  id: string;
  name: string;
  role: string;
  badge: string;
  fileName: string;
  resumeText: string;
  jobDescription: string;
}

export const SAMPLE_PRESETS: SamplePreset[] = [
  {
    id: 'product-manager',
    name: 'Alex Rivera',
    role: 'Senior Product Manager (B2B SaaS / AI)',
    badge: 'Tech & AI SaaS',
    fileName: 'Alex_Rivera_Resume_PM.pdf',
    resumeText: `ALEX RIVERA
San Francisco, CA | alex.rivera@email.com | linkedin.com/in/alexrivera-pm

PROFESSIONAL SUMMARY
Experienced Product Manager with 7+ years of experience managing software products. Passionate about user experience, agile development, and cross-functional leadership. Looking for a high-growth role to leverage my product skills.

WORK EXPERIENCE
Senior Product Manager | CloudFlow Systems | 2021 – Present
• Responsible for the roadmap and product strategy for the core cloud workflow automation platform.
• Managed a team of 12 engineers and 2 UX designers using Agile Scrum ceremonies.
• Launched new AI-powered document classification feature to enterprise clients.
• Worked closely with customer success and sales teams to gather feedback and prioritize bug tickets.
• Conducted user interviews and weekly sprint planning sessions.

Product Manager | DataMesh Technologies | 2018 – 2021
• Assisted with the development of enterprise analytics dashboards.
• Wrote user stories, PRDs, and acceptance criteria for engineering teams.
• Coordinated with marketing for go-to-market feature releases.
• Handled customer escalations and feature requests from tier-1 accounts.

Associate Product Manager | VentureApp Studio | 2017 – 2018
• Participated in QA testing, competitive analysis, and backlog refinement.
• Monitored daily active users and funnel drop-off metrics in Mixpanel.

EDUCATION
B.S. in Computer Science & Business Management
University of California, Davis | Graduated 2017

SKILLS
Product Management, Agile / Scrum, JIRA, Product Roadmap, User Stories, Figma, SQL, Wireframing, Stakeholder Management, Mixpanel.`,
    jobDescription: `Target Role: Lead / Principal Product Manager – Enterprise AI Workflows
Company: ScaleNova Systems (Series C B2B SaaS)

About the Role:
We are seeking an exceptional Lead Product Manager to spearhead our next-generation Enterprise AI automation engine. You will own the core workflow product from discovery through multi-million dollar ARR scaling.

Key Requirements:
• 6+ years of B2B SaaS product management experience, preferably in workflow automation or data/AI products.
• Proven track record of measurable business outcomes: ARR expansion, churn reduction, and adoption metrics.
• Deep expertise in continuous product discovery, customer experimentation, hypothesis-driven development, and quantitative telemetry.
• Demonstrated ownership of multi-year product roadmaps across enterprise customers.
• Ability to collaborate closely with ML/AI engineering teams on model accuracy, latency, and enterprise compliance (SOC2/GDPR).
• Exceptional executive communication and cross-functional alignment skills.`
  },
  {
    id: 'senior-engineer',
    name: 'Marcus Chen',
    role: 'Staff Full-Stack Software Engineer',
    badge: 'Engineering & Cloud',
    fileName: 'Marcus_Chen_Staff_Engineer.docx',
    resumeText: `MARCUS CHEN
Austin, TX • marcus.chen.dev@gmail.com • github.com/mchen-dev

SUMMARY
Versatile software developer with 8 years of experience building web applications. Proficient in JavaScript, React, Node.js, and cloud technologies. Seeking a challenging engineering role in a modern tech company.

EXPERIENCE
Staff Software Engineer | ApexCloud Solutions | 2022 – Present
- Lead developer on the frontend and backend microservices architecture.
- Migrated legacy monolith components to React and TypeScript.
- Implemented GraphQL endpoints and optimized database queries.
- Participated in weekly on-call rotations and resolved production incidents.
- Mentored junior and mid-level software engineers during code reviews.

Senior Full Stack Engineer | FinCore Payments | 2019 – 2022
- Built payment checkout interfaces using React, Redux, and Express.
- Collaborated with product managers and designers on sprint deliverables.
- Integrated third-party payment gateways like Stripe and PayPal.
- Wrote unit tests using Jest to maintain code coverage.

Software Engineer | CodeCraft Digital | 2016 – 2019
- Developed responsive websites for various client projects using HTML, CSS, and Node.js.
- Fixed frontend bugs and updated CSS styles across multiple browsers.

SKILLS
Languages: TypeScript, JavaScript, Python, SQL, HTML/CSS
Frameworks: React, Next.js, Node.js, Express, Redux, GraphQL
Infrastructure: Docker, AWS (S3, EC2), Postgres, Redis, Git, CI/CD`,
    jobDescription: `Target Role: Staff Infrastructure & Platform Engineer
Company: StripeTech Payments

Role Overview:
Looking for a Staff Engineer to own system reliability, high-throughput distributed transaction pipelines, and developer platform infrastructure.

Requirements:
- 7+ years of production experience in high-concurrency distributed systems processing >10,000 requests/sec.
- Deep expertise in PostgreSQL performance tuning, database sharding, latency minimization, and distributed caching (Redis).
- Proven ownership of 99.99% SLA availability, zero-downtime migrations, and chaos engineering practices.
- Strong proficiency in Go, Rust, or modern Node/TypeScript microservices with Kubernetes & Terraform.
- Track record of driving engineering org-wide architecture standards and cross-team tech initiatives.`
  },
  {
    id: 'growth-sales',
    name: 'Sarah Jenkins',
    role: 'Enterprise Account Executive (SaaS)',
    badge: 'Sales & Revenue',
    fileName: 'Sarah_Jenkins_Enterprise_AE.pdf',
    resumeText: `SARAH JENKINS
New York, NY | sarah.jenkins.sales@outlook.com

PROFESSIONAL PROFILE
Energetic and results-driven sales professional with 6 years in B2B tech sales. Experienced in prospecting, delivering demonstrations, and closing deals.

EXPERIENCE
Enterprise Account Executive | SecureShield Cyber | 2022 – Present
- Sold enterprise cybersecurity solutions to Fortune 1000 accounts.
- Conducted product demos, prepared proposals, and negotiated contracts.
- Maintained sales pipeline and recorded all customer calls in Salesforce.
- Attended cybersecurity industry conferences and generated inbound leads.
- Collaborated with sales engineers to answer technical RFP questions.

Senior SDR / Mid-Market AE | CloudSync Software | 2019 – 2022
- Identified outbound target accounts and booked qualified meetings.
- Managed end-to-end sales cycle for mid-market software contracts.
- Consistently hit monthly activity KPIs for outbound cold calls and emails.

EDUCATION
B.A. in Communications, Penn State University (2018)

SKILLS & TOOLS
Salesforce, HubSpot, Outreach.io, ZoomInfo, MEDDPICC, Solution Selling, Cold Calling, Pipeline Management, Contract Negotiation.`,
    jobDescription: `Target Role: Strategic Enterprise Account Executive
Company: CyberArm Security

Requirements:
- 5+ years of quota-carrying enterprise SaaS sales experience with ACV > $150K.
- Documented quota achievement: % of quota attained, President's Club, and revenue closed.
- Deep mastery of MEDDPICC qualification and navigating multi-stakeholder enterprise buying committees (CISO, CIO, Legal, Procurement).
- Strong track record of hunting net-new enterprise accounts and managing complex 6-9 month sales cycles.`
  }
];
