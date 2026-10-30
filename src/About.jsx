(function () {
  const S = window.SITE;

  function PageHero() {
    return (
      <section className="hero page-hero" id="top" aria-labelledby="about-title">
        <div className="wrap hero-grid">
          <div>
            <p className="eyebrow">ABOUT · {S.affiliation}</p>
            <h1 className="h1-sm" id="about-title">
              회계의 숫자 감각으로
              <br />
              <em>AI 활용의 성과</em>를 설계합니다
            </h1>
            <p className="sub">{S.name} · {S.role}</p>
            <p className="lead">{S.intro}</p>
            <div className="btn-row">
              <a className="btn primary" href="contact.html">강의 의뢰하기</a>
              <a className="btn ghost light" href={S.blog} target="_blank" rel="noopener noreferrer">운영 블로그 ↗</a>
            </div>
          </div>
          <figure className="portrait">
            <div className="photo">
              <img src="assets/profile.jpg" alt="네이비 재킷을 입고 미소 짓는 AI 교육 전문 강사 서예진" width="360" height="360" fetchpriority="high" decoding="async" />
            </div>
          </figure>
        </div>
      </section>
    );
  }

  function Strengths() {
    return (
      <section className="sec" id="strengths" aria-labelledby="strengths-title">
        <div className="wrap">
          <p className="kicker">WHY SEO YE-JIN</p>
          <h2 id="strengths-title">왜 서예진 강사인가</h2>
          <p className="sec-sub">AI 도구 소개에 그치지 않고, 조직의 일하는 방식이 바뀌는 교육을 지향합니다.</p>
          <div className="card-grid">
            {S.strengths.map((s, i) => (
              <article className="card" key={s.title}>
                <span className="tag">POINT 0{i + 1}</span>
                <h3>{s.title}</h3>
                <p className="desc">{s.desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    );
  }

  function Profile() {
    return (
      <section className="sec alt" id="profile" aria-labelledby="profile-title">
        <div className="wrap">
          <p className="kicker">PROFILE</p>
          <h2 id="profile-title">학력과 경력</h2>
          <p className="sec-sub">회계·금융 현장에서 AI 교육 전문가로. 걸어온 길입니다.</p>
          <div className="profile-grid">
            <div className="panel-box">
              <h3>학력</h3>
              <ul className="timeline">
                {S.education.map((e) => (
                  <li key={e.school}>
                    <b>{e.school}</b> <span className="tag">{e.degree}</span>
                    <small>{e.major}</small>
                  </li>
                ))}
              </ul>
            </div>
            <div className="panel-box">
              <h3>현재 활동</h3>
              <ul className="timeline">
                {S.careers.now.map((c) => (
                  <li key={c}><b>{c}</b></li>
                ))}
              </ul>
            </div>
            <div className="panel-box">
              <h3>이전 경력</h3>
              <ul className="timeline past">
                {S.careers.past.map((c) => (
                  <li key={c}><b>(전) {c}</b></li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>
    );
  }

  function Fields() {
    return (
      <section className="sec" id="fields" aria-labelledby="fields-title">
        <div className="wrap">
          <p className="kicker">EXPERTISE</p>
          <h2 id="fields-title">강의 분야</h2>
          <p className="sec-sub">기업 임직원 교육을 중심으로 아래 분야를 강의합니다.</p>
          <ol className="field-grid">
            {S.fields.map((f, i) => (
              <li key={f}>
                <span>{String(i + 1).padStart(2, "0")}</span>
                {f}
              </li>
            ))}
          </ol>
          <div className="tools">
            <h3>교육에서 다루는 AI 도구</h3>
            <ul className="tiles">
              {S.tools.map((t) => (
                <li className="tile" key={t}>{t}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    );
  }

  function Credentials() {
    const groups = [
      { t: "자격증", l: S.certs },
      { t: "수상", l: S.awards },
      { t: "수료", l: S.completed },
    ];
    return (
      <section className="sec alt" id="credentials" aria-labelledby="credentials-title">
        <div className="wrap">
          <p className="kicker">CREDENTIALS</p>
          <h2 id="credentials-title">자격 · 수상 · 수료</h2>
          <p className="sec-sub">공신력 있는 자격과 수상으로 검증된 전문성입니다.</p>
          <div className="profile-grid">
            {groups.map((g) => (
              <div className="panel-box" key={g.t}>
                <h3>{g.t}</h3>
                <ul className="timeline">
                  {g.l.map((x) => (
                    <li key={x}><b>{x}</b></li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  function Track() {
    return (
      <section className="sec" id="track" aria-labelledby="track-title">
        <div className="wrap review-box">
          <div>
            <p className="kicker">TRACK RECORD</p>
            <h2 id="track-title">70여 건의 출강, 이렇게 만나왔습니다</h2>
            <p className="sec-sub">
              포스코인터내셔널, NHN, 하나투어, 이화여자대학교, 서초구청 등 기업·대학·공공기관 출강 레퍼런스를 확인해 보세요.
            </p>
          </div>
          <a className="btn ghost dark" href="history.html">전체 출강 이력 보기</a>
        </div>
      </section>
    );
  }

  function About() {
    return (
      <>
        <Header base="index.html" active="about" />
        <main id="main">
          <PageHero />
          <Facts />
          <Strengths />
          <Profile />
          <Fields />
          <Credentials />
          <Track />
          <Contact />
        </main>
        <Footer />
      </>
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

  ReactDOM.createRoot(document.getElementById("root")).render(<About />);
})();
