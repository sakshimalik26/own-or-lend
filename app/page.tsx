"use client";

import { useMemo, useState } from "react";

const inr = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 });

type Mode = "shares" | "bonds";
type ShareType = "ordinary" | "preference";
type Scenario = "profit" | "loss" | "growth" | "closure";

const scenarios: Record<Scenario, { label: string; emoji: string; shares: string; bonds: string }> = {
  profit: { label: "The café earns a profit", emoji: "📈", shares: "The company may declare a dividend. As a shareholder, you receive your proportion—but dividends are not guaranteed.", bonds: "Your agreed interest remains the same. A larger profit does not normally increase it." },
  loss: { label: "The café makes a loss", emoji: "📉", shares: "There may be no dividend, and the value of your shares could fall.", bonds: "The company still owes the agreed interest, although payment is at risk if it cannot afford it." },
  growth: { label: "The café becomes popular", emoji: "✨", shares: "Your ownership percentage stays the same, but your shares may become more valuable.", bonds: "You still receive the agreed interest and principal. You do not share directly in the extra value." },
  closure: { label: "The café closes", emoji: "🚪", shares: "Creditors are paid first. Shareholders receive only what remains, and may lose their full investment.", bonds: "Bondholders are creditors and are generally paid before shareholders—but repayment is still not guaranteed." },
};

