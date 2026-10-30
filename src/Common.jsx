(function () {
  const S = window.SITE;

  // base: 다른 페이지에서 홈의 섹션으로 갈 때 붙이는 경로 ("" 또는 "index.html")
  function Header({ base = "", active = "" }) {
    const [open, setOpen] = React.useState(false);
    return (
      <>
      <a className="skip" href="#main">본문 바로가기</a>
      <header className="header">
        <div className="wrap nav">
          <a href={base || "index.html"} className="brand">
            {S.name}
            <span>{S.role}</span>
          </a>
          <button
            className="menu-btn"
            aria-label="메뉴 열기"
            aria-expanded={open}
            aria-controls="main-nav"
            onClick={() => setOpen(!open)}
          >
            <i></i><i></i><i></i>
          </button>
          <nav id="main-nav" aria-label="주요 메뉴" className={open ? "open" : ""} onClick={() => setOpen(false)}>
            <a href="about.html" aria-current={active === "about" ? "page" : undefined}>강사 소개</a>
            <a href="history.html" aria-current={active === "history" ? "page" : undefined}>출강 이력</a>
            <a href={`${base}#curriculum`}>커리큘럼</a>
            <a href={`${base}#reviews`}>수강 후기</a>
          </nav>
          <a className="cta-sm" href="contact.html">강의 의뢰</a>
        </div>
      </header>
      </>
    );
  }

  function Contact() {
    const subject = encodeURIComponent("[강의 의뢰] 서예진 강사님께 문의드립니다");
    return (
      <section className="contact" id="contact" aria-labelledby="contact-title">
        <div className="wrap contact-grid">
          <div>
            <p className="eyebrow">CONTACT</p>
            <h2 id="contact-title">강의 의뢰하기</h2>
            <p className="lead">교육 대상, 주제, 희망 일정을 알려 주시면 확인 후 회신드립니다.</p>
          </div>
          <address className="contact-list-wrap">
          <ul className="contact-list">
            <li><a href={`tel:${S.phone}`}><small>전화</small><b>{S.phone}</b></a></li>
            <li><a href={`mailto:${S.email}?subject=${subject}`}><small>이메일</small><b>{S.email}</b></a></li>
            <li><a href={S.blog} target="_blank" rel="noopener noreferrer"><small>운영 블로그</small><b>blog.naver.com/mersey77</b></a></li>
          </ul>
          </address>
        </div>
      </section>
    );
  }

  function Footer() {
    return (
      <footer className="footer">
        <div className="wrap">
          {S.name} · {S.role} · {S.affiliation}
          <br />
          <address>{S.phone} · <a href={`mailto:${S.email}`}>{S.email}</a></address>
        </div>
      </footer>
    );
  }

  Object.assign(window, { Header, Contact, Footer });
})();
