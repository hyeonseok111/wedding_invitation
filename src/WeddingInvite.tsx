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

/** 카카오 roughmap 퍼가기 키 */
const KAKAO_EMBED_TIMESTAMP = "1755523431572";
const KAKAO_EMBED_KEY = "7m3ejw8zpmp";

/** 앱 버튼 검색어 */
const MAP_QUERY = "아펠가모 공덕";

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

/** ───────── 메인 컴포넌트 ───────── */
export default function WeddingInvite() {
  /** BGM */
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const toggleBgm = async () => {
    const a = audioRef.current;
    if (!a) return;
    if (a.paused) {
      try {
        await a.play();
        setIsPlaying(true);
      } catch {}
    } else {
      a.pause();
      setIsPlaying(false);
    }
  };

  /** 날짜 파생 */
  const eventDate = useMemo(() => new Date(WEDDING_ISO), []);
  const mm = pad2(eventDate.getMonth() + 1);
  const dd = pad2(eventDate.getDate());

  /** D-day (자정 자동 갱신) */
  const [dDay, setDDay] = useState(() => daysUntil(WEDDING_ISO));
  useEffect(() => {
    const update = () => setDDay(daysUntil(WEDDING_ISO));
    const now = new Date();
    const nextMidnight = new Date(now);
    nextMidnight.setHours(24, 0, 0, 0);
    const toMidnight = nextMidnight.getTime() - now.getTime();

    let intervalId: number | undefined;
    const timeoutId = window.setTimeout(() => {
      update();
      intervalId = window.setInterval(update, 86400000);
    }, toMidnight);

    return () => {
      window.clearTimeout(timeoutId);
      if (intervalId) window.clearInterval(intervalId);
    };
  }, []);

  /** 2025-12 달력 */
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

        const sortedUnique = Array.from(
          new Set(
            [...data.album]
              .filter((f) => f && typeof f === "string")
              .map((f) => f.trim())
              .filter(Boolean)
          )
        ).sort((a, b) => b.localeCompare(a, undefined, { numeric: true }));

        if (!canceled) {
          setAlbumIndex({ main: data.main, album: sortedUnique });
          setAlbumError(null);
        }
      } catch {
        if (!canceled) {
          setAlbumIndex(null);
          setAlbumError("앨범 목록(index.json)을 불러오지 못했습니다.");
        }
      }
    })();
    return () => {
      canceled = true;
    };
  }, []);

  const MAIN_IMG = albumIndex
    ? `/images/album/${albumIndex.main}`
    : "/images/album/Bloom_25_06_13_073904.JPG";

  /** 복사 */
  const copy = async (txt: string) => {
    try {
      await navigator.clipboard.writeText(txt);
      alert(`복사되었습니다: ${txt}`);
    } catch {}
  };

  /** 렌더 */
  return (
    <main className="min-h-screen font-sans" style={{ background: THEME.bg, color: THEME.ink }}>
      {/* 상단 그라데이션 (합성 레이어 힌트) */}
      <div
        className="fixed inset-x-0 top-0 h-24 pointer-events-none -z-0"
        style={{
          background: "linear-gradient(180deg, rgba(214,120,120,0.10), rgba(214,120,120,0))",
          willChange: "transform",
        }}
      />

      {/* BGM 토글 (회색 원 + 흰색 아이콘) */}
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
            <div className="leading-none" style={{ fontFamily: "'Noto Serif KR', ui-serif, serif", fontSize: "clamp(40px, 10.5vw, 72px)" }}>
              {mm}
            </div>
            <div className="w-9 mx-auto my-1 border-t" style={{ borderColor: "#DADADA" }} />
            <div className="leading-none" style={{ fontFamily: "'Noto Serif KR', ui-serif, serif", fontSize: "clamp(40px, 10.5vw, 72px)" }}>
              {dd}
            </div>
          </div>

          <h1
            className="tracking-[0.2em] text-right"
            style={{ fontFamily: "'Noto Serif KR', ui-serif, serif", fontSize: "clamp(22px, 5vw, 32px)", fontWeight: 500 }}
          >
            유&nbsp;지&nbsp;현
          </h1>
        </div>

        <p className="mt-3 text-center text-gray-600" style={{ fontSize: "clamp(12px, 2.6vw, 13.5px)" }}>
          2025년 12월 7일 일요일 15:30 · {VENUE_NAME}
        </p>
      </section>

      {/* 2) 메인 이미지 — 첫 화면이므로 eager + high priority */}
      <section className="max-w-md mx-auto px-5">
        <figure className="rounded-[20px] overflow-hidden shadow-sm bg-white">
          <img
            src={MAIN_IMG}
            alt="메인 웨딩 사진"
            className="w-full h-[48svh] object-cover"
            loading="eager"
            decoding="async"
            fetchPriority="high"
            style={{ contentVisibility: "auto" }}
          />
        </figure>
      </section>

      {/* 3) 시 + 초대문 (합본 카드) */}
      <section className="max-w-md mx-auto px-5 mt-8">
        <Card className="text-center p-7">
          <div className="flex justify-center">
            <div className="w-8 h-8 rounded-full bg-[#F6E8E8]/60 flex items-center justify-center">
              <span aria-hidden className="text-[10px] text-[#8a6a6a]">✿</span>
            </div>
          </div>

          {/* 시 */}
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

          {/* 초대문 */}
          <h3 className="tracking-[0.35em] text-gray-500" style={{ fontSize: "clamp(11px, 2.6vw, 13px)" }}>
            INVITATION
          </h3>
          <div className="mt-4 text-gray-900" style={{ fontSize: "clamp(16px, 3.6vw, 20px)", lineHeight: 1.85 }}>
            <p>사랑이 봄처럼 시작되어</p>
            <p className="mt-1.5">겨울의 약속으로 이어집니다.</p>
            <p className="mt-1.5">하루하루의 마음이 저희의 계절을 만들었으니</p>
            <p className="mt-1.5">함께 오셔서 따뜻히 축복해 주시면 감사하겠습니다.</p>
          </div>

          <div className="mt-6 text-[12.5px] text-gray-600">
            2025년 12월 7일 일요일 오후 3시 30분 · {VENUE_NAME}
          </div>
        </Card>
      </section>

      {/* 4) 연락 라인 */}
      <section className="max-w-md mx-auto px-5 mt-5">
        <Card>
          <ContactRow label={GROOM_LINE} tel={GROOM_TEL} />
          <Divider />
          <ContactRow label={BRIDE_LINE} tel={BRIDE_TEL} />
        </Card>
      </section>

      {/* 5) 달력 + D-day */}
      <CalendarCard days={days} cells={dec2025Cells} highlight={THEME.hl} dDay={dDay} />

      {/* 6) 오시는 길 + 지도/앱 */}
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
            <KakaoRoughMap timestamp={KAKAO_EMBED_TIMESTAMP} mapKey={KAKAO_EMBED_KEY} width="100%" height={360} />
          </div>

          <div className="mt-5 grid grid-cols-3 gap-3">
            <AppButton
              label="네이버 지도"
              onClick={() =>
                openWithFallback(
                  `nmap://search?query=${encodeURIComponent(MAP_QUERY)}`,
                  `https://map.naver.com/v5/search/${encodeURIComponent(MAP_QUERY)}`
                )
              }
            >
              <NaverIcon className="w-5 h-5" />
            </AppButton>

            <AppButton
              label="카카오 내비"
              onClick={() =>
                openWithFallback(
                  `kakaomap://search?q=${encodeURIComponent(MAP_QUERY)}`,
                  `https://map.kakao.com/?q=${encodeURIComponent(MAP_QUERY)}`
                )
              }
            >
              <KakaoIcon className="w-5 h-5" />
            </AppButton>

            <AppButton
              label="티맵"
              onClick={() =>
                openWithFallback(
                  `tmap://search?name=${encodeURIComponent(MAP_QUERY)}`,
                  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(MAP_QUERY)}`
                )
              }
            >
              <TmapIcon className="w-5 h-5" />
            </AppButton>
          </div>
        </Card>
      </section>

      {/* 7) 교통/주차/안내 */}
      <InfoSections highlight={THEME.hl} />

      {/* 8) 앨범 */}
      <section className="max-w-md mx-auto px-5 mt-6">
        <Card>
          <h3 className="text-center font-semibold mb-3" style={{ color: THEME.hl, fontSize: "clamp(15px,4vw,17px)" }}>
            ALBUM
          </h3>
          {albumError && <p className="text-sm text-red-500 text-center mb-3">{albumError}</p>}

          <div className="grid grid-cols-3 gap-2.5">
            {albumIndex?.album.map((file, idx) => (
              <figure key={`${file}-${idx}`} className="rounded-xl overflow-hidden bg-gray-100">
                <img
                  src={`/images/album/${file}`}
                  alt={`album-${idx}`}
                  loading="lazy"
                  decoding="async"
                  fetchPriority="low"
                  className="w-full aspect-square object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                    console.warn("이미지 로드 실패:", `/images/album/${file}`);
                  }}
                />
              </figure>
            ))}
          </div>

          <p className="text-[11px] text-gray-500 text-center mt-3">
            기준 경로 <code>/public/images/album/</code> · <code>index.json</code> 파일명 내림차순 정렬
          </p>
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
    </main>
  );
}

/* ───────── 공통 컴포넌트 ───────── */

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={`rounded-[20px] shadow-sm p-6 bg-white ${className}`}
      style={{
        background: THEME.card,
        contentVisibility: "auto",         // 뷰포트 밖 지연 페인트
        containIntrinsicSize: "600px",     // 자리 확보 (레이아웃 점프 방지)
      }}
    >
      {children}
    </div>
  );
}
function Divider() {
  return <div className="my-3 h-px" style={{ background: THEME.line }} />;
}

/** Kakao roughmap embed — 보이기 직전에 로드 */
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
  const hostRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const LOADER_CLASS = "daum_roughmap_loader_script";
    const ensureLoader = () =>
      new Promise<void>((resolve) => {
        if ((window as any).daum?.roughmap?.Lander) {
          resolve();
          return;
        }
        const existing = document.querySelector(`script.${LOADER_CLASS}`);
        if (existing) {
          const iv = setInterval(() => {
            if ((window as any).daum?.roughmap?.Lander) {
              clearInterval(iv);
              resolve();
            }
          }, 50);
          return;
        }
        const s = document.createElement("script");
        s.src = "https://ssl.daumcdn.net/dmaps/map_js_init/roughmapLoader.js";
        s.charset = "UTF-8";
        s.className = LOADER_CLASS;
        s.onload = () => resolve();
        document.body.appendChild(s);
      });

    let disposed = false;
    let observed = false;

    const io = new IntersectionObserver(
      async (entries) => {
        if (observed || disposed) return;
        if (!entries[0]?.isIntersecting) return;
        observed = true;
        await ensureLoader();
        if (disposed) return;
        const lander = new (window as any).daum.roughmap.Lander({
          timestamp,
          key: mapKey,
          mapWidth: typeof width === "number" ? `${width}px` : width,
          mapHeight: typeof height === "number" ? `${height}px` : height,
        });
        lander.render();
        io.disconnect();
      },
      { root: null, rootMargin: "200px 0px", threshold: 0.01 }
    );

    if (hostRef.current) io.observe(hostRef.current);
    return () => {
      disposed = true;
      io.disconnect();
    };
  }, [timestamp, mapKey, width, height]);

  return (
    <div
      ref={hostRef}
      id={containerId}
      className="root_daum_roughmap root_daum_roughmap_landing"
      style={{ containIntrinsicSize: "360px 100%", contentVisibility: "auto" }}
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
  days,
  cells,
  highlight,
  dDay,
}: {
  days: string[];
  cells: (number | null)[];
  highlight: string;
  dDay: number;
}) {
  const label = dDay > 0 ? `${dDay}일 전` : dDay === 0 ? "오늘" : `${Math.abs(dDay)}일 지남`;

  return (
    <section className="max-w-md mx-auto px-5 mt-6">
      <Card>
        <h3 className="text-center font-medium" style={{ fontSize: "clamp(17px,4.2vw,21px)" }}>
          12월
        </h3>
        <div className="grid grid-cols-7 gap-3 text-center text-gray-600 mt-3" style={{ fontSize: "clamp(11px,2.8vw,13px)" }}>
          {days.map((d) => <div key={d}>{d}</div>)}
        </div>
        <div className="grid grid-cols-7 gap-3 text-center mt-2" style={{ fontSize: "clamp(15px,4vw,18px)" }}>
          {cells.map((n, i) =>
            n === null ? (
              <div key={i} />
            ) : (
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
        <Divider />
        <InfoBlock title="추가 안내" highlight={highlight}>
          예식장 내 화환 반입이 불가하여 마음만 감사히 받겠습니다.
        </InfoBlock>
      </Card>
    </section>
  );
}
function InfoBlock({ title, highlight, children }: { title: string; highlight: string; children: React.ReactNode }) {
  return (
    <div>
      <h4 className="font-semibold mb-1.5" style={{ color: highlight, fontSize: "clamp(15px,4vw,17px)" }}>
        {title}
      </h4>
      <p className="text-gray-700" style={{ fontSize: "clamp(14px,3.6vw,15px)", lineHeight: 1.8 }}>
        {children}
      </p>
    </div>
  );
}

/** 아코디언 */
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
function AccountList({
  accounts,
  onCopy,
}: {
  accounts: { bank: string; number: string; holder: string }[];
  onCopy: (txt: string) => void;
}) {
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

/** 앱 버튼 */
function AppButton({ label, children, onClick }: { label: string; children: React.ReactNode; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="w-full h-12 rounded-xl bg-white border shadow-sm flex items-center justify-center gap-2 text-[13.5px] font-medium transition active:scale-[0.98]"
      style={{ borderColor: THEME.line }}
    >
      {children}
      <span>{label}</span>
    </button>
  );
}

/** 아이콘들 */
function SpeakerOn(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" {...props}>
      <path fill="currentColor" d="M11 5.5c0-.6-.7-.9-1.1-.5L6.8 8H4.5A1.5 1.5 0 0 0 3 9.5v5A1.5 1.5 0 0 0 4.5 16H6.8l3.1 3c.4.4 1.1.1 1.1-.5V5.5z" />
      <path d="M16 9a3 3 0 0 1 0 6" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" />
      <path d="M18 7a6 6 0 0 1 0 10" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" />
    </svg>
  );
}
function SpeakerOff(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" {...props}>
      <path fill="currentColor" d="M11 5.5c0-.6-.7-.9-1.1-.5L6.8 8H4.5A1.5 1.5 0 0 0 3 9.5v5A1.5 1.5 0 0 0 4.5 16H6.8l3.1 3c.4.4 1.1.1 1.1-.5V5.5z" />
      <line x1="15" y1="9" x2="21" y2="15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <line x1="21" y1="9" x2="15" y2="15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
function PhoneIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
      <path strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" d="M22 16.5v3a2 2 0 0 1-2.2 2A19.5 19.5 0 0 1 2.5 4.2 2 2 0 0 1 4.5 2h3a2 2 0 0 1 2 1.7c.12.8.32 1.6.58 2.4a2 2 0 0 1-.44 2.1L9 10a16 16 0 0 0 5 5l.7-1.1a2 2 0 0 1 2.1-.45c.8.26 1.6.46 2.4.58A2 2 0 0 1 22 16.5z" />
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
      <path d="M12 6.5c-3.3 0-6 2-6 4.6 0 1.7 1.1 3.2 2.9 4l-.6 2.4a.5.5 0 0 0 .8.5l2.7-1.7c.07 0 .27.1.2.1 3.3 0 6-2.1 6-4.7S15.3 6.5 12 6.5z" fill="#381E1F" />
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

/** 앱 스킴 시도 → 실패 시 웹 폴백 */
function openWithFallback(appUrl: string, webUrl: string) {
  const start = Date.now();
  const t = setTimeout(() => {
    if (Date.now() - start < 1500) window.location.href = webUrl;
  }, 800);

  const iframe = document.createElement("iframe");
  iframe.style.display = "none";
  iframe.src = appUrl;
  document.body.appendChild(iframe);

  setTimeout(() => {
    clearTimeout(t);
    if (document.body.contains(iframe)) document.body.removeChild(iframe);
  }, 2500);
}
