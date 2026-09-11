import {
  Activity,
  ArrowUpRight,
  CheckCircle2,
  Cloud,
  Cpu,
  Github,
  Gauge,
  GitPullRequest,
  Layers3,
  ShieldCheck,
  Sparkles,
  Timer,
  TrendingDown,
  Workflow,
} from "lucide-react";

const stats = [
  { label: "Monthly infrastructure", value: "$127.40", delta: "38% optimized", icon: Cloud },
  { label: "Active previews", value: "3", delta: "PR-scoped", icon: GitPullRequest },
  { label: "Idle compute saved", value: "42.6 hrs", delta: "this month", icon: TrendingDown },
  { label: "Cost policy", value: "PASS", delta: "< $100 PR delta", icon: ShieldCheck },
];

const previews = [
  { pr: "#142", name: "checkout-api", namespace: "preview-pr-142", status: "Running", replicas: "1 / 4", cost: "$4.18" },
  { pr: "#139", name: "catalog-service", namespace: "preview-pr-139", status: "Running", replicas: "1 / 4", cost: "$3.42" },
  { pr: "#136", name: "payments-api", namespace: "preview-pr-136", status: "Running", replicas: "1 / 4", cost: "$2.91" },
];

export default function Home() {
  return (
    <main>
      <div className="shell">
        <nav className="nav">
          <div className="brand">
            <div className="brand-mark"><Gauge size={19} /></div>
            <span>FINOPS <b>CONTROL</b></span>
          </div>
          <div className="nav-links">
            <a className="active" href="#overview">Overview</a>
            <a href="#architecture">Architecture</a>
            <a href="#previews">Previews</a>
            <a href="#automation">Automation</a>
          </div>
          <a className="github" href="https://github.com/" target="_blank" rel="noreferrer">
            <Github size={17} /> Repository <ArrowUpRight size={14} />
          </a>
        </nav>

        <section className="hero" id="overview">
          <div className="eyebrow"><Sparkles size={15} /> CLOUD COST OPTIMIZATION PLATFORM</div>
          <h1>Make infrastructure<br /><span>pay for itself.</span></h1>
          <p className="hero-copy">
            A recruiter-ready demonstration of shift-left FinOps, ephemeral Kubernetes environments,
            event-driven scale-to-zero, and cloud cost observability.
          </p>
          <div className="hero-actions">
            <a className="primary" href="#architecture">Explore architecture <ArrowUpRight size={16} /></a>
            <a className="secondary" href="https://github.com/" target="_blank" rel="noreferrer"><Github size={16} /> View source</a>
          </div>
        </section>

        <section className="stats-grid">
          {stats.map(({ label, value, delta, icon: Icon }) => (
            <div className="stat-card" key={label}>
              <div className="stat-icon"><Icon size={18} /></div>
              <div className="stat-label">{label}</div>
              <div className="stat-value">{value}</div>
              <div className="stat-delta">{delta}</div>
            </div>
          ))}
        </section>

        <section className="section" id="architecture">
          <div className="section-head">
            <div>
              <div className="eyebrow">01 / SYSTEM FLOW</div>
              <h2>One PR. One environment. Zero forgotten infrastructure.</h2>
            </div>
            <span className="live"><i /> DEMO ARCHITECTURE</span>
          </div>

          <div className="architecture">
            <div className="flow-node github-node">
              <Github size={25} />
              <strong>GitHub</strong>
              <span>Pull Request</span>
            </div>
            <div className="flow-arrow">→</div>
            <div className="flow-node">
              <Workflow size={25} />
              <strong>Actions</strong>
              <span>CI / CD</span>
            </div>
            <div className="flow-arrow">→</div>
            <div className="flow-node">
              <TrendingDown size={25} />
              <strong>Infracost</strong>
              <span>FinOps Gate</span>
            </div>
            <div className="flow-arrow">→</div>
            <div className="flow-node aws-node">
              <Cloud size={25} />
              <strong>AWS ECR</strong>
              <span>Container Image</span>
            </div>
            <div className="flow-arrow">→</div>
            <div className="flow-node">
              <Layers3 size={25} />
              <strong>EKS</strong>
              <span>Preview Namespace</span>
            </div>
          </div>

          <div className="controls-grid">
            <div className="control-card">
              <div className="control-top"><span className="pill purple">INFRACOST</span><CheckCircle2 size={18} /></div>
              <h3>Cost before merge</h3>
              <p>Terraform changes are estimated in the PR before infrastructure reaches AWS.</p>
              <div className="metric"><span>Estimated delta</span><b>+$14.82 / mo</b></div>
            </div>
            <div className="control-card">
              <div className="control-top"><span className="pill cyan">KEDA</span><CheckCircle2 size={18} /></div>
              <h3>Scale to zero</h3>
              <p>Non-production workloads stop consuming replicas outside the working window.</p>
              <div className="metric"><span>Current replicas</span><b>0 → 1 → 0</b></div>
            </div>
            <div className="control-card">
              <div className="control-top"><span className="pill green">OPENCOST</span><CheckCircle2 size={18} /></div>
              <h3>See where money goes</h3>
              <p>Kubernetes allocation makes namespace and workload spend visible.</p>
              <div className="metric"><span>Tracked namespaces</span><b>12</b></div>
            </div>
          </div>
        </section>

        <section className="section" id="previews">
          <div className="section-head">
            <div>
              <div className="eyebrow">02 / EPHEMERAL ENVIRONMENTS</div>
              <h2>Preview infrastructure follows the PR lifecycle.</h2>
            </div>
          </div>

          <div className="table-wrap">
            <div className="table-title"><span>ACTIVE PREVIEWS</span><span className="small-status"><i /> 3 environments</span></div>
            <div className="table">
              <div className="row header"><span>PR</span><span>Service</span><span>Namespace</span><span>Status</span><span>Replicas</span><span>Cost</span></div>
              {previews.map((p) => (
                <div className="row" key={p.pr}>
                  <span className="mono">{p.pr}</span>
                  <span className="service">{p.name}</span>
                  <span className="mono muted">{p.namespace}</span>
                  <span><b className="status"><i />{p.status}</b></span>
                  <span className="mono">{p.replicas}</span>
                  <span className="cost">{p.cost}<small>/mo</small></span>
                </div>
              ))}
            </div>
          </div>

          <div className="lifecycle">
            <div><Timer size={18} /><span>PR opened</span></div>
            <b>→</b>
            <div><Workflow size={18} /><span>Build + push</span></div>
            <b>→</b>
            <div><Layers3 size={18} /><span>Create namespace</span></div>
            <b>→</b>
            <div><Activity size={18} /><span>Run preview</span></div>
            <b>→</b>
            <div><TrendingDown size={18} /><span>PR closed</span></div>
            <b>→</b>
            <div><ShieldCheck size={18} /><span>Delete namespace</span></div>
          </div>
        </section>

        <section className="section" id="automation">
          <div className="section-head">
            <div>
              <div className="eyebrow">03 / AUTOMATION</div>
              <h2>Cost controls are engineered into the delivery path.</h2>
            </div>
          </div>
          <div className="automation-grid">
            <div className="big-card">
              <div className="big-icon"><Cpu size={22} /></div>
              <span className="number">01</span>
              <h3>Terraform + Infracost</h3>
              <p>Infrastructure changes receive an estimated monthly cost before merge. A policy threshold can block expensive changes.</p>
              <code>PR → plan → cost → policy → merge</code>
            </div>
            <div className="big-card">
              <div className="big-icon"><Layers3 size={22} /></div>
              <span className="number">02</span>
              <h3>PR-scoped EKS</h3>
              <p>Each preview receives an isolated namespace with quotas and limits. Closing the PR destroys the namespace automatically.</p>
              <code>preview-pr-&lt;number&gt;</code>
            </div>
            <div className="big-card">
              <div className="big-icon"><Activity size={22} /></div>
              <span className="number">03</span>
              <h3>KEDA + OpenCost</h3>
              <p>KEDA enables scheduled scale-to-zero while OpenCost exposes Kubernetes allocation data for cost visibility.</p>
              <code>minReplicaCount: 0</code>
            </div>
          </div>
        </section>

        <footer>
          <div><b>FINOPS CONTROL</b> / Cloud Cost Optimization & Ephemeral Environments</div>
          <div>AWS · EKS · ECR · Terraform · Infracost · KEDA · OpenCost</div>
        </footer>
      </div>
    </main>
  );
}
