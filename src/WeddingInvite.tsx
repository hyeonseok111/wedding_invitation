import React, { useRef, useState, useMemo } from "react";

/**
 * 모바일 청첩장 (지금까지 만든 섹션 모두 포함)
 * - 상단 히어로 + BGM 토글
 * - 초대 문구 (INVITATION)
 * - 혼주 연락 (전화/문자)
 * - 2025년 12월 달력 + 7일 하이라이트 + D-day
 * - 앨범 그리드 (연속 번호로 자동 로드, 없는 파일은 숨김)
 */

// === 리소스/정보 (여기 값만 바꾸면 전체 반영) ==========================
const HERO_IMG = "/images/hero-01.jpg";
const BGM_SRC = "/bgm/romantic-melody.mp3";
const WEDDING_ISO = "2025-12-07T15:30:00+09:00";
const VENUE_NAME = "아펠가모 공덕 라로브홀";

const GROOM_LINE = "이영철 · 이경희 의 아들 현석";
const BRIDE_LINE = "유기만 · 정원경 의 딸 지현";
const GROOM_TEL = "010-4100-5960";
const BRIDE_TEL = "010-3350-7890";

// 앨범(01.jpg ~ N.jpg)을 /public/images/album/ 에 넣으면 자동 로드
const PHOTO_COUNT = 18;
// 강조 컬러 (하트/제목/달력 포커스)
const HIGHLIGHT = "#d98282";

// =====================================================================

