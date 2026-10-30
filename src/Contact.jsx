(function () {
  const { useState } = React;
  const S = window.SITE;

  const TOPICS = [...S.programs.map((p) => p.title), "AI 콘텐츠·숏폼 영상 제작", "AI 진로·커리어 역량 강화", "기타 (문의 내용에 적어 주세요)"];
  const EMPTY = { org: "", name: "", phone: "", email: "", topic: TOPICS[0], audience: "", date: "", message: "", agree: false, website: "" };

  function validate(v) {
    const e = {};
    if (!v.org.trim()) e.org = "기관·회사명을 입력해 주세요.";
    if (!v.name.trim()) e.name = "담당자 성함을 입력해 주세요.";
    if (!/^0\d{1,2}-?\d{3,4}-?\d{4}$/.test(v.phone.replace(/\s/g, ""))) e.phone = "연락처를 010-0000-0000 형식으로 입력해 주세요.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email.trim())) e.email = "올바른 이메일 주소를 입력해 주세요.";
    if (v.message.trim().length < 10) e.message = "교육 대상, 목적 등을 10자 이상 적어 주세요.";
    if (!v.agree) e.agree = "개인정보 수집·이용에 동의해 주세요.";
    return e;
  }

  function Field({ id, label, error, required, children }) {
    return (
      <div className={"field" + (error ? " has-error" : "")}>
        <label htmlFor={id}>
          {label}
          {required && <em aria-hidden="true"> *</em>}
        </label>
        {children}
        {error && (
          <p className="err" id={id + "-err"} role="alert">
            {error}
          </p>
        )}
      </div>
    );
  }

  function ContactForm() {
    const [v, setV] = useState(EMPTY);
    const [errors, setErrors] = useState({});
    const [sent, setSent] = useState(false);

    const set = (k) => (e) => setV({ ...v, [k]: e.target.type === "checkbox" ? e.target.checked : e.target.value });
    const aria = (k) => ({ "aria-invalid": errors[k] ? "true" : undefined, "aria-describedby": errors[k] ? k + "-err" : undefined });

    function onSubmit(e) {
      e.preventDefault();
      if (v.website) return; // 스팸 봇이 숨김 칸을 채운 경우
      const errs = validate(v);
      setErrors(errs);
      const first = Object.keys(errs)[0];
      if (first) {
        const el = document.getElementById(first);
        if (el) el.focus();
        return;
      }
      const body = [
        `기관·회사명: ${v.org}`,
        `담당자: ${v.name}`,
        `연락처: ${v.phone}`,
        `이메일: ${v.email}`,
        `관심 교육: ${v.topic}`,
        `교육 대상·인원: ${v.audience || "-"}`,
        `희망 일정: ${v.date || "-"}`,
        "",
        v.message,
      ].join("\n");
      const subject = encodeURIComponent(`[강의 의뢰] ${v.org} ${v.name}`);
      window.location.href = `mailto:${S.email}?subject=${subject}&body=${encodeURIComponent(body)}`;
      setSent(true);
    }

    if (sent) {
      return (
        <div className="form-done" role="status">
          <h2>메일 앱이 열렸습니다</h2>
          <p>
            작성하신 내용이 메일 본문에 자동으로 입력되었습니다. 메일 앱에서 <b>보내기</b>를 눌러야 전달이 완료됩니다.
            메일 앱이 열리지 않았다면 <a href={`mailto:${S.email}`}>{S.email}</a> 로 직접 보내 주시거나 {S.phone} 으로 연락해 주세요.
          </p>
          <button className="btn ghost dark" onClick={() => setSent(false)}>내용 수정하기</button>
        </div>
      );
    }

    return (
      <form className="inquiry" onSubmit={onSubmit} noValidate>
        <div className="row two">
          <Field id="org" label="기관·회사명" required error={errors.org}>
            <input id="org" value={v.org} onChange={set("org")} autoComplete="organization" {...aria("org")} />
          </Field>
          <Field id="name" label="담당자 성함" required error={errors.name}>
            <input id="name" value={v.name} onChange={set("name")} autoComplete="name" {...aria("name")} />
          </Field>
        </div>
        <div className="row two">
          <Field id="phone" label="연락처" required error={errors.phone}>
            <input id="phone" type="tel" placeholder="010-0000-0000" value={v.phone} onChange={set("phone")} autoComplete="tel" {...aria("phone")} />
          </Field>
          <Field id="email" label="이메일" required error={errors.email}>
            <input id="email" type="email" placeholder="name@company.com" value={v.email} onChange={set("email")} autoComplete="email" {...aria("email")} />
          </Field>
        </div>
        <Field id="topic" label="관심 교육 분야">
          <select id="topic" value={v.topic} onChange={set("topic")}>
            {TOPICS.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </Field>
        <div className="row two">
          <Field id="audience" label="교육 대상·인원">
            <input id="audience" placeholder="예: 신입사원 30명" value={v.audience} onChange={set("audience")} />
          </Field>
          <Field id="date" label="희망 일정">
            <input id="date" placeholder="예: 11월 둘째 주, 반일(4시간)" value={v.date} onChange={set("date")} />
          </Field>
        </div>
        <Field id="message" label="문의 내용" required error={errors.message}>
          <textarea id="message" rows="5" placeholder="교육 목적, 현재 AI 활용 수준, 원하시는 방식(대면·온라인) 등을 알려 주세요." value={v.message} onChange={set("message")} {...aria("message")} />
        </Field>

        {/* 스팸 방지용 숨김 칸: 사람은 보지 못합니다 */}
        <div className="hp" aria-hidden="true">
          <label>웹사이트<input tabIndex="-1" autoComplete="off" value={v.website} onChange={set("website")} /></label>
        </div>

        <div className={"consent" + (errors.agree ? " has-error" : "")}>
          <label>
            <input id="agree" type="checkbox" checked={v.agree} onChange={set("agree")} {...aria("agree")} />
            <span>
              <b>[필수]</b> 개인정보 수집·이용에 동의합니다. 수집 항목: 기관명, 성함, 연락처, 이메일, 문의 내용 / 이용 목적: 강의 문의 회신 / 보유 기간: 문의 처리 후 파기
            </span>
          </label>
          {errors.agree && <p className="err" id="agree-err" role="alert">{errors.agree}</p>}
        </div>

        <button className="btn primary" type="submit">문의 메일 작성하기</button>
        <p className="note">버튼을 누르면 사용 중인 메일 앱이 열리고 내용이 자동 입력됩니다. 메일을 <b>보내야</b> 접수됩니다.</p>
      </form>
    );
  }

  function ContactPage() {
    return (
      <>
        <Header base="index.html" active="contact" />
        <main id="main">
          <section className="hero page-hero" id="top" aria-labelledby="contact-page-title">
            <div className="wrap">
              <p className="eyebrow">CONTACT</p>
              <h1 className="h1-sm" id="contact-page-title">
                강의 의뢰하기
              </h1>
              <p className="lead">교육 대상과 목적, 희망 일정을 남겨 주시면 확인 후 회신드립니다. 급하시면 전화로 바로 문의해 주세요.</p>
              <p className="hot">
                <a href={`tel:${S.phone}`}>📞 {S.phone}</a>
              </p>
            </div>
          </section>
          <section className="sec alt" aria-labelledby="form-title">
            <div className="wrap form-wrap">
              <div className="form-side">
                <p className="kicker">INQUIRY</p>
                <h2 id="form-title">문의 내용을 알려 주세요</h2>
                <ul className="side-list">
                  <li><b>회신</b> 확인 후 연락드립니다.</li>
                  <li><b>맞춤 설계</b> 대상·직무·AI 활용 수준에 맞춰 커리큘럼을 제안합니다.</li>
                  <li><b>방식</b> 대면, 온라인, VOD 촬영 등 협의 가능합니다.</li>
                </ul>
                <address>
                  <a href={`mailto:${S.email}`}>{S.email}</a>
                  <br />
                  <a href={S.blog} target="_blank" rel="noopener noreferrer">blog.naver.com/mersey77</a>
                </address>
              </div>
              <ContactForm />
            </div>
          </section>
        </main>
        <Footer />
      </>
    );
  }

  ReactDOM.createRoot(document.getElementById("root")).render(<ContactPage />);
})();
