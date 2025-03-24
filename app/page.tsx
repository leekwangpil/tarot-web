'use client';

import { useState, useRef } from 'react';
import { tarotImages, TarotCard } from './lib/tarotImages';
import html2canvas from 'html2canvas';

export default function Home() {
  const [selectedCards, setSelectedCards] = useState<TarotCard[]>([]);
  const [question, setQuestion] = useState('');
  const [reading, setReading] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const captureRef = useRef<HTMLDivElement>(null);

  function drawThreeCards(): TarotCard[] {
    const shuffled = [...tarotImages].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 3);
  }

  const handleSubmit = async () => {
    if (!question.trim()) {
      alert('질문을 입력해주세요.');
      return;
    }

    setIsLoading(true);
    const cards = drawThreeCards();
    setSelectedCards(cards);

    try {
      const response = await fetch('/api/tarot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question: question,
          cards: cards.map((card) => card.name),
        }),
      });

      if (!response.ok) {
        throw new Error('타로 해석 중 오류가 발생했습니다.');
      }

      const data = await response.json();
      setReading(data.reading);
    } catch (error) {
      console.error('Error:', error);
      alert('타로 해석 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    const cardText = selectedCards
      .map((card, i) => `${i + 1}. ${card.name}`)
      .join('\n');
    const textToCopy = `[뽑힌 카드]\n${cardText}\n\n[해석 결과]\n${reading}`;
    navigator.clipboard.writeText(textToCopy);
    alert('타로 해석 결과가 복사되었습니다!');
  };

  const handleCaptureAndCopy = async () => {
    if (!captureRef.current) return;

    try {
      const canvas = await html2canvas(captureRef.current);
      canvas.toBlob(async (blob) => {
        if (blob) {
          try {
            await navigator.clipboard.write([
              new ClipboardItem({ 'image/png': blob }),
            ]);
            alert('이미지로 복사되었습니다!');
          } catch (err) {
            alert('복사 실패 😢 브라우저가 이미지를 지원하지 않아요.');
          }
        }
      });
    } catch (err) {
      alert('이미지 캡처 중 오류가 발생했습니다.');
      console.error('Capture error:', err);
    }
  };

  return (
    <main
      className="min-h-screen bg-cover bg-center py-12 px-4"
      style={{
        backgroundImage: "url('/bg.png')",
        backgroundColor: '#101020',
      }}
    >
      <div
        className="p-8 rounded-2xl shadow-2xl max-w-2xl mx-auto"
        style={{
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(4px)',
        }}
      >
        <h1 className="text-3xl font-bold mb-8 text-center text-black">
          ✨ 타로 카드 리딩
        </h1>

        <div className="mb-8">
          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="궁금한 점을 입력해주세요..."
            className="w-full p-4 border rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg bg-white text-black"
            rows={3}
          />
        </div>

        <div className="text-center mb-8">
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className="bg-blue-600 text-white px-8 py-4 rounded-xl hover:bg-blue-700 disabled:bg-gray-400 text-lg font-medium"
          >
            {isLoading ? '🔮 타로 해석 중...' : '🔮 타로 카드 뽑기'}
          </button>
        </div>

        {(selectedCards.length > 0 || reading) && (
          <>
            <div
              ref={captureRef}
              className="mt-8 p-10 rounded-3xl"
              style={{
                backgroundImage: "url('/bg.png')",
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundColor: '#101020',
                minHeight: '600px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
              }}
            >
              <div
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.92)',
                }}
                className="rounded-2xl p-8 shadow-xl"
              >
                <h2 className="text-2xl font-bold text-center mb-8 text-black">
                  ✨ 타로 리딩 결과
                </h2>

                <div className="flex flex-wrap sm:flex-nowrap justify-center items-center gap-6 mb-10">
                  {selectedCards.map((card, index) => (
                    <div
                      key={card.id}
                      className="w-28 sm:w-32"
                      style={{
                        filter: 'drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1))',
                      }}
                    >
                      <img
                        src={card.image}
                        alt={card.name}
                        className="rounded-lg w-full"
                      />
                      <p className="text-center mt-3 font-medium text-base sm:text-lg text-black">
                        {card.name}
                      </p>
                    </div>
                  ))}
                </div>

                {reading && (
                  <div className="text-black max-w-2xl mx-auto">
                    <p className="text-lg leading-8 whitespace-pre-line">
                      {reading}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {reading && (
              <div className="flex gap-4 justify-center mt-6 flex-wrap">
                <button
                  onClick={handleCopy}
                  className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 text-base font-medium"
                >
                  📋 텍스트 복사
                </button>
                <button
                  onClick={handleCaptureAndCopy}
                  className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 text-base font-medium"
                >
                  📸 이미지 복사
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}