export default function WeddingInvite() {
  // BGM 토글
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const toggleBgm = async () => {
    const a = audioRef.current;
    if (!a) return;
    if (a.paused) {
      try {
        await a.play();
        setIsPlaying(true);
      } catch {
        /* 모바일 정책으로 실패 시 무시 */
      }
    } else {
      a.pause();
      setIsPlaying(false);
    }
  };

  // D-day 계산
  const dDay = useMemo(() => {
    const event = new Date(WEDDING_ISO);
    const today = new Date();
    const startOf = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
    const diff = Math.ceil((startOf(event) - startOf(today)) / 86400000);
    return diff;
  }, []);

  // 캘린더(2025년 12월)
  const days = ["일", "월", "화", "수", "목", "금", "토"];
  const dec2025 = useMemo(() => {
    const first = new Date("2025-12-01T00:00:00+09:00");
    const firstDay = first.getDay(); // 0:일 ~ 6:토
    const total = 31;
    const cells: (number | null)[] = [];
    for (let i = 0; i < firstDay; i++) cells.push(null);
    for (let d = 1; d <= total; d++) cells.push(d);
    return cells;
  }, []);

  // 앨범 이미지 목록
  const albumImages = Array.from({ length: PHOTO_COUNT }, (_, i) => `/images/album/${String(i + 1).padStart(2, "0")}.jpg`);
  const [hidden, setHidden] = useState<Record<string, boolean>>({});

  return (
    <main className="min-h-screen bg-white text-gray-900 font-sans">

      {/* 1) 히어로 섹션 */}
      <section className="relative w-full">
        <img src={HERO_IMG} alt="웨딩 히어로 이미지" className="w-full h-[52svh] object-cover" />

        {/* 배경음 토글 버튼 */}
        <button
          onClick={toggleBgm}
          aria-label="배경 음악 토글"
          className="absolute top-3 left-3 w-9 h-9 rounded-full bg-white/90 text-gray-900 shadow flex items-center justify-center"
        >
          {isPlaying ? "❚❚" : "▶"}
        </button>

        {/* 오버레이 타이포 */}
        <div className="absolute inset-0 flex flex-col items-center justify-end bg-gradient-to-t from-black/35 to-transparent pb-6">
          <h2 className="tracking-[0.35em] text-[12px] text-white/90 mb-1">WEDDING INVITATION</h2>
          <h1 className="text-white text-2xl font-semibold tracking-tight">이현석 & 유지현</h1>
        </div>
      </section>

      {/* 2) 초대 문구 */}
      <section className="max-w-md mx-auto px-6 py-10 text-center">
        <div className="h-8" />
        <h3 className="text-[12px] tracking-[0.35em] text-gray-500">INVITATION</h3>
        <div className="mt-6 space-y-3 text-[15px] leading-8 text-gray-800">
          <p>사랑이 봄처럼 시작되어</p>
          <p>겨울의 약속으로 이어집니다.</p>
          <p>하루하루의 마음이 저희의 계절을 만들었으니</p>
          <p>함께 오셔서 따뜻히 축복해 주시면 감사하겠습니다.</p>
        </div>

        <div className="mt-6 text-sm text-gray-600">
          2025년 12월 7일 일요일 오후 3시 30분 · {VENUE_NAME}
        </div>
      </section>

      {/* 3) 혼주 연락 */}
      <section className="max-w-md mx-auto px-6 py-8">
        <div className="space-y-6">
          <ContactRow label={GROOM_LINE} tel={GROOM_TEL} />
          <ContactRow label={BRIDE_LINE} tel={BRIDE_TEL} />
        </div>
      </section>

      {/* 4) 달력 + D-day */}
      <section className="max-w-md mx-auto px-6 py-10">
        <h3 className="text-center text-xl font-medium mb-4">12월</h3>

        {/* 요일 */}
        <div className="grid grid-cols-7 gap-3 text-center text-sm font-semibold">
          {days.map((d) => (
            <div key={d}>{d}</div>
          ))}
        </div>

        {/* 날짜 셀 */}
        <div className="grid grid-cols-7 gap-3 text-center text-lg mt-2">
          {dec2025.map((n, idx) =>
            n === null ? (
              <div key={idx} />
            ) : (
              <div
                key={idx}
                className={`w-10 h-10 mx-auto flex items-center justify-center rounded-full ${
                  n === 7 ? "text-white font-bold" : "text-gray-800"
                }`}
                style={n === 7 ? { backgroundColor: HIGHLIGHT } : {}}
              >
                {n}
              </div>
            )
          )}
        </div>

        <p className="mt-6 text-center text-lg" style={{ color: HIGHLIGHT }}>
          이현석 ❤ 유지현 의 결혼식 {dDay}일 전
        </p>
      </section>

      {/* 5) 앨범 */}
      <section className="w-full max-w-md mx-auto px-4 pb-14">
        <h3 className="text-center text-lg tracking-wide mb-4" style={{ color: HIGHLIGHT }}>
          ALBUM
        </h3>
        <div className="grid grid-cols-3 gap-3">
          {albumImages.map((src) => (
            <figure key={src} className={`rounded-xl overflow-hidden bg-gray-100 ${hidden[src] ? "hidden" : ""}`}>
              <img
                src={src}
                alt="wedding album"
                loading="lazy"
                className="w-full h-full object-cover aspect-[4/3]"
                onError={() => setHidden((h) => ({ ...h, [src]: true }))}
              />
            </figure>
          ))}
        </div>
        <p className="text-xs text-gray-500 text-center mt-3">
          /public/images/album/ 에 01.jpg, 02.jpg … 형식으로 사진을 추가하면 자동으로 표시됩니다.
        </p>
      </section>

      {/* 오디오 (토글로 제어) */}
      <audio ref={audioRef} src={BGM_SRC} preload="none" loop className="hidden" />
    </main>
  );
}

/** 연락 행 컴포넌트 (전화/문자) */
function ContactRow({ label, tel }: { label: string; tel: string }) {
  const telHref = `tel:${tel.replaceAll(/[^0-9]/g, "")}`;
  const smsHref = `sms:${tel.replaceAll(/[^0-9]/g, "")}`;

  return (
    <div className="flex items-center justify-between border-b pb-3">
      <p className="text-[15px]">{label}</p>
      <div className="flex gap-3">
        <a href={telHref} className="rounded-md px-3 py-1 border border-gray-300 text-sm">
          전화
        </a>
        <a href={smsHref} className="rounded-md px-3 py-1 border border-gray-300 text-sm">
          문자
        </a>
      </div>
    </div>
  );
}
