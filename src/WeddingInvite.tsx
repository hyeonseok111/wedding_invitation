import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function WeddingInvite() {
  return (
    <main className="min-h-screen bg-white flex flex-col items-center p-6 text-center font-sans">
      {/* BGM 삽입 */}
      <audio autoPlay loop>
        <source src="/bgm/romantic-melody.mp3" type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>

      <header className="mb-6">
        <h1 className="text-3xl font-semibold text-gray-900">이현석 & 유지현</h1>
        <p className="text-base text-gray-600 mt-2">2025년 12월 7일 (일) 오후 3시 30분</p>
        <p className="text-sm text-gray-500">아펠가모 공덕, 라로브홀</p>
      </header>

      <section className="w-full max-w-md">
        <img 
          src="/images/wedding-photo.jpg" 
          alt="신랑 신부 사진" 
          className="w-full rounded-2xl shadow-md mb-6"
        />

        <Card>
          <CardContent className="py-6 space-y-3">
            <p className="text-sm text-gray-700">사랑이 봄처럼 시작되어</p>
            <p className="text-sm text-gray-700">겨울의 약속으로 이어집니다.</p>
            <p className="text-sm text-gray-700">하루하루의 마음이 저희의 계절을 만들었으니</p>
            <p className="text-sm text-gray-700">함께 오셔서 따뜻히 축복해 주시면 감사하겠습니다.</p>
          </CardContent>
        </Card>

        <div className="mt-6 space-y-3">
          <Button className="w-full" onClick={() => window.open("https://naver.me/GgEXAMPLE", "_blank")}>오시는 길</Button>
          <Button className="w-full" onClick={() => window.open("https://open.kakao.com/o/somelink", "_blank")}>신랑에게 연락</Button>
          <Button className="w-full" onClick={() => window.open("https://open.kakao.com/o/anotherlink", "_blank")}>신부에게 연락</Button>
          <Button className="w-full" onClick={() => window.open("https://paylink.com/gift", "_blank")}>마음 전하실 곳</Button>
        </div>

        <div className="mt-10">
          <h2 className="text-lg font-medium text-gray-800 mb-2">약도</h2>
          <img 
            src="/images/map.jpg" 
            alt="청첩장 약도" 
            className="w-full rounded-md shadow-sm"
          />
        </div>

        <div className="mt-10">
          <h2 className="text-lg font-medium text-gray-800 mb-2">축하 메시지</h2>
          <p className="text-sm text-gray-500">SNS 또는 카카오톡으로 마음을 전해주세요 💌</p>
        </div>
      </section>

      <footer className="mt-10 text-xs text-gray-400">© 2025 이현석 & 유지현. 모든 권리 보유.</footer>
    </main>
  );
}
