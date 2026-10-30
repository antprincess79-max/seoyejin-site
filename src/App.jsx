(function () {
  const S = window.SITE;

  function Hero() {
    return (
      <section className="hero" id="top" aria-labelledby="hero-title">
        <div className="wrap hero-grid">
          <div>
            <p className="eyebrow">
              {S.affiliation} · {S.credentials[0]}
            </p>
            <h1 id="hero-title">
              {S.slogan[0]}
              <br />
              <em>{S.slogan[1]}</em>
            </h1>
            <p className="sub">회계 출신 AI 강사, 숫자로 증명하는 실무 교육</p>
            <p className="lead">{S.intro}</p>
            <div className="btn-row">
              <a className="btn primary" href="contact.html">강의 의뢰하기</a>
              <a className="btn ghost light" href="#curriculum">커리큘럼 보기</a>
            </div>
            <ul className="creds">
              {S.credentials.map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ul>
          </div>
          <figure className="portrait">
            <div className="photo">
              <img src="assets/profile.jpg" alt="네이비 재킷을 입고 미소 짓는 AI 교육 전문 강사 서예진" width="360" height="360" fetchpriority="high" decoding="async" />
            </div>
            <figcaption>
              <b>{S.name}</b> · {S.affiliation}
            </figcaption>
          </figure>
        </div>
      </section>
    );
  }

  function Facts() {
    return (
      <div className="facts" role="region" aria-label="강사 핵심 이력">
        <div className="wrap facts-grid">
          {S.facts.map((f) => (
            <div key={f.k} className="fact">
              <strong>{f.k}</strong>
              <span>{f.v}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  function References() {
    return (
      <section className="sec alt" id="references" aria-labelledby="references-title">
        <div className="wrap">
          <p className="kicker">TRACK RECORD</p>
          <h2 id="references-title">검증된 현장에서 만나는 강의</h2>
          <p className="sec-sub">기업, 대학, 공공기관까지. 다양한 교육 대상에 맞춰 눈높이를 조절해 왔습니다.</p>
          <div className="ref-grid">
            {S.references.map((g) => (
              <div className="ref-group" key={g.group}>
                <h3>{g.group}</h3>
                <ul className="tiles">
                  {g.items.map((n) => (
                    <li className="tile" key={n}>{n}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <p className="more-row">
            <a className="btn ghost dark" href="history.html">전체 출강 이력 보기</a>
          </p>
        </div>
      </section>
    );
  }

  function Curriculum() {
    return (
      <section className="sec" id="curriculum" aria-labelledby="curriculum-title">
        <div className="wrap">
          <p className="kicker">PROGRAMS</p>
          <h2 id="curriculum-title">대표 교육 프로그램</h2>
          <p className="sec-sub">조직의 직무와 AI 활용 수준에 맞춰 내용과 난이도를 조정합니다.</p>
          <div className="card-grid">
            {S.programs.map((p) => (
              <article className="card" key={p.no}>
                <span className="tag">PROGRAM {p.no}</span>
                <h3>{p.title}</h3>
                <p className="desc">{p.desc}</p>
                <div className="cases">
                  <b>실제 출강 사례</b>
                  <ul>
                    {p.cases.map((c) => (
                      <li key={c}>{c}</li>
                    ))}
                  </ul>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    );
  }

  function Reviews() {
    return (
      <section className="sec alt" id="reviews" aria-labelledby="reviews-title">
        <div className="wrap review-box">
          <div>
            <p className="kicker">REVIEWS</p>
            <h2 id="reviews-title">수강생의 생생한 후기는 블로그에서</h2>
            <p className="sec-sub">
              강의 현장과 참가자 소감을 운영 중인 네이버 블로그에서 직접 확인하실 수 있습니다.
            </p>
          </div>
          <a className="btn ghost dark" href={S.blog} target="_blank" rel="noopener noreferrer">
            네이버 블로그에서 후기 보기 ↗
          </a>
        </div>
      </section>
    );
  }

  function App() {
    return (
      <>
        <Header />
        <main id="main">
          <Hero />
          <Facts />
          <References />
          <Curriculum />
          <Reviews />
          <Contact />
        </main>
        <Footer />
      </>
    );
  }

  ReactDOM.createRoot(document.getElementById("root")).render(<App />);
})();
