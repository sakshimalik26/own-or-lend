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
  const [shareStepsOpen, setShareStepsOpen] = useState(false);
  const [bondStepsOpen, setBondStepsOpen] = useState(false);

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
              <button className="calc-toggle" type="button" aria-expanded={shareStepsOpen} onClick={() => setShareStepsOpen(!shareStepsOpen)}>{shareStepsOpen ? "Hide step-by-step calculation ↑" : "New to finance? Show calculation step by step ↓"}</button>
              {shareStepsOpen && <div className="calculation-steps" aria-live="polite">
                <div><i>1</i><p><b>Find the cost of one share</b><span>One share costs {inr.format(sharePrice)}.</span></p></div>
                <div><i>2</i><p><b>Calculate the money you invest</b><span>{shares} shares × {inr.format(sharePrice)} = <strong>{inr.format(shareInvestment)}</strong></span></p></div>
                <div><i>3</i><p><b>Calculate your ownership</b><span>{shares} shares ÷ {totalShares} total shares × 100 = <strong>{ownership.toFixed(0)}%</strong></span></p></div>
                <div><i>4</i><p><b>Understand your voting power</b><span>{shareType === "ordinary" ? <>Ordinary shares normally give voting power: <strong>{ownership.toFixed(0)}%</strong></> : <>Preference shares normally have no ordinary voting power: <strong>0%</strong></>}</span></p></div>
              </div>}
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
              <button className="calc-toggle" type="button" aria-expanded={bondStepsOpen} onClick={() => setBondStepsOpen(!bondStepsOpen)}>{bondStepsOpen ? "Hide step-by-step calculation ↑" : "New to finance? Show calculation step by step ↓"}</button>
              {bondStepsOpen && <div className="calculation-steps" aria-live="polite">
                <div><i>1</i><p><b>Find the cost of one bond</b><span>One bond costs {inr.format(bondPrice)}.</span></p></div>
                <div><i>2</i><p><b>Calculate how much you lend</b><span>{bonds} bonds × {inr.format(bondPrice)} = <strong>{inr.format(amountLent)}</strong></span></p></div>
                <div><i>3</i><p><b>Calculate the interest each year</b><span>{inr.format(amountLent)} × {bondRate}% = <strong>{inr.format(annualInterest)}</strong></span></p></div>
                <div><i>4</i><p><b>Calculate the final-year payment</b><span>{inr.format(amountLent)} principal + {inr.format(annualInterest)} interest = <strong>{inr.format(amountLent + annualInterest)}</strong></span></p></div>
              </div>}
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
        <div className="section-head"><p className="eyebrow">THE CAFÉ EARNS A PROFIT</p><h2>The café made ₹2,000 after covering all its expenses</h2><p>Click the profit below to see what shareholders could receive.</p></div>
        <button className="profit-focus" type="button" aria-expanded={equityOpen} onClick={() => setEquityOpen(!equityOpen)}><span>PROFIT AFTER ALL EXPENSES · CLICK TO EXPLORE</span><strong>₹2,000</strong><p>If the company decides to distribute all its profits, how much could you receive?</p></button>
        {equityOpen && <div className="dividend-answer" aria-live="polite">
          {shareType === "ordinary" ? <><b>Your ordinary-share dividend: {inr.format(ordinaryDividend)}</b><div className="dividend-steps"><p><i>1</i><span>The café made <strong>{inr.format(distributableProfit)} profit</strong> after covering all its expenses.</span></p><p><i>2</i><span>If the company decides to distribute all its profits, the total dividend pool is <strong>{inr.format(distributableProfit)}</strong>.</span></p><p><i>3</i><span>Your ownership is <strong>{ownership.toFixed(0)}%</strong>.</span></p><p><i>4</i><span>{inr.format(distributableProfit)} × {ownership.toFixed(0)}% = <strong>{inr.format(ordinaryDividend)} dividend</strong>.</span></p></div></> : <><b>Your preference-share dividend: {inr.format(preferenceDividend)}</b><span>Your preference dividend is fixed at 8% of the money you invested.</span><div className="dividend-steps"><p><i>1</i><span>You invested <strong>{inr.format(shareInvestment)}</strong>.</span></p><p><i>2</i><span>The fixed preference dividend rate is <strong>8%</strong>.</span></p><p><i>3</i><span>{inr.format(shareInvestment)} × 8% = <strong>{inr.format(preferenceDividend)} dividend</strong>.</span></p></div></>}
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
