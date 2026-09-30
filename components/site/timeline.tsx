export function Timeline({
  steps,
}: {
  steps: { title: string; body: string }[];
  pinned?: boolean;
}) {
  return (
    <div className="rhythm">
      <ol className="rhythm-sequence">
        {steps.map((step, index) => (
          <li key={step.title}>
            <span className="rhythm-number" aria-hidden="true">0{index + 1}</span>
            <div><h3>{step.title}</h3><p>{step.body}</p></div>
            {index < steps.length - 1 && <span className="rhythm-handoff" aria-hidden="true">↘</span>}
          </li>
        ))}
      </ol>
      <p className="caption">Reporting dates and follow-up meetings are agreed in your service proposal.</p>
    </div>
  );
}
