const steps = [
  {
    word: "Run",
    heading: "We take on the recurring jobs.",
    body: "Books, hours, tips and supplier records. We agree the work, then get on with it.",
    evidence: [
      ["Input", "A shift is missing its end time."],
      ["Work", "Check the schedule and request a correction."],
      ["Handoff", "Manager confirms the hours."],
    ],
  },
  {
    word: "Explain",
    heading: "We tell you what the numbers mean.",
    body: "What changed this week? What is still missing? What needs your attention?",
    evidence: [
      ["Finding", "The payroll record is still incomplete."],
      ["Consequence", "Approval needs the confirmed hours."],
      ["Question", "Who can verify the shift before cutoff?"],
    ],
  },
  {
    word: "Improve",
    heading: "We stay with the follow-up.",
    body: "Agree the action, put someone in charge and check it at the next review.",
    evidence: [
      ["Next action", "Record the verified correction."],
      ["Decision owner", "Your payroll approver."],
      ["Next check", "Confirm the handoff at the agreed cutoff."],
    ],
  },
] as const;

export function ModelScene() {
  return (
    <div className="model">
      <p className="model-example-label">
        One payroll question, followed through. An illustrative workflow.
      </p>
      {steps.map((step, index) => (
        <div className="model-step" key={step.word}>
          <span className="step-num">0{index + 1}</span>
          <h3 className="model-heading">
            <span className="model-word">
              {step.word}
              <span>.</span>
            </span>
          </h3>
          <div className="model-description">
            <h4>{step.heading}</h4>
            <p>{step.body}</p>
          </div>
          <dl
            className="model-evidence"
            aria-label={step.word + ": illustrative payroll handoff"}
          >
            {step.evidence.map(([label, text]) => (
              <div key={label}>
                <dt>{label}</dt>
                <dd>{text}</dd>
              </div>
            ))}
          </dl>
          <span className="model-rule" aria-hidden="true" />
        </div>
      ))}
    </div>
  );
}
