/** Original editorial drawing, not a product screen or customer evidence. */
export function RestaurantIllustration() {
  return <figure className="restaurant-illustration">
    <svg viewBox="0 0 600 610" role="img" aria-labelledby="restaurant-drawing-title">
      <title id="restaurant-drawing-title">A restaurant place setting connected to the work behind service</title>
      <g className="setting-drawing" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M35 55H565V515H35Z" strokeDasharray="3 9" opacity=".35" />
        <circle cx="287" cy="254" r="155" fill="var(--rm-cream)" />
        <circle cx="287" cy="254" r="136" />
        <circle cx="287" cy="254" r="106" strokeWidth="1" />
        <path d="M90 155V225Q90 241 103 241Q116 241 116 225V155M103 155V360M96 155V210M110 155V210M463 155Q440 199 447 257H463M463 155V360" strokeWidth="3" strokeLinecap="round" />
        <circle cx="477" cy="91" r="37" /><circle cx="477" cy="91" r="29" strokeWidth="1" />
        <path d="M221 170H342V337H221Z" fill="var(--rm-ready-gold)" stroke="none" />
        <path d="M221 170L342 337M221 337L342 170" opacity=".45" />
        <path d="M287 360V426H385V462" className="service-thread" stroke="var(--rm-ready-gold)" strokeWidth="4" />
      </g>
      <g className="service-ticket">
        <path d="M310 414H553V580L541 572L529 580L517 572L505 580L493 572L481 580L469 572L457 580L445 572L433 580L421 572L409 580L397 572L385 580L373 572L361 580L349 572L337 580L325 572L310 580Z" fill="var(--rm-ready-gold)" />
        <g fill="var(--rm-ink)" fontFamily="inherit"><text x="332" y="444" fontSize="12" letterSpacing="2">BEHIND THE SERVICE</text><text x="332" y="483" fontSize="24" fontWeight="600">A shift. A bill.</text><text x="332" y="514" fontSize="24" fontWeight="600">A next step.</text><text x="332" y="554" fontSize="12">REAL WORK. SOMEONE TO OWN IT.</text></g>
        <path d="M330 531H533" stroke="var(--rm-ink)" strokeDasharray="3 3" />
      </g>
      <g fill="currentColor" fontSize="12" letterSpacing="2"><text x="35" y="30">YOUR RESTAURANT</text><text x="35" y="552">OUR SIDE</text><text x="35" y="574">OF THE TABLE.</text></g>
    </svg>
    <figcaption>From the floor to the financial picture.</figcaption>
  </figure>;
}

export function CashPressureIllustration() {
  return <figure className="cash-pressure" aria-label="Financial review: connect sales, obligations and cash before deciding what comes next">
    <svg viewBox="0 0 640 320" role="img" aria-labelledby="cash-drawing-title">
      <title id="cash-drawing-title">Sales are only one part of the cash picture</title>
      <g fill="none" stroke="var(--rm-line)" strokeWidth="1"><path d="M40 60H600M40 140H600M40 220H600" opacity=".3"/><path d="M120 80V140H320V220H520V260" className="cash-thread" stroke="var(--rm-ready-gold)" strokeWidth="3" /></g>
      <g fill="var(--rm-cream)" fontFamily="inherit" fontSize="19"><text x="40" y="46">Sales coming in</text><text x="240" y="126">Bills coming due</text><text x="425" y="206">Cash available</text></g>
      <g fill="var(--rm-ready-gold)"><rect x="112" y="72" width="16" height="16"/><rect x="312" y="152" width="16" height="16"/><rect x="512" y="252" width="16" height="16"/></g>
      <text x="40" y="295" fill="var(--rm-line)" fontSize="12" letterSpacing="1">A REVIEW FRAMEWORK · NOT A FINANCIAL FORECAST</text>
    </svg>
  </figure>;
}
