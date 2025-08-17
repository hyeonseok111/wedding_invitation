import React, { useEffect, useRef, useState } from "react";

export default function WeddingInvite() {
  // === 링크/연락처/리소스 경로 (필요시 여기만 바꾸면 됩니다) ===
  const NAVER_MAP_URL = "https://map.naver.com/p/search/%EA%B3%B5%EB%8D%95%20%EC%95%84%ED%8E%A0%EA%B0%80%EB%AA%A8/place/1929913788?c=16.50,0,0,0,dh&isCorrectAnswer=true&placePath=/home?from=map&fromPanelNum=1&additionalHeight=76&timestamp=202508171925&locale=ko&svcName=map_pcv5&searchText=%EA%B3%B5%EB%8D%95%20%EC%95%84%ED%8E%A0%EA%B0%80%EB%AA%A8"; // 네이버 지도 공유 링크
  const GROOM_TEL = "tel:010-0000-0000";              // 신랑 전화
  const BRIDE_TEL = "tel:010-0000-0000";              // 신부 전화
  const BGM_SRC = "/bgm/romantic-melody.mp3";         // 배경 음악

  // === BGM 제어 (모바일 자동재생 대응) ===
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;
    // 일부 브라우저는 사용자 인터랙션 전까지 재생 불가 → 에러 무시
    a.play().catch(() => setIsPlaying(false));
  }, []);
  const toggleBgm = async () => {
    const a = audioRef.current;
    if (!a) return;
    if (a.paused) {
      try { await a.play(); setIsPlaying(true);} catch { /* no-op */ }
    } else {
      a.pause();
      setIsPlaying(false);
    }
  };

  // === 공유 (Web Share API) ===
  const onShare = async () => {
    const shareData = {
      title: "이현석 & 유지현 결혼합니다",
      text: "12월 7일(일) 15:30 아펠가모 공덕 라로브홀",
      url: window.location.href,
    };
    if (navigator.share) {
      try { await navigator.share(shareData); } catch { /* 취소 */ }
    } else {
      // 미지원 브라우저 → 링크 복사
      await navigator.clipboard.writeText(shareData.url).catch(() => {});
      alert("링크가 복사되었습니다.");
    }
  };

  return (
    <main className="min-h-screen bg-white flex flex-col items-center text-center font-sans">
      {/* 히어로 섹션: 상단 풀 블리드 이미지 */}
      <section className="w-full relative">
        <img
          src="/images/wedding-photo.jpg"
          alt="신랑 신부 사진"
          className="w-full h-[52svh] object-cover"
        />
        {/* 상단 타이틀 오버레이 */}
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/20 p-4">
          <h1 className="text-white text-3xl font-semibold drop-shadow">이현석 & 유지현</h1>
          <p className="text-white/90 mt-2">2025년 12월 7일 (일) 오후 3시 30분</p>
          <p className="text-white/80 text-sm">아펠가모 공덕 · 라로브홀</p>
        </div>
      </section>

      {/* 본문 카드 */}
      <section id="greeting" className="w-full max-w-md -mt-6 px-5">
        <div className="bg-white rounded-2xl shadow-lg p-6 space-y-3">
          <p className="text-sm text-gray-700">사랑이 봄처럼 시작되어</p>
          <p className="text-sm text-gray-700">겨울의 약속으로 이어집니다.</p>
          <p className="text-sm text-gray-700">하루하루의 마음이 저희의 계절을 만들었으니</p>
          <p className="text-sm text-gray-700">함께 오셔서 따뜻히 축복해 주시면 감사하겠습니다.</p>
        </div>
      </section>

      {/* 정보 섹션 (날짜/장소) */}
      <section id="info" className="w-full max-w-md px-5 mt-6">
        <div className="grid grid-cols-2 gap-3 text-left">
          <div className="rounded-xl border p-4">
            <h3 className="text-sm font-medium text-gray-900">일시</h3>
            <p className="text-sm text-gray-600 mt-1">2025.12.07 (일) 15:30</p>
          </div>
          <div className="rounded-xl border p-4">
            <h3 className="text-sm font-medium text-gray-900">장소</h3>
            <p className="text-sm text-gray-600 mt-1">아펠가모 공덕 · 라로브홀</p>
          </div>
        </div>
      </section>

      {/* 약도 섹션 */}
      <section id="map" className="w-full max-w-md px-5 mt-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-3">오시는 길</h2>
        <img src="/images/map.jpg" alt="청첩장 약도" className="w-full rounded-xl shadow" />
        <div className="flex gap-3 mt-3">
          <a href={NAVER_MAP_URL} target="_blank" rel="noreferrer" className="flex-1 rounded-lg bg-gray-900 text-white text-sm py-2">네이버 지도 열기</a>
          <button onClick={onShare} className="flex-1 rounded-lg bg-gray-100 text-gray-900 text-sm py-2">공유하기</button>
        </div>
      </section>

      {/* 공간 확보 (하단 고정 바와 겹침 방지) */}
      <div className="h-24" />

      {/* 하단 고정 액션바 */}
      <nav className="fixed bottom-0 left-0 right-0 mx-auto max-w-md px-5 pb-5">
        <div className="rounded-2xl shadow-2xl bg-white/95 backdrop-blur p-3 grid grid-cols-4 gap-2">
          <a href={NAVER_MAP_URL} className="text-xs rounded-lg bg-pink-100 hover:bg-pink-200 py-2">지도</a>
          <a href={GROOM_TEL} className="text-xs rounded-lg bg-pink-100 hover:bg-pink-200 py-2">신랑</a>
          <a href={BRIDE_TEL} className="text-xs rounded-lg bg-pink-100 hover:bg-pink-200 py-2">신부</a>
          <button onClick={toggleBgm} className="text-xs rounded-lg bg-gray-100 hover:bg-gray-200 py-2">{isPlaying ? "BGM 끄기" : "BGM 켜기"}</button>
        </div>
      </nav>

      {/* 오디오 엘리먼트 (컨트롤 UI는 토글 버튼으로) */}
      <audio ref={audioRef} src={BGM_SRC} loop className="hidden" />

      <footer className="mt-6 mb-28 text-[11px] text-gray-400">© 2025 이현석 & 유지현</footer>
    </main>
  );
}
