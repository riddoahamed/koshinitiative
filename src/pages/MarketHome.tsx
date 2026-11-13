import PageShell from "@/v2/PageShell";
import "./markets.css";

export default function MarketHome({ global = false }: { global?: boolean }) {
  return <PageShell path={global ? "/global" : "/"}>
    <section className="sec market-home">
      <div className="wrap">
        <p className="eyebrow">Kosh Finance · {global ? "Global" : "one home, local context"}</p>
        <h1 className="h-display">{global ? "A new country. A different money rulebook." : "Learn money and investing, wherever life takes you."}</h1>
        <p className="h-sub">{global
          ? "For Bangladeshis living abroad: understand the money decisions that come with moving, earning and building a life in another country."
          : "Start with your market. The basics travel with you; the products, taxes and rules depend on where you live."}</p>
        <div className="market-doors">
          {global ? <>
            <article><span>01 / Understand</span><h2>ETFs & shares</h2><p>Learn diversification, fund fees, fractional ownership and investment risk. Availability depends on your country and provider.</p></article>
            <article><span>02 / Connect</span><h2>Money across borders</h2><p>Understand exchange rates, transfer costs and the questions to ask before moving savings between countries.</p></article>
            <article><span>03 / Build</span><h2>Credit & a new start</h2><p>Learn what a credit history records, what borrowing costs, and why each country has a different system.</p></article>
          </> : <>
            <a href="/bd"><span>01 / Bangladesh · live in beta</span><h2>Money at home.</h2><p>Learn about DSE shares, savings certificates, fixed deposits, gold and the Bangladesh context. Explore tools and risk-free practice.</p><b>Explore Bangladesh →</b></a>
            <a href="/global"><span>02 / Global · education preview</span><h2>Money abroad.</h2><p>ETFs, shares, cross-border money and building credit. Country-specific guides and services are still being developed.</p><b>Explore Global →</b></a>
          </>}
        </div>
        {global && <p className="market-boundary">Kosh Global is an education preview. Kosh does not offer trading, custody, credit or remittance services here. Choosing a market does not establish eligibility for an investment product.</p>}
        <div className="market-library">
          <p className="eyebrow">One shared learning library</p>
          <h2>Keep the lesson. Check the market.</h2>
          <p>Our current lessons and articles are labelled for Bangladesh. Read the market context before applying a product example where you live.</p>
          <a className="btn" href="/learn">Quick lessons</a>{" "}<a className="btn btn-glass" href="/blog">Read the library</a>
        </div>
        <p><a href={global ? "/bd" : "/global"}>{global ? "Looking for Kosh Bangladesh? →" : "Living abroad? Explore Global →"}</a></p>
      </div>
    </section>
  </PageShell>;
}
