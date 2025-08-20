import React, { useEffect, useMemo, useRef, useState } from "react";

/** ───────── 테마/상수 ───────── */
const BGM_SRC = "/bgm/romantic-melody.mp3";
const THEME = {
  bg: "#FFF7F1",
  card: "#FFFFFF",
  ink: "#111111",
  sub: "#6b7280",
  line: "#ececec",
  hl: "#D67878",
};

const WEDDING_ISO = "2025-12-07T15:30:00+09:00";
const VENUE_NAME = "아펠가모 공덕 라로브홀";
const VENUE_ADDR = "서울 마포구 마포대로 92 효성해링턴스퀘어 B동 7층";
const VENUE_TEL = "02-2197-0230";

/** 외부 맵 단축 링크 */
const NAVER_PLACE_SHORT = "https://naver.me/xmBt7BeP";
const KAKAO_PLACE_SHORT = "https://kko.kakao.com/9oelYjxw4s";

/** 구글 임베드(사용자 제공) */
const GOOGLE_MAP_EMBED_SRC =
  "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d665.0499946684267!2d126.95144264138645!3d37.54260475685863!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x357c98a72107dfb7%3A0x8a1580d97d4055a!2z7JWE7Y6g6rCA66qoIOqzteuNlQ!5e0!3m2!1sko!2skr!4v1755693421661!5m2!1sko!2skr";

/** 연락처/계좌 */
const GROOM_LINE = "이영철 · 이경희 의 아들 현석";
const BRIDE_LINE = "유기만 · 정원경 의 딸 지현";
const GROOM_TEL = "010-4100-5960";
const BRIDE_TEL = "010-3350-7890";

const GROOM_ACCOUNTS = [
  { bank: "우리은행", number: "1002-743-669917", holder: "이현석" },
  { bank: "국민", number: "000-000-000000", holder: "이영철" },
  { bank: "국민", number: "000-000-000000", holder: "이경희" },
];
const BRIDE_ACCOUNTS = [
  { bank: "국민", number: "000-000-000000", holder: "유지현" },
  { bank: "국민", number: "000-000-000000", holder: "유기만" },
  { bank: "국민", number: "000-000-000000", holder: "정원경" },
];

/** 앨범 index.json 타입 */
type AlbumIndex = { main: string; album: string[] };

/** 유틸 */
const pad2 = (n: number) => (n < 10 ? `0${n}` : `${n}`);
function daysUntil(iso: string) {
  const event = new Date(iso);
  const startOf = (d: Date) =>
    new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
  const today = new Date();
  return Math.ceil((startOf(event) - startOf(today)) / 86400000);
}
function formatKoreanDateTime(iso: string) {
  const d = new Date(iso);
  const w = ["일요일","월요일","화요일","수요일","목요일","금요일","토요일"][d.getDay()];
  let h = d.getHours();
  const ampm = h < 12 ? "오전" : "오후";
  h = h % 12 || 12;
  const m = d.getMinutes();
  return `${d.getFullYear()}년 ${d.getMonth()+1}월 ${d.getDate()}일 ${w} ${ampm} ${h}시 ${m.toString().padStart(2,"0")}분`;
}

