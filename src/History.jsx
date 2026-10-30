(function () {
  const { useState, useMemo } = React;
  const S = window.SITE;
  const H = window.HISTORY;

  const total = H.orgs.reduce((n, o) => n + o.items.length, 0);
  const catLabel = Object.fromEntries(H.cats.map((c) => [c.key, c.label]));
  const countBy = (key) =>
    H.orgs.filter((o) => key === "all" || o.cat === key).reduce((n, o) => n + o.items.length, 0);

  function PageHero() {
    const orgCount = H.orgs.length;
    return (
      <section className="hero page-hero" id="top" aria-labelledby="history-title">
        <div className="wrap">
          <p className="eyebrow">TRACK RECORD</p>
          <h1 className="h1-sm" id="history-title">
            기업·기관 현장에서 쌓은
            <br />
            <em>{total}건의 출강 이력</em>
          </h1>
          <p className="lead">
            포스코인터내셔널, NHN, 하나투어 같은 기업부터 대학, 공공기관, 50+센터까지. 교육 대상별로 확인해 보세요.
          </p>
          <ul className="hist-stats">
            <li><b>{total}건</b><span>수록된 강의·특강</span></li>
            <li><b>{orgCount}곳</b><span>출강 기관·과정</span></li>
            <li><b>{H.cats.length}개</b><span>교육 대상 분류</span></li>
          </ul>
        </div>
      </section>
    );
  }

  function Explorer() {
    const [cat, setCat] = useState("all");
    const [q, setQ] = useState("");

    const shown = useMemo(() => {
      const kw = q.trim().toLowerCase();
      return H.orgs
        .filter((o) => cat === "all" || o.cat === cat)
        .map((o) => {
          if (!kw) return o;
          if (o.org.toLowerCase().includes(kw)) return o;
          const items = o.items.filter((t) => t.toLowerCase().includes(kw));
          return items.length ? { ...o, items } : null;
        })
        .filter(Boolean);
    }, [cat, q]);

    const shownCount = shown.reduce((n, o) => n + o.items.length, 0);

    return (
      <section className="sec alt" id="history" aria-labelledby="history-list-title">
        <div className="wrap">
          <h2 className="sr-only" id="history-list-title">기관별 출강 이력</h2>
          <div className="filter-bar">
            <div className="tabs" role="tablist" aria-label="교육 대상 분류">
              {[{ key: "all", label: "전체" }, ...H.cats].map((c) => (
                <button
                  key={c.key}
                  role="tab"
                  aria-selected={cat === c.key}
                  className={"tab" + (cat === c.key ? " on" : "")}
                  onClick={() => setCat(c.key)}
                >
                  {c.label} <small>{countBy(c.key)}</small>
                </button>
              ))}
            </div>
            <label className="search">
              <span className="sr-only">기관명 또는 강의명 검색</span>
              <input
                type="search"
                placeholder="기관명·강의명 검색 (예: 챗GPT, 구청)"
                value={q}
                onChange={(e) => setQ(e.target.value)}
              />
            </label>
          </div>

          <p className="result-line" aria-live="polite">
            {shown.length}곳 · {shownCount}건 표시 중
          </p>

          {shown.length === 0 ? (
            <p className="empty">검색 결과가 없습니다. 다른 키워드로 찾아보세요.</p>
          ) : (
            <div className="org-grid">
              {shown.map((o) => (
                <article className="org-card" key={o.org}>
                  <div className="org-head">
                    <h3>{o.org}</h3>
                    <span className="tag">{catLabel[o.cat]}</span>
                  </div>
                  <ul>
                    {o.items.map((t) => (
                      <li key={t}>{t}</li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    );
  }

  function Bridge() {
    return (
      <section className="sec" aria-labelledby="bridge-title">
        <div className="wrap review-box">
          <div>
            <p className="kicker">REVIEWS</p>
            <h2 id="bridge-title">현장의 목소리는 블로그에서</h2>
            <p className="sec-sub">강의 후기와 현장 사진은 운영 중인 네이버 블로그에서 확인하실 수 있습니다.</p>
          </div>
          <a className="btn ghost dark" href={S.blog} target="_blank" rel="noopener noreferrer">
            네이버 블로그에서 후기 보기 ↗
          </a>
        </div>
      </section>
    );
  }

  function HistoryPage() {
    return (
      <>
        <Header base="index.html" active="history" />
        <main id="main">
          <PageHero />
          <Explorer />
          <Bridge />
          <Contact />
        </main>
        <Footer />
      </>
    );
  }

  ReactDOM.createRoot(document.getElementById("root")).render(<HistoryPage />);
})();
