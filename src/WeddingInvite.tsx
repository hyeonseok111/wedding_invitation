import React, { useEffect, useMemo, useRef, useState } from "react";

/** ───────── 고정 텍스트/색상 설정 ───────── */
const BGM_SRC = "/bgm/romantic-melody.mp3";
const HIGHLIGHT = "#d98282";

const WEDDING_ISO = "2025-12-07T15:30:00+09:00";
const VENUE_NAME = "아펠가모 공덕 라로브홀";
const VENUE_ADDR = "서울 마포구 마포대로 92 효성해링턴스퀘어 B동 7층";
const VENUE_TEL = "02-2197-0230";

/** 하단 앱 버튼 검색어(라로브홀 제외) */
const VENUE_SEARCH = "아펠가모 공덕";

/** ▼ 카카오 퍼가기 값(네가 준 값) */
const KAKAO_ROUGHMAP_TIMESTAMP = "1755526725995";
const KAKAO_ROUGHMAP_KEY = "78iir7azr4f";
const KAKAO_MAP_HEIGHT = 360;

/** 앨범 인덱스 타입 */
type AlbumIndex = { main: string; album: string[] };

/* ====================== 카카오 roughmap 컴포넌트 ====================== */
function KakaoRoughMap({
  timestamp,
  mapKey,
  width = "100%",
  height = 360,
}: {
  timestamp: string;
  mapKey: string;
  width?: number | string;
  height?: number | string;
}) {
  const containerId = `daumRoughmapContainer${timestamp}`;

  useEffect(() => {
    let disposed = false;

    const waitForDaum = () =>
      new Promise<void>((resolve) => {
        const ok = () => (window as any).daum?.roughmap?.Lander;
        if (ok()) return resolve();
        const iv = setInterval(() => {
          if (ok()) {
            clearInterval(iv);
            resolve();
          }
        }, 50);
      });

    const waitForContainer = () =>
      new Promise<void>((resolve) => {
        const tick = () => {
          const el = document.getElementById(containerId);
          if (el) resolve();
          else requestAnimationFrame(tick);
        };
        tick();
      });

    (async () => {
      await waitForContainer();
      await waitForDaum();
      if (disposed) return;

      // 이미 랜더된 경우 중복 방지: 컨테이너 비우기
      const root = document.getElementById(containerId);
      if (!root) return;
      root.innerHTML = "";

      const lander = new (window as any).daum.roughmap.Lander({
        timestamp,
        key: mapKey,
        mapWidth: typeof width === "number" ? `${width}px` : width,
        mapHeight: typeof height === "number" ? `${height}px` : height,
      });
      lander.render();

      // 핀치/드래그 제스처 허용
      root.style.touchAction = "auto";
      const observer = new MutationObserver(() => {
        const iframe = root.querySelector("iframe") as HTMLIFrameElement | null;
        if (iframe) {
          iframe.style.pointerEvents = "auto";
          (iframe.style as any).touchAction = "auto";
        }
      });
      observer.observe(root, { childList: true, subtree: true });
      return () => observer.disconnect();
    })();

    return () => {
      disposed = true;
      const el = document.getElementById(containerId);
      if (el) el.innerHTML = "";
    };
  }, [containerId, height, mapKey, width]);

  return (
    <div
      id={containerId}
      className="root_daum_roughmap root_daum_roughmap_landing"
      style={{
        width: typeof width === "number" ? `${width}px` : width,
        height: typeof height === "number" ? `${height}px` : height,
        touchAction: "auto",
      }}
    />
  );
}
/* ===================================================================== */