/** ───────── 메인 컴포넌트 ───────── */
export default function WeddingInvite() {
  /** BGM */
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const toggleBgm = async () => {
    const a = audioRef.current;
    if (!a) return;
    if (a.paused) {
      try { await a.play(); setIsPlaying(true); } catch {}
    } else { a.pause(); setIsPlaying(false); }
  };

  /** 날짜 파생 */
  const eventDate = useMemo(() => new Date(WEDDING_ISO), []);
  const mm = pad2(eventDate.getMonth() + 1);
  const dd = pad2(eventDate.getDate());
  const dateLine = useMemo(() => formatKoreanDateTime(WEDDING_ISO), []);

  /** D-day (자정 자동 갱신) */
  const [dDay, setDDay] = useState(() => daysUntil(WEDDING_ISO));
  useEffect(() => {
    const update = () => setDDay(daysUntil(WEDDING_ISO));
    const now = new Date();
    const nextMidnight = new Date(now); nextMidnight.setHours(24, 0, 0, 0);
    const toMidnight = nextMidnight.getTime() - now.getTime();
    let intervalId: number | undefined;
    const timeoutId = window.setTimeout(() => {
      update(); intervalId = window.setInterval(update, 86400000);
    }, toMidnight);
    return () => { window.clearTimeout(timeoutId); if (intervalId) window.clearInterval(intervalId); };
  }, []);

  /** 2025-12 달력 */
  const days = ["일", "월", "화", "수", "목", "금", "토"];
  const dec2025Cells = useMemo(() => {
    const first = new Date("2025-12-01T00:00:00+09:00");
    const firstDay = first.getDay(), total = 31;
    const cells: (number | null)[] = [];
    for (let i = 0; i < firstDay; i++) cells.push(null);
    for (let d = 1; d <= total; d++) cells.push(d);
    return cells;
  }, []);

  /** 전역: 사진 확대/저장 방지 (지도 제외) */
  useEffect(() => {
    const isImageContext = (el: EventTarget | null) => {
      const node = el as HTMLElement | null;
      return !!node && (node.tagName === "IMG" || !!node.closest("img,[data-photo]"));
    };

    const preventMultiTouchOnImg = (e: TouchEvent) => {
      if (e.touches.length > 1 && isImageContext(e.target)) e.preventDefault();
    };
    const preventGestureOnImg = (e: Event) => {
      if (isImageContext(e.target)) e.preventDefault();
    };
    let lastTap = 0;
    const preventDoubleTapOnImg = (e: TouchEvent) => {
      if (!isImageContext(e.target)) return;
      const now = Date.now();
      if (now - lastTap < 350) e.preventDefault();
      lastTap = now;
    };
    const preventContextOnImg = (e: Event) => {
      if (isImageContext(e.target)) e.preventDefault();
    };

    document.addEventListener("touchstart", preventMultiTouchOnImg, { passive: false });
    document.addEventListener("gesturestart", preventGestureOnImg as any, { passive: false } as any);
    document.addEventListener("gesturechange", preventGestureOnImg as any, { passive: false } as any);
    document.addEventListener("gestureend", preventGestureOnImg as any, { passive: false } as any);
    document.addEventListener("touchend", preventDoubleTapOnImg, { passive: false });
    document.addEventListener("contextmenu", preventContextOnImg);

    // IMG 공통 저장/선택 방지 스타일
    const style = document.createElement("style");
    style.textContent = `
      img { -webkit-touch-callout: none !important; user-select: none !important; }
      body { touch-action: manipulation; }
    `;
    document.head.appendChild(style);

    return () => {
      document.removeEventListener("touchstart", preventMultiTouchOnImg as any);
      document.removeEventListener("gesturestart", preventGestureOnImg as any);
      document.removeEventListener("gesturechange", preventGestureOnImg as any);
      document.removeEventListener("gestureend", preventGestureOnImg as any);
      document.removeEventListener("touchend", preventDoubleTapOnImg as any);
      document.removeEventListener("contextmenu", preventContextOnImg as any);
      document.head.removeChild(style);
    };
  }, []);

  /** 앨범 index.json 로드 */
  const [albumIndex, setAlbumIndex] = useState<AlbumIndex | null>(null);
  const [albumError, setAlbumError] = useState<string | null>(null);
  useEffect(() => {
    let canceled = false;
    (async () => {
      try {
        const res = await fetch("/images/album/index.json", { cache: "no-store" });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = (await res.json()) as AlbumIndex;
        const clean = (data.album || [])
          .filter((f) => typeof f === "string" && f.trim())
          .map((f) => f.trim());
        if (!canceled) { setAlbumIndex({ main: data.main, album: clean }); setAlbumError(null); }
      } catch {
        if (!canceled) { setAlbumIndex(null); setAlbumError("앨범 목록(index.json)을 불러오지 못했습니다."); }
      }
    })();
    return () => { canceled = true; };
  }, []);

  const MAIN_IMG = albumIndex
    ? `/images/album/${albumIndex.main}`
    : "/images/album/Bloom_25_06_13_073904.JPG";

  /** 복사 */
  const copy = async (txt: string) => {
    try { await navigator.clipboard.writeText(txt); alert(`복사되었습니다: ${txt}`); } catch {}
  };

  /** 앨범 뷰어(확대 금지 + 스와이프) */
  const [viewerOpen, setViewerOpen] = useState(false);
  const [viewerIdx, setViewerIdx] = useState(0);
  const images = albumIndex?.album ?? [];

  const openViewer = (idx: number) => { setViewerIdx(idx); setViewerOpen(true); };
  const closeViewer = () => setViewerOpen(false);
  const next = () => setViewerIdx((i) => (i + 1) % images.length);
  const prev = () => setViewerIdx((i) => (i - 1 + images.length) % images.length);

  useEffect(() => {
    if (!viewerOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeViewer();
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    const onWheel = (e: WheelEvent) => { if (e.ctrlKey) e.preventDefault(); };
    window.addEventListener("keydown", onKey);
    window.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("wheel", onWheel as any);
    };
  }, [viewerOpen, images.length]);

  const touchStartX = useRef<number | null>(null);
  const lastTouchEnd = useRef<number>(0);
  const onTouchStart = (e: React.TouchEvent) => { touchStartX.current = e.touches[0].clientX; };
  const onTouchEnd = (e: React.TouchEvent) => {
    const now = Date.now();
    if (now - lastTouchEnd.current <= 350) e.preventDefault();
    lastTouchEnd.current = now;
    if (touchStartX.current == null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    touchStartX.current = null;
    if (Math.abs(dx) > 50) { dx < 0 ? next() : prev(); }
  };

  /** 메인/우디 이미지 로딩 상태 */
  const [mainLoaded, setMainLoaded] = useState(false);
  const [woodyLoaded, setWoodyLoaded] = useState(false);

  /** 렌더 */
  return (
    <main className="min-h-screen font-sans" style={{ background: THEME.bg, color: THEME.ink }}>
      {/* 상단 그라데이션(장식) */}
      <div
        className="fixed inset-x-0 top-0 h-24 pointer-events-none -z-0"
        style={{ background: "linear-gradient(180deg, rgba(214,120,120,0.10), rgba(214,120,120,0))" }}
      />

      {/* BGM 토글 */}
      <button
        onClick={toggleBgm}
        aria-label={isPlaying ? "배경음악 일시정지" : "배경음악 재생"}
        aria-pressed={isPlaying}
        className="fixed right-3.5 top-3.5 z-20 w-11 h-11 rounded-full shadow-md flex items-center justify-center transition active:scale-95"
        style={{ background: "#9b9b9b", color: "#fff" }}
      >
        {isPlaying ? <SpeakerOn width={20} height={20} /> : <SpeakerOff width={20} height={20} />}
      </button>
      <audio ref={audioRef} src={BGM_SRC} preload="none" loop className="hidden" />

      {/* 1) 대형 타이포 배너 */}
      <section className="max-w-md mx-auto px-5 pt-10 pb-5">
        <div className="flex items-end justify-between">
          <h1
            className="tracking-[0.2em]"
            style={{ fontFamily: "'Noto Serif KR', ui-serif, serif", fontSize: "clamp(22px, 5vw, 32px)", fontWeight: 500 }}
          >
            이&nbsp;현&nbsp;석
          </h1>
          <div className="text-center mx-3 select-none">
            <div className="leading-none" style={{ fontFamily: "'Noto Serif KR', ui-serif, serif", fontSize: "clamp(40px, 10.5vw, 72px)" }}>{mm}</div>
            <div className="w-9 mx-auto my-1 border-t" style={{ borderColor: "#DADADA" }} />
            <div className="leading-none" style={{ fontFamily: "'Noto Serif KR', ui-serif, serif", fontSize: "clamp(40px, 10.5vw, 72px)" }}>{dd}</div>
          </div>
          <h1
            className="tracking-[0.2em] text-right"
            style={{ fontFamily: "'Noto Serif KR', ui-serif, serif", fontSize: "clamp(22px, 5vw, 32px)", fontWeight: 500 }}
          >
            유&nbsp;지&nbsp;현
          </h1>
        </div>
      </section>

      {/* 2) 메인 이미지 */}
      <section className="max-w-md mx-auto px-5">
        <figure className="rounded-[20px] overflow-hidden shadow-sm bg-white">
          <div className="relative w-full aspect-[3/4]">
            <div
              className="absolute inset-0 animate-pulse"
              style={{
                background: "linear-gradient(90deg, #f5ece7 25%, #f0e6e0 37%, #f5ece7 63%)",
                backgroundSize: "400% 100%",
                opacity: mainLoaded ? 0 : 1,
                transition: "opacity .35s ease",
              }}
            />
            <div className="absolute inset-0" data-photo onContextMenu={(e) => e.preventDefault()} />
            <img
              src={MAIN_IMG}
              alt="메인 웨딩 사진"
              className="absolute inset-0 w-full h-full object-contain"
              loading="eager"
              decoding="async"
              fetchPriority="high"
              sizes="(max-width: 480px) 100vw, 448px"
              onLoad={() => setMainLoaded(true)}
              style={{
                opacity: mainLoaded ? 1 : 0,
                transform: mainLoaded ? "translateY(0px)" : "translateY(8px)",
                transition: "opacity .48s ease, transform .48s ease",
                WebkitUserSelect: "none",
                userSelect: "none",
                WebkitTouchCallout: "none",
                pointerEvents: "none",
              }}
              draggable={false}
              onContextMenu={(e) => e.preventDefault()}
            />
          </div>
        </figure>
      </section>

      {/* 2.1) 날짜/장소 */}
      <section className="max-w-md mx-auto px-5 mt-3">
        <p className="text-center text-gray-700" style={{ fontSize: "clamp(13px,3.2vw,14px)" }}>
          {dateLine}
        </p>
        <p className="text-center text-gray-900 font-medium" style={{ fontSize: "clamp(14px,3.6vw,16px)" }}>
          {VENUE_NAME}
        </p>
      </section>

      {/* 3) 시 + 초대문 */}
      <section className="max-w-md mx-auto px-5 mt-8">
        <Card className="text-center p-7">
          <div className="flex justify-center">
            <div className="w-8 h-8 rounded-full bg-[#F6E8E8]/60 flex items-center justify-center">
              <span aria-hidden className="text-[10px] text-[#8a6a6a]">✿</span>
            </div>
          </div>

          <div
            className="mt-4 text-gray-800"
            style={{ fontFamily: "'Noto Serif KR', ui-serif, serif", fontSize: "clamp(16px, 3.7vw, 20px)", lineHeight: 1.85 }}
          >
            <p>장담하건대, 세상이 다 겨울이어도</p>
            <p className="mt-1.5">우리 사랑은 늘봄처럼 따뜻하고</p>
            <p className="mt-1.5">간혹, 여름처럼 뜨거울 겁니다</p>
            <p className="mt-2 text-gray-500" style={{ fontSize: "0.95em" }}>– 이수동, &lt;사랑가&gt; –</p>
          </div>

          <div className="my-6 h-px" style={{ background: "#eee" }} />

          <h3 className="tracking-[0.35em] text-gray-500" style={{ fontSize: "clamp(11px, 2.6vw, 13px)" }}>INVITATION</h3>
          <div className="mt-4 text-gray-900" style={{ fontSize: "clamp(16px, 3.6vw, 20px)", lineHeight: 1.85 }}>
            <p>사랑이 봄처럼 시작되어</p>
            <p className="mt-1.5">겨울의 약속으로 이어집니다.</p>
            <p className="mt-1.5">하루하루의 마음이 저희의 계절을 만들었으니</p>
            <p className="mt-1.5">함께 오셔서 따뜻히 축복해 주시면 감사하겠습니다.</p>
          </div>
        </Card>
      </section>

      {/* 3.5) 우디 사진 */}
      <section className="max-w-md mx-auto px-5 mt-6">
        <figure className="rounded-[20px] overflow-hidden shadow-sm bg-white">
          <div className="relative w-full aspect-[3/4]">
            <div
              className="absolute inset-0 animate-pulse"
              style={{
                background: "linear-gradient(90deg, #f5ece7 25%, #f0e6e0 37%, #f5ece7 63%)",
                backgroundSize: "400% 100%",
                opacity: woodyLoaded ? 0 : 1,
                transition: "opacity .35s ease",
              }}
            />
            <div className="absolute inset-0" data-photo onContextMenu={(e) => e.preventDefault()} />
            <img
              src="/images/album/woody_25_06_13_069994.JPG"
              alt="우디 사진"
              className="absolute inset-0 w-full h-full object-contain"
              loading="lazy"
              decoding="async"
              fetchPriority="low"
              sizes="(max-width: 480px) 100vw, 448px"
              onLoad={() => setWoodyLoaded(true)}
              style={{
                opacity: woodyLoaded ? 1 : 0,
                transform: woodyLoaded ? "translateY(0px)" : "translateY(8px)",
                transition: "opacity .48s ease, transform .48s ease",
                WebkitUserSelect: "none",
                userSelect: "none",
                WebkitTouchCallout: "none",
                pointerEvents: "none",
              }}
              draggable={false}
              onContextMenu={(e) => e.preventDefault()}
            />
          </div>
        </figure>
      </section>

      {/* 4) 연락 라인 */}
      <section className="max-w-md mx-auto px-5 mt-6">
        <Card>
          <ContactRow label={GROOM_LINE} tel={GROOM_TEL} />
          <Divider />
          <ContactRow label={BRIDE_LINE} tel={BRIDE_TEL} />
        </Card>
      </section>

      {/* 5) 달력 + D-day */}
      <CalendarCard days={days} cells={dec2025Cells} highlight={THEME.hl} dDay={dDay} />

      {/* 6) 오시는 길 + 구글 지도 (확대 가능) */}
      <section className="max-w-md mx-auto px-5 mt-6">
        <Card className="text-center">
          <h2 className="font-semibold mb-1.5" style={{ color: THEME.hl, fontSize: "clamp(15px,4vw,17px)" }}>
            오시는 길
          </h2>
          <p className="font-bold" style={{ fontSize: "clamp(14.5px,3.8vw,16px)" }}>{VENUE_NAME}</p>
          <p className="mt-1 text-gray-700" style={{ fontSize: "clamp(13px,3.2vw,14px)" }}>
            {VENUE_ADDR}
          </p>

          <div className="mt-3">
            <a
              href={`tel:${VENUE_TEL.replace(/[^0-9]/g, "")}`}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition border"
              style={{ background: THEME.ink, color: "#fff", borderColor: "transparent" }}
            >
              <PhoneIcon width={16} height={16} /> 안내 전화
            </a>
          </div>

          <div className="mt-5 rounded-2xl overflow-hidden shadow-sm border" style={{ borderColor: THEME.line }}>
            <GoogleMapEmbed src={GOOGLE_MAP_EMBED_SRC} height={380} />
          </div>

          <div className="mt-5 grid grid-cols-2 gap-3">
            <AppLink label="네이버 지도" href={NAVER_PLACE_SHORT}>
              <NaverOfficialIcon className="w-5 h-5" />
            </AppLink>
            <AppLink label="카카오 지도" href={KAKAO_PLACE_SHORT}>
              <KakaoMapOfficialIcon className="w-5 h-5" />
            </AppLink>
          </div>
        </Card>
      </section>

      {/* 7) 교통/주차/안내 */}
      <InfoSections highlight={THEME.hl} />

      {/* 7.1) 추가 안내 – 분리 강조 */}
      <ImportantNoticeCard />
      
      {/* 8) 앨범 (3열) */}
      <section className="max-w-md mx-auto px-5 mt-6" onContextMenu={(e) => e.preventDefault()}>
        <Card>
          <h3 className="text-center font-semibold mb-3" style={{ color: THEME.hl, fontSize: "clamp(15px,4vw,17px)" }}>
            ALBUM
          </h3>
          {albumError && <p className="text-sm text-red-500 text-center mb-3">{albumError}</p>}

          <div className="grid grid-cols-3 gap-3 select-none" style={{ WebkitTouchCallout: "none" }}>
            {(albumIndex?.album ?? []).map((file, idx) => (
              <figure
                key={`${file}-${idx}`}
                className="rounded-xl overflow-hidden bg-gray-100 cursor-zoom-in relative"
                role="button"
                tabIndex={0}
                onClick={() => openViewer(idx)}
                onKeyDown={(e) => (e.key === "Enter" ? openViewer(idx) : null)}
              >
                <img
                  src={`/images/album/${file}`}
                  alt={`album-${idx}`}
                  loading="lazy"
                  decoding="async"
                  fetchPriority="low"
                  className="w-full aspect-square object-cover pointer-events-none"
                  style={{ WebkitUserSelect: "none", userSelect: "none", contentVisibility: "auto" }}
                  draggable={false}
                  onContextMenu={(e) => e.preventDefault()}
                  onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                />
              </figure>
            ))}
          </div>
        </Card>
      </section>

      {/* 9) 마음 전하는 곳 */}
      <section className="max-w-md mx-auto px-5 mt-6 pb-20">
        <Card>
          <h2 className="text-center font-semibold mb-3" style={{ color: THEME.hl, fontSize: "clamp(15px,4vw,17px)" }}>
            마음을 전하는 곳
          </h2>
          <Accordion title="신랑측 계좌번호">
            <AccountList accounts={GROOM_ACCOUNTS} onCopy={(v) => copy(v)} />
          </Accordion>
          <Accordion title="신부측 계좌번호">
            <AccountList accounts={BRIDE_ACCOUNTS} onCopy={(v) => copy(v)} />
          </Accordion>
          <p className="mt-1 text-[11px] text-gray-500">예식장 내 화환 반입이 불가하여 마음만 감사히 받겠습니다.</p>
        </Card>
      </section>

      {/* ── 풀스크린 앨범 뷰어 ── */}
      {viewerOpen && images.length > 0 && (
        <div
          className="fixed inset-0 z-50 bg-black/90 text-white flex items-center justify-center"
          onClick={closeViewer}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
          style={{ WebkitTouchCallout: "none", WebkitUserSelect: "none", userSelect: "none", touchAction: "pan-y", overscrollBehavior: "contain" }}
          onContextMenu={(e) => e.preventDefault()}
        >
          <button
            onClick={(e) => { e.stopPropagation(); closeViewer(); }}
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/15 backdrop-blur flex items-center justify-center"
            aria-label="닫기"
          >
            ×
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); prev(); }}
            className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/15 backdrop-blur flex items-center justify-center"
            aria-label="이전 사진"
          >
            ‹
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); next(); }}
            className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/15 backdrop-blur flex items-center justify-center"
            aria-label="다음 사진"
          >
            ›
          </button>

          <div className="absolute inset-0" data-photo onContextMenu={(e) => e.preventDefault()} />

          <img
            src={`/images/album/${images[viewerIdx]}`}
            alt={`album-view-${viewerIdx}`}
            className="max-w-[96vw] max-h-[85vh] object-contain"
            draggable={false}
            onContextMenu={(e) => e.preventDefault()}
            style={{ WebkitUserSelect: "none", userSelect: "none", WebkitTouchCallout: "none", pointerEvents: "none" }}
          />

          <div className="absolute bottom-4 text-sm opacity-80">
            {viewerIdx + 1} / {images.length}
          </div>
        </div>
      )}
    </main>
  );
}

