import Link from "@/components/site/link";
import { workspaceCoverage } from "@/content/workspace-coverage";
import { ServiceIcon } from "./service-icon";

export function WorkspaceCoverage() {
  return (
    <section className="workspace-coverage" aria-labelledby="workspace-coverage-title">
      <div className="directory-heading">
        <h2 id="workspace-coverage-title">What the work includes.</h2>
        <p>Choose support for the records and reviews your restaurant needs. Your proposal confirms the systems, deliverables and approvals for each job.</p>
      </div>
      <div className="workspace-coverage-grid">
        {workspaceCoverage.map((area) => (
          <article key={area.title}>
            <ServiceIcon path={area.path} />
            <h3>{area.title}</h3>
            <p>{area.body}</p>
            <ul>{area.items.map((item) => <li key={item}>{item}</li>)}</ul>
            <Link className="workspace-service-link" href={area.path}>View the service <span aria-hidden="true">↗</span></Link>
          </article>
        ))}
      </div>
    </section>
  );
}