export default function WeddingInvite() {
  /** ── BGM ── */
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const toggleBgm = async () => {
    const a = audioRef.current;
    if (!a) return;
    if (a.paused) { try { await a.play(); setIsPlaying(true); } catch {} }
    else { a.pause(); setIsPlaying(false); }
  };

  /** ── D-day ── */
  const dDay = useMemo(() => {
    const event = new Date(WEDDING_ISO);
    const today = new Date();
    const startOf = (d: Date) =>
      new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
    return Math.ceil((startOf(event) - startOf(today)) / 86400000);
  }, []);

  /** ── 앨범 index.json 로드 ── */
  const [albumIndex, setAlbumIndex] = useState<AlbumIndex | null>(null);
  const [albumError, setAlbumError] = useState<string | null>(null);
  useEffect(() => {
    let canceled = false;
    (async () => {
      try {
        const res = await fetch("/images/album/index.json", { cache: "no-store" });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = (await res.json()) as AlbumIndex;
        const sorted = Array.from(new Set(data.album.filter(Boolean).map((f) => String(f).trim())))
          .sort((a, b) => b.localeCompare(a, undefined, { numeric: true }));
        if (!canceled) { setAlbumIndex({ main: data.main, album: sorted }); setAlbumError(null); }
      } catch {
        if (!canceled) { setAlbumIndex(null); setAlbumError("앨범 목록(index.json)을 불러오지 못했습니다."); }
      }
    })();
    return () => { canceled = true; };
  }, []);
  const MAIN_IMG = albumIndex ? `/images/album/${albumIndex.main}` : "/images/album/Bloom_25_06_13_073904.JPG";

  /** ── 복사 ── */
  const copy = async (txt: string) => {
    try { await navigator.clipboard.writeText(txt); alert(`복사되었습니다: ${txt}`); } catch {}
  };

  /** ── 2025-12 달력 ── */
  const days = ["일", "월", "화", "수", "목", "금", "토"];
  const dec2025Cells = useMemo(() => {
    const first = new Date("2025-12-01T00:00:00+09:00");
    const firstDay = first.getDay();
    const total = 31;
    const cells: (number | null)[] = [];
    for (let i = 0; i < firstDay; i++) cells.push(null);
    for (let d = 1; d <= total; d++) cells.push(d);
    return cells;
  }, []);

  return (
    <main className="min-h-screen bg-[#FFF8F3] text-gray-900 font-sans relative">
      {/* 좌측 상단 BGM 버튼 */}
      <button
        onClick={toggleBgm}
        aria-label={isPlaying ? "배경음악 일시정지" : "배경음악 재생"}
        aria-pressed={isPlaying}
        className={`fixed left-3 top-3 z-20 w-11 h-11 rounded-full bg-white/95 backdrop-blur shadow flex items-center justify-center border
          ${isPlaying ? "border-rose-200 ring-2 ring-rose-100" : "border-gray-200"}`}
        style={{ color: isPlaying ? HIGHLIGHT : "#6b7280" }}
      >
        <Headphones width={22} height={22} />
      </button>
      <audio ref={audioRef} src={BGM_SRC} preload="none" loop className="hidden" />

      {/* 타이틀 */}
      <section className="max-w-md mx-auto px-5 pt-8 pb-3 text-center">
        <h2 className="tracking-[0.35em] text-[12px] text-gray-800">WEDDING INVITATION</h2>
        <h1 className="mt-2 text-2xl">이현석 &nbsp;&amp;&nbsp; 유지현</h1>
      </section>

      {/* 메인 이미지 */}
      <section className="max-w-md mx-auto px-4">
        <div className="rounded-2xl overflow-hidden shadow bg-white">
          <img src={MAIN_IMG} alt="메인 웨딩 사진" className="w-full h-[52svh] object-cover" loading="lazy" />
        </div>
      </section>

      {/* 초대 문구 */}
      <section className="max-w-md mx-auto px-5 mt-6">
        <div className="bg-white rounded-2xl shadow p-6 text-center">
          <h3 className="text-[12px] tracking-[0.35em] text-gray-500">INVITATION</h3>
          <div className="mt-5 space-y-3 text-[15px] leading-8 text-gray-800">
            <p>사랑이 봄처럼 시작되어</p>
            <p>겨울의 약속으로 이어집니다.</p>
            <p>하루하루의 마음이 저희의 계절을 만들었으니</p>
            <p>함께 오셔서 따뜻히 축복해 주시면 감사하겠습니다.</p>
          </div>
          <div className="mt-6 text-sm text-gray-600">
            2025년 12월 7일 일요일 오후 3시 30분 · {VENUE_NAME}
          </div>
        </div>
      </section>

      {/* 연락 라인 */}
      <section className="max-w-md mx-auto px-5 mt-6">
        <div className="bg-white rounded-2xl shadow p-5">
          <ContactRow label="이영철 · 이경희 의 아들 현석" tel="010-4100-5960" />
          <div className="my-3 h-px bg-gray-100" />
          <ContactRow label="유기만 · 정원경 의 딸 지현" tel="010-3350-7890" />
        </div>
      </section>

      {/* 달력 + D-day */}
      <CalendarCard days={days} cells={dec2025Cells} highlight={HIGHLIGHT} dDay={dDay} />

      {/* 앨범 */}
      <section className="max-w-md mx-auto px-5 mt-6">
        <div className="bg-white rounded-2xl shadow p-5">
          <h3 className="text-center text-lg tracking-wide mb-4" style={{ color: HIGHLIGHT }}>ALBUM</h3>
          {albumError && <p className="text-sm text-red-500 text-center mb-3">{albumError}</p>}
          <div className="grid grid-cols-3 gap-3">
            {albumIndex?.album.map((file, idx) => (
              <figure key={`${file}-${idx}`} className="rounded-xl overflow-hidden bg-gray-100">
                <img
                  src={`/images/album/${file}`}
                  alt={`album-${idx}`}
                  loading="lazy"
                  className="w-full h-full object-cover aspect-[4/3]"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                />
              </figure>
            ))}
          </div>
          <p className="text-xs text-gray-500 text-center mt-3">
            앨범 폴더: <code>/public/images/album/</code> · <code>index.json</code> 기준
          </p>
        </div>
      </section>

      {/* ───────── 오시는 길 (카카오 퍼가기 지도) ───────── */}
      <section className="max-w-md mx-auto px-5 mt-6">
        <div className="bg-white rounded-2xl shadow p-6 text-center">
          <h2 className="text-xl font-semibold mb-2" style={{ color: HIGHLIGHT }}>오시는 길</h2>
          <p className="text-lg font-bold">{VENUE_NAME}</p>
          <p className="mt-1 text-gray-700">{VENUE_ADDR}</p>

          {/* 안내 전화 버튼 */}
          <div className="mt-3">
            <a
              href={`tel:${VENUE_TEL.replace(/[^0-9]/g, "")}`}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-900 text-white text-sm"
            >
              <PhoneIcon width={16} height={16} /> 안내 전화
            </a>
          </div>

          {/* ✅ 실제 카카오 지도(핀치줌/드래그 가능) */}
          <div className="mt-5 rounded-xl overflow-hidden shadow-sm">
            <KakaoRoughMap
              timestamp={KAKAO_ROUGHMAP_TIMESTAMP}
              mapKey={KAKAO_ROUGHMAP_KEY}
              width="100%"
              height={KAKAO_MAP_HEIGHT}
            />
          </div>

          {/* 하단 앱 버튼 3종 */}
          <div className="mt-5 grid grid-cols-3 gap-3">
            <AppButton
              label="네이버 지도"
              onClick={() =>
                openWithFallback(
                  `nmap://search?query=${encodeURIComponent(VENUE_SEARCH)}`,
                  `https://map.naver.com/v5/search/${encodeURIComponent(VENUE_SEARCH)}`
                )
              }
            >
              <NaverIcon className="w-5 h-5" />
            </AppButton>

            <AppButton
              label="카카오 내비"
              onClick={() =>
                openWithFallback(
                  `kakaomap://search?q=${encodeURIComponent(VENUE_SEARCH)}`,
                  `https://map.kakao.com/?q=${encodeURIComponent(VENUE_SEARCH)}`
                )
              }
            >
              <KakaoIcon className="w-5 h-5" />
            </AppButton>

            <AppButton
              label="티맵"
              onClick={() =>
                openWithFallback(
                  `tmap://search?name=${encodeURIComponent(VENUE_SEARCH)}`,
                  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(VENUE_SEARCH)}`
                )
              }
            >
              <TmapIcon className="w-5 h-5" />
            </AppButton>
          </div>
        </div>
      </section>

      {/* 안내 섹션들 */}
      <InfoSections highlight={HIGHLIGHT} />

      {/* 마음 전하는 곳 */}
      <section className="max-w-md mx-auto px-5 mt-6 pb-16">
        <div className="bg-white rounded-2xl shadow p-6">
          <h2 className="text-center text-xl font-semibold mb-4" style={{ color: HIGHLIGHT }}>
            마음을 전하는 곳
          </h2>
          <Accordion title="신랑측 계좌번호">
            <AccountList
              accounts={[
                { bank: "우리은행", number: "1002-743-669917", holder: "이현석" },
                { bank: "국민", number: "000-000-000000", holder: "이영철" },
                { bank: "국민", number: "000-000-000000", holder: "이경희" },
              ]}
              onCopy={(v) => copy(v)}
            />
          </Accordion>
          <Accordion title="신부측 계좌번호">
            <AccountList
              accounts={[
                { bank: "국민", number: "000-000-000000", holder: "유지현" },
                { bank: "국민", number: "000-000-000000", holder: "유기만" },
                { bank: "국민", number: "000-000-000000", holder: "정원경" },
              ]}
              onCopy={(v) => copy(v)}
            />
          </Accordion>
        </div>
      </section>
    </main>
  );
}

/* ───────── 하위 컴포넌트 ───────── */
function Headphones(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
      <path d="M4 13a8 8 0 1 1 16 0" strokeWidth="1.6" strokeLinecap="round"/>
      <rect x="3" y="12" width="4" height="7" rx="1.2" strokeWidth="1.6"/>
      <rect x="17" y="12" width="4" height="7" rx="1.2" strokeWidth="1.6"/>
    </svg>
  );
}
function PhoneIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
      <path
        strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
        d="M22 16.5v3a2 2 0 0 1-2.2 2A19.5 19.5 0 0 1 2.5 4.2 2 2 0 0 1 4.5 2h3a2 2 0 0 1 2 1.7c.12.8.32 1.6.58 2.4a2 2 0 0 1-.44 2.1L9 10a16 16 0 0 0 5 5l.7-1.1a2 2 0 0 1 2.1-.45c.8.26 1.6.46 2.4.58A2 2 0 0 1 22 16.5z"
      />
    </svg>
  );
}
function SmsIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
      <rect x="3" y="4" width="18" height="14" rx="3" strokeWidth="1.8" />
      <path d="M7 9h10M7 13h6" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}
function ContactRow({ label, tel }: { label: string; tel: string }) {
  const digits = tel.replace(/[^0-9]/g, "");
  return (
    <div className="flex items-center justify-between">
      <p className="text-[15px]">{label}</p>
      <div className="flex items-center gap-2">
        <a href={`tel:${digits}`} className="w-9 h-9 rounded-full bg-white border border-gray-200 shadow flex items-center justify-center text-gray-700">
          <PhoneIcon width={18} height={18} />
        </a>
        <a href={`sms:${digits}`} className="w-9 h-9 rounded-full bg-white border border-gray-200 shadow flex items-center justify-center text-gray-700" style={{ color: HIGHLIGHT }}>
          <SmsIcon width={18} height={18} />
        </a>
      </div>
    </div>
  );
}
function CalendarCard({
  days, cells, highlight, dDay,
}: { days: string[]; cells: (number | null)[]; highlight: string; dDay: number; }) {
  return (
    <section className="max-w-md mx-auto px-5 mt-6">
      <div className="bg-white rounded-2xl shadow p-6">
        <h3 className="text-center text-lg font-medium">12월</h3>
        <div className="grid grid-cols-7 gap-3 text-center text-sm font-semibold mt-3">
          {days.map((d) => (<div key={d}>{d}</div>))}
        </div>
        <div className="grid grid-cols-7 gap-3 text-center text-lg mt-2">
          {cells.map((n, i) =>
            n === null ? <div key={i} /> : (
              <div
                key={i}
                className={`w-10 h-10 mx-auto flex items-center justify-center rounded-full ${n === 7 ? "text-white font-bold" : "text-gray-800"}`}
                style={n === 7 ? { backgroundColor: highlight } : {}}
              >
                {n}
              </div>
            )
          )}
        </div>
        <p className="mt-5 text-center text-base" style={{ color: highlight }}>
          이현석 ❤ 유지현 의 결혼식 {dDay}일 전
        </p>
      </div>
    </section>
  );
}
function InfoSections({ highlight }: { highlight: string }) {
  return (
    <section className="max-w-md mx-auto px-5 mt-6">
      <div className="bg-white rounded-2xl shadow p-6">
        <InfoBlock title="지하철" highlight={highlight}>
          공덕역 ⑦번 출구 (5호선, 6호선) [도보 2분] <br />
          공덕역 ⑩번 출구 (경의중앙선, 공항철도) [도보 1분]
        </InfoBlock>
        <div className="my-4 h-px bg-gray-100" />
        <InfoBlock title="버스" highlight={highlight}>
          파란 간선 : 160, 260, 600 <br />
          초록 지선 : 7013A, 7013B, 7611 <br />
          마을버스 : 마포01, 마포02, 마포10 <br />
          일반버스 : 1002
        </InfoBlock>
        <div className="my-4 h-px bg-gray-100" />
        <InfoBlock title="주차" highlight={highlight}>
          효성해링턴스퀘어 본 건물 주차 (2시간 무료) <br />
          [외부 주차장 : SUN 장학빌딩, 하이파킹 공덕역점, 경보 주차장]
        </InfoBlock>
        <div className="my-4 h-px bg-gray-100" />
        <InfoBlock title="추가 안내" highlight={highlight}>
          예식장 내 화환 반입이 불가하여 마음만 감사히 받겠습니다.
        </InfoBlock>
      </div>
    </section>
  );
}
function InfoBlock({ title, highlight, children }:{
  title: string; highlight: string; children: React.ReactNode;
}) {
  return (
    <div>
      <h4 className="text-base font-semibold mb-1.5" style={{ color: highlight }}>{title}</h4>
      <p className="text-[15px] leading-7 text-gray-700">{children}</p>
    </div>
  );
}

/* ───────── 하단 버튼/폴백 ───────── */
function openWithFallback(appUrl: string, webUrl: string) {
  const start = Date.now();
  const t = setTimeout(() => { if (Date.now() - start < 1500) window.location.href = webUrl; }, 800);
  const iframe = document.createElement("iframe");
  iframe.style.display = "none";
  iframe.src = appUrl;
  document.body.appendChild(iframe);
  setTimeout(() => {
    clearTimeout(t);
    if (document.body.contains(iframe)) document.body.removeChild(iframe);
  }, 2500);
}
function AppButton({ label, children, onClick }:{
  label: string; children: React.ReactNode; onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="w-full h-12 rounded-xl bg-white border border-gray-200 shadow-sm flex items-center justify-center gap-2 text-sm"
    >
      {children}<span className="font-medium">{label}</span>
    </button>
  );
}
function NaverIcon(props: React.HTMLAttributes<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <rect width="24" height="24" rx="4" />
      <path d="M9 6h3.2l2.9 4.7V6H18v12h-3.2l-2.9-4.7V18H9V6z" fill="#fff" />
    </svg>
  );
}
function KakaoIcon(props: React.HTMLAttributes<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" {...props}>
      <rect width="24" height="24" rx="4" fill="#FFE812" />
      <path d="M12 6.5c-3.3 0-6 2-6 4.6 0 1.7 1.1 3.2 2.9 4l-.6 2.4a.5.5 0 0 0 .8.5l2.7-1.7c3.3 0 6-2.1 6-4.7S15.3 6.5 12 6.5z" fill="#381E1F" />
    </svg>
  );
}
function TmapIcon(props: React.HTMLAttributes<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" {...props}>
      <rect width="24" height="24" rx="4" fill="#E31E2D" />
      <path d="M7 12a5 5 0 0 1 10 0c0 2.8-2.7 5.5-5 7.5-2.3-2-5-4.7-5-7.5z" fill="#fff" />
      <circle cx="12" cy="12" r="2.2" fill="#E31E2D" />
    </svg>
  );
}