/* ───────── 공통 컴포넌트/유틸 ───────── */

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-[20px] shadow-sm p-6 bg-white ${className}`} style={{ background: THEME.card }}>
      {children}
    </div>
  );
}
function Divider() { return <div className="my-3 h-px" style={{ background: THEME.line }} />; }

/** Google Map Embed */
function GoogleMapEmbed({ src, height = 380 }: { src: string; height?: number }) {
  return (
    <iframe
      title="Google Map"
      src={src}
      width="100%"
      height={height}
      style={{ border: 0, display: "block" }}
      loading="lazy"
      allowFullScreen
      referrerPolicy="no-referrer-when-downgrade"
    />
  );
}

/** 연락행 */
function ContactRow({ label, tel }: { label: string; tel: string }) {
  const digits = tel.replace(/[^0-9]/g, "");
  return (
    <div className="flex items-center justify-between gap-3">
      <p className="text-[14.5px]">{label}</p>
      <div className="flex items-center gap-2">
        <a
          href={`tel:${digits}`}
          aria-label="전화 걸기"
          title="전화 걸기"
          className="w-10 h-10 rounded-full bg-white border shadow flex items-center justify-center text-gray-700"
          style={{ borderColor: THEME.line }}
        >
          <PhoneIcon width={18} height={18} />
        </a>
        <a
          href={`sms:${digits}`}
          aria-label="문자 보내기"
          title="문자 보내기"
          className="w-10 h-10 rounded-full bg-white border shadow flex items-center justify-center"
          style={{ color: THEME.hl, borderColor: THEME.line }}
        >
          <SmsIcon width={18} height={18} />
        </a>
      </div>
    </div>
  );
}

/** 달력 카드 */
function CalendarCard({
  days, cells, highlight, dDay,
}: { days: string[]; cells: (number | null)[]; highlight: string; dDay: number; }) {
  const label = dDay > 0 ? `${dDay}일 전` : dDay === 0 ? "오늘" : `${Math.abs(dDay)}일 지남`;
  return (
    <section className="max-w-md mx-auto px-5 mt-6">
      <Card>
        <h3 className="text-center font-medium" style={{ fontSize: "clamp(17px,4.2vw,21px)" }}>12월</h3>
        <div className="grid grid-cols-7 gap-3 text-center text-gray-600 mt-3" style={{ fontSize: "clamp(11px,2.8vw,13px)" }}>
          {days.map((d) => <div key={d}>{d}</div>)}
        </div>
        <div className="grid grid-cols-7 gap-3 text-center mt-2" style={{ fontSize: "clamp(15px,4vw,18px)" }}>
          {cells.map((n, i) =>
            n === null ? <div key={i} /> : (
              <div key={i} className={`w-10 h-10 mx-auto flex items-center justify-center rounded-full ${n === 7 ? "text-white font-bold" : "text-gray-800"}`}
                   style={n === 7 ? { backgroundColor: highlight } : {}}>{n}</div>
            )
          )}
        </div>
        <p className="mt-5 text-center" style={{ color: highlight, fontSize: "clamp(14px,3.6vw,16px)" }}>
          이현석 ❤ 유지현 의 결혼식 {label}
        </p>
      </Card>
    </section>
  );
}

/** 안내 섹션 */
function InfoSections({ highlight }: { highlight: string }) {
  return (
    <section className="max-w-md mx-auto px-5 mt-6">
      <Card>
        <InfoBlock title="지하철" highlight={highlight}>
          공덕역 ⑦번 출구 (5호선, 6호선) [도보 2분] <br />
          공덕역 ⑩번 출구 (경의중앙선, 공항철도) [도보 1분]
        </InfoBlock>
        <Divider />
        <InfoBlock title="버스" highlight={highlight}>
          파란 간선 : 160, 260, 600 <br />
          초록 지선 : 7013A, 7013B, 7611 <br />
          마을버스 : 마포01, 마포02, 마포10 <br />
          일반버스 : 1002
        </InfoBlock>
        <Divider />
        <InfoBlock title="주차" highlight={highlight}>
          효성해링턴스퀘어 본 건물 주차 (2시간 무료) <br />
          [외부 주차장 : SUN 장학빌딩, 하이파킹 공덕역점, 경보 주차장]
        </InfoBlock>
      </Card>
    </section>
  );
}

function ImportantNoticeCard() {
  return (
    <section className="max-w-md mx-auto px-5 mt-4">
      <div
        className="rounded-[20px] p-5 border shadow-sm"
        style={{ background: "#FFFDF8", borderColor: "#F4D7D7" }}
        aria-labelledby="important-notice-title"
      >
        <div className="flex items-center gap-2 mb-2">
          {/* 강조 아이콘 */}
          <span className="inline-flex items-center justify-center w-6 h-6 rounded-full text-white"
                style={{ background: "#D67878" }}>!</span>
          <h4 id="important-notice-title" className="font-semibold" style={{ color: "#D67878" }}>
            추가 안내
          </h4>
        </div>
        <ul className="list-disc pl-5 text-[14.5px] leading-7 text-gray-800">
          <li>예식장 내 <b>화환 반입이 불가</b>합니다. 마음만 감사히 받겠습니다.</li>
          {/* 필요 시 항목을 더 추가해도 됩니다 */}
        </ul>
      </div>
    </section>
  );
}

function InfoBlock({ title, highlight, children }: { title: string; highlight: string; children: React.ReactNode }) {
  return (
    <div>
      <h4 className="font-semibold mb-1.5" style={{ color: highlight, fontSize: "clamp(15px,4vw,17px)" }}>{title}</h4>
      <p className="text-gray-700" style={{ fontSize: "clamp(14px,3.6vw,15px)", lineHeight: 1.8 }}>{children}</p>
    </div>
  );
}

/** 아코디언/계좌 */
function Accordion({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border rounded-2xl bg-white shadow-sm mb-3 overflow-hidden" style={{ borderColor: THEME.line }}>
      <button onClick={() => setOpen((v) => !v)} className="w-full flex items-center justify-between px-4 py-3 text-left">
        <span className="text-[15px]">{title}</span>
        <span className="text-xl" aria-hidden>{open ? "▾" : "▸"}</span>
      </button>
      {open && <div className="px-4 pb-4">{children}</div>}
    </div>
  );
}
function AccountList({ accounts, onCopy }: { accounts: { bank: string; number: string; holder: string }[]; onCopy: (txt: string) => void; }) {
  return (
    <ul className="space-y-3">
      {accounts.map((a, i) => (
        <li key={i} className="flex items-center justify-between gap-3 pb-3 border-b" style={{ borderColor: THEME.line }}>
          <div className="text-[13.5px]">
            <div className="font-medium">{`${a.bank} ${a.number}`}</div>
            <div className="text-gray-500">{a.holder}</div>
          </div>
          <button onClick={() => onCopy(a.number)} className="shrink-0 rounded-md px-3 py-1.5 text-[12.5px] border transition" style={{ borderColor: THEME.line }}>
            복사
          </button>
        </li>
      ))}
    </ul>
  );
}

/** 지도 링크 버튼 */
function AppLink({ label, href, children }: { label: string; href: string; children: React.ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer"
       className="w-full h-12 rounded-xl bg-white border shadow-sm flex items-center justify-center gap-2 text-[13.5px] font-medium transition active:scale-[0.98]"
       style={{ borderColor: THEME.line }}>
      {children}<span>{label}</span>
    </a>
  );
}

/** 아이콘들 */
function SpeakerOn(props: React.SVGProps<SVGSVGElement>) { return (
  <svg viewBox="0 0 24 24" {...props}>
    <path fill="currentColor" d="M11 5.5c0-.6-.7-.9-1.1-.5L6.8 8H4.5A1.5 1.5 0 0 0 3 9.5v5A1.5 1.5 0 0 0 4.5 16H6.8l3.1 3c.4.4 1.1.1 1.1-.5V5.5z" />
    <path d="M16 9a3 3 0 0 1 0 6" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" />
    <path d="M18 7a6 6 0 0 1 0 10" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" />
  </svg>
);}

function SpeakerOff(props: React.SVGProps<SVGSVGElement>) { return (
  <svg viewBox="0 0 24 24" {...props}>
    <path fill="currentColor" d="M11 5.5c0-.6-.7-.9-1.1-.5L6.8 8H4.5A1.5 1.5 0 0 0 3 9.5v5A1.5 1.5 0 0 0 4.5 16H6.8l3.1 3c.4.4 1.1.1 1.1-.5V5.5z" />
    <line x1="15" y1="9" x2="21" y2="15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <line x1="21" y1="9" x2="15" y2="15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);}

function PhoneIcon(props: React.SVGProps<SVGSVGElement>) { return (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
    <path strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
          d="M22 16.5v3a2 2 0 0 1-2.2 2A19.5 19.5 0 0 1 2.5 4.2 2 2 0 0 1 4.5 2h3a2 2 0 0 1 2 1.7c.12.8.32 1.6.58 2.4a2 2 0 0 1-.44 2.1L9 10a16 16 0 0 0 5 5l.7-1.1a2 2 0 0 1 2.1-.45c.8.26 1.6.46 2.4.58A2 2 0 0 1 22 16.5z" />
  </svg>
);}

function SmsIcon(props: React.SVGProps<SVGSVGElement>) { return (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
    <rect x="3" y="4" width="18" height="14" rx="3" strokeWidth="1.8" />
    <path d="M7 9h10M7 13h6" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);}

/** 네이버 아이콘 – 녹색 배경 + 정중앙 흰색 N */
function NaverOfficialIcon(props: React.HTMLAttributes<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={24}
      height={24}
      aria-label="네이버"
      {...props}
    >
      {/* 배경 (녹색) */}
      <rect width="24" height="24" rx="5" fill="#03C75A" />

      {/* 흰색 N (정중앙 배치) */}
      <path
        d="M8 6h3.5l4.5 6.8V6h2v12h-3.5L10.5 11.2V18H8V6z"
        fill="#FFFFFF"
      />
    </svg>
  );
}

/** 카카오 지도 아이콘(동일) */
function KakaoMapOfficialIcon(props: React.HTMLAttributes<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" aria-label="카카오 지도" {...props}>
      <rect width="24" height="24" rx="5" fill="#FFE812" />
      <path d="M12 4c-3.314 0-6 2.686-6 6 0 3.42 2.64 6.17 4.86 8.86.64.76 1.64.76 2.28 0C15.36 16.17 18 13.42 18 10c0-3.314-2.686-6-6-6z" fill="#1485EE"/>
      <circle cx="12" cy="10" r="2.3" fill="#FFE812" />
    </svg>
  );
}