export default function Home() {
  const [mode, setMode] = useState<Mode>("shares");
  const [shareType, setShareType] = useState<ShareType>("ordinary");
  const [shares, setShares] = useState(100);
  const [bonds, setBonds] = useState(2);
  const [scenario, setScenario] = useState<Scenario>("profit");
  const [quiz, setQuiz] = useState<Record<number, string>>({});
  const [equityOpen, setEquityOpen] = useState(false);

  const totalShares = 1000;
  const sharePrice = 10;
  const ownership = (shares / totalShares) * 100;
  const shareInvestment = shares * sharePrice;
  const distributableProfit = 2000;
  const ordinaryDividend = distributableProfit * ownership / 100;
  const preferenceDividend = shareInvestment * 8 / 100;
  const bondPrice = 1000;
  const bondRate = 8;
  const bondYears = 3;
  const amountLent = bonds * bondPrice;
  const annualInterest = amountLent * bondRate / 100;

  const grid = useMemo(() => Array.from({ length: 100 }, (_, i) => i < Math.round(ownership)), [ownership]);

  const setModeAndFocus = (next: Mode) => {
    setMode(next);
    window.setTimeout(() => document.getElementById("simulator")?.scrollIntoView({ behavior: "smooth", block: "start" }), 50);
  };

  return (
    <main>
      <section className="hero">
        <nav aria-label="Main navigation">
          <a className="brand" href="#top">OWN <span>or</span> LEND?</a>
          <a href="#compare">Quick comparison</a>
        </nav>
        <div className="hero-copy" id="top">
          <p className="eyebrow">A VISUAL FINANCE LAB</p>
          <h1>One café needs money.<br /><em>What would you choose?</em></h1>
          <p className="lede">Campus Café needs <strong>₹10,000</strong> to open. Explore two ways to fund it—and discover whether you become an owner or a lender.</p>
          <div className="choice-row">
            <button className="choice owner" onClick={() => setModeAndFocus("shares")}>
              <span className="choice-number">01</span><span className="choice-icon">◒</span>
              <strong>Buy shares</strong><small>Own a piece of the company</small><b>Become an owner →</b>
            </button>
            <div className="or">OR</div>
            <button className="choice lender" onClick={() => setModeAndFocus("bonds")}>
              <span className="choice-number">02</span><span className="choice-icon">₹</span>
              <strong>Buy bonds</strong><small>Lend money to the company</small><b>Become a lender →</b>
            </button>
          </div>
        </div>
      </section>

      <section className="simulator" id="simulator">
        <div className="section-head">
          <p className="eyebrow">TRY IT YOURSELF</p>
          <h2>{mode === "shares" ? "How much of the café will you own?" : "How much will you lend the café?"}</h2>
          <div className="tabs" role="tablist" aria-label="Investment type">
            <button role="tab" aria-selected={mode === "shares"} onClick={() => setMode("shares")}>Shares · Owner</button>
            <button role="tab" aria-selected={mode === "bonds"} onClick={() => setMode("bonds")}>Bonds · Lender</button>
          </div>
        </div>

        {mode === "shares" ? (
          <div className="lab-grid">
            <div className="controls">
              <div className="fact-strip"><span>Company needs <b>₹10,000</b></span><span>Issues <b>1,000 shares</b></span><span>Price <b>₹10 each</b></span></div>
              <div className="share-kind" role="group" aria-label="Choose share type">
                <button aria-pressed={shareType === "ordinary"} onClick={() => { setShareType("ordinary"); setEquityOpen(false); }}>Ordinary shares</button>
                <button aria-pressed={shareType === "preference"} onClick={() => { setShareType("preference"); setEquityOpen(false); }}>Preference shares · 8%</button>
              </div>
              <label htmlFor="shares">How many shares would you like?</label>
              <div className="stepper"><button aria-label="Remove ten shares" onClick={() => setShares(Math.max(0, shares - 10))}>−</button><output>{shares}</output><button aria-label="Add ten shares" onClick={() => setShares(Math.min(1000, shares + 10))}>+</button></div>
              <input id="shares" type="range" min="0" max="1000" step="10" value={shares} onChange={e => setShares(Number(e.target.value))} />
              <div className="metrics">
                <div><span>You invest</span><strong>{inr.format(shareInvestment)}</strong></div>
                <div className="accent"><span>You own</span><strong>{ownership.toFixed(0)}%</strong></div>
                <div><span>Your normal voting power</span><strong>{shareType === "ordinary" ? `${ownership.toFixed(0)}%` : "0%"}</strong></div>
              </div>
              <p className="plain-note"><b>In simple words:</b> You own {shares} of the company’s {totalShares} equal ownership pieces. <span>(Ownership = {shares} ÷ {totalShares} × 100 = {ownership.toFixed(0)}%)</span></p>
            </div>
            <div className="visual" aria-label={`${ownership.toFixed(0)} percent of the company ownership grid is selected`}>
              <div className="building-title"><span>☕ Campus Café Ltd.</span><strong>{ownership.toFixed(0)}% is yours</strong></div>
              <div className="ownership-grid">{grid.map((owned, i) => <span key={i} className={owned ? "owned" : ""} />)}</div>
              <div className="legend"><i className="owned-key" /> Your ownership <i /> Other shareholders</div>
              <p>You own part of the <b>company</b>—not a particular chair, coffee machine, or room.</p>
            </div>
          </div>
        ) : (
          <div className="lab-grid">
            <div className="controls">
              <div className="fact-strip"><span>One bond costs <b>₹1,000</b></span><span>Interest <b>8% yearly</b></span><span>Term <b>3 years</b></span></div>
              <label htmlFor="bonds">How many bonds would you like?</label>
              <div className="stepper"><button aria-label="Remove one bond" onClick={() => setBonds(Math.max(0, bonds - 1))}>−</button><output>{bonds}</output><button aria-label="Add one bond" onClick={() => setBonds(Math.min(10, bonds + 1))}>+</button></div>
              <input id="bonds" type="range" min="0" max="10" value={bonds} onChange={e => setBonds(Number(e.target.value))} />
              <div className="metrics">
                <div><span>You lend</span><strong>{inr.format(amountLent)}</strong></div>
                <div className="accent"><span>Interest each year</span><strong>{inr.format(annualInterest)}</strong></div>
                <div><span>Ownership & votes</span><strong>0%</strong></div>
              </div>
              <p className="plain-note"><b>In simple words:</b> The company promises yearly interest and to return {inr.format(amountLent)} after {bondYears} years, but repayment has risk.</p>
            </div>
            <div className="visual bond-visual" aria-label={`Cash flow for ${bonds} bonds`}>
              <div className="bond-ticket"><small>CAMPUS CAFÉ BOND</small><strong>{inr.format(amountLent)}</strong><span>Money you lend today</span></div>
              <div className="cashflow"><span>Today<br /><b>−{inr.format(amountLent)}</b></span><i>→</i><span>Year 1<br /><b>+{inr.format(annualInterest)}</b></span><i>→</i><span>Year 2<br /><b>+{inr.format(annualInterest)}</b></span><i>→</i><span>Year 3<br /><b>+{inr.format(annualInterest + amountLent)}</b></span></div>
              <p>You are a <b>lender</b>, not an owner. You normally receive no vote in company decisions.</p>
            </div>
          </div>
        )}
      </section>

      <section className="balance-section">
        <div className="section-head"><p className="eyebrow">INSIDE THE COMPANY</p><h2>What the café has—and what it owes</h2><p>The company owns the assets. Shareholders own the company.</p></div>
        <div className="balance-equation">
          <div className="balance assets"><span>WHAT IT HAS</span><h3>Assets</h3><ul><li>Cash <b>₹2,000</b></li><li>Equipment <b>₹6,000</b></li><li>Furniture <b>₹4,000</b></li></ul><strong>₹12,000</strong></div>
          <div className="symbol">−</div>
          <div className="balance liabilities"><span>WHAT IT OWES</span><h3>Liabilities</h3><ul><li>Bank loan <b>₹3,000</b></li><li>Bonds <b>₹2,000</b></li></ul><strong>₹5,000</strong></div>
          <div className="symbol">=</div>
          <button className="balance equity" type="button" aria-expanded={equityOpen} onClick={() => setEquityOpen(!equityOpen)}><span>WHAT REMAINS · CLICK TO EXPLORE</span><h3>Owners’ equity</h3><p>The value left for all shareholders</p><strong>₹7,000</strong></button>
        </div>
        {equityOpen && <div className="dividend-answer" aria-live="polite">
          {shareType === "ordinary" ? <><b>Your ordinary-share dividend: {inr.format(ordinaryDividend)}</b><span>Assuming profit available for dividend is {inr.format(distributableProfit)} and the payout ratio is 100%.</span><small>Formula: {inr.format(distributableProfit)} × {ownership.toFixed(0)}% ownership = {inr.format(ordinaryDividend)}</small></> : <><b>Your preference-share dividend: {inr.format(preferenceDividend)}</b><span>Preference dividend is fixed at 8% of your {inr.format(shareInvestment)} investment.</span><small>Formula: {inr.format(shareInvestment)} × 8% = {inr.format(preferenceDividend)}</small></>}
        </div>}
      </section>

      <section className="scenario-section">
        <div className="section-head"><p className="eyebrow">WHAT HAPPENS NEXT?</p><h2>Change the story. See who is affected.</h2></div>
        <div className="scenario-buttons">{(Object.keys(scenarios) as Scenario[]).map(key => <button key={key} aria-pressed={scenario === key} onClick={() => setScenario(key)}><span>{scenarios[key].emoji}</span>{scenarios[key].label}</button>)}</div>
        <div className="scenario-result">
          <div><span>SHAREHOLDER · OWNER</span><h3>{scenario === "profit" ? "May receive more" : scenario === "growth" ? "May gain value" : "Takes business risk"}</h3><p>{scenarios[scenario].shares}</p></div>
          <div><span>BONDHOLDER · LENDER</span><h3>{scenario === "closure" ? "Paid before owners" : "Agreement stays fixed"}</h3><p>{scenarios[scenario].bonds}</p></div>
        </div>
      </section>

      <section className="compare" id="compare">
        <div className="section-head"><p className="eyebrow">THE BIG DIFFERENCE</p><h2>Owner or lender?</h2></div>
        <div className="comparison" role="table" aria-label="Shares and bonds comparison">
          <div className="comparison-head" role="row"><span /><strong>SHARES</strong><strong>BONDS</strong></div>
          {[['Your role','Owner','Lender'],['Voting rights','Usually yes','Normally no'],['Regular payment','Dividend, if declared','Agreed interest'],['Return','Can rise or fall','More predictable'],['If the company closes','Paid after creditors','Generally before shareholders']].map(row => <div className="comparison-row" role="row" key={row[0]}><b>{row[0]}</b><span>{row[1]}</span><span>{row[2]}</span></div>)}
        </div>
      </section>

      <section className="quiz-section">
        <div className="section-head"><p className="eyebrow">CHECK YOUR UNDERSTANDING</p><h2>Can you advise these students?</h2></div>
        {[
          { q: "Riya wants ownership and voting rights. What should she buy?", answer: "Shares" },
          { q: "Aman wants to lend at an agreed interest rate. What should he buy?", answer: "Bonds" },
          { q: "The company closes. Who is generally paid first?", answer: "Bondholders" },
        ].map((item, i) => <div className="quiz" key={item.q}><p><span>{i + 1}</span>{item.q}</p><div>{(i === 2 ? ["Shareholders", "Bondholders"] : ["Shares", "Bonds"]).map(option => <button key={option} aria-pressed={quiz[i] === option} onClick={() => setQuiz({...quiz, [i]: option})}>{option}</button>)}</div>{quiz[i] && <strong className={quiz[i] === item.answer ? "correct" : "incorrect"}>{quiz[i] === item.answer ? "Correct!" : `Not quite—choose ${item.answer}.`}</strong>}</div>)}
      </section>

      <footer><strong>OWN <span>or</span> LEND?</strong><p>A visual introduction to shares and bonds · For classroom learning only</p><a href="#top">Start again ↑</a></footer>
    </main>
  );
}
