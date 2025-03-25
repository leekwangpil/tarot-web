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

  const handleCopyText = () => {
    const cardText = selectedCards.map((card) => card.name).join(', ');
    const textToCopy = `[뽑은 카드]\n${cardText}\n\n[해석 결과]\n${reading}`;

    navigator.clipboard
      .writeText(textToCopy)
      .then(() => {
        alert('텍스트가 복사되었습니다!');
      })
      .catch(() => {
        alert('텍스트 복사에 실패했습니다.');
      });
  };

  const handleCopyImage = async () => {
    const element = document.getElementById('result');
    if (!element) return;

    try {
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        backgroundColor: null,
      });

      canvas.toBlob((blob) => {
        if (blob) {
          navigator.clipboard
            .write([new ClipboardItem({ 'image/png': blob })])
            .then(() => {
              alert('이미지가 복사되었습니다!');
            })
            .catch(() => {
              alert('이미지 복사가 지원되지 않는 환경입니다.');
            });
        }
      });
    } catch (error) {
      console.error('이미지 복사 중 오류:', error);
      alert('이미지 복사에 실패했습니다.');
    }
  };

  const handleDownloadImage = async () => {
    const element = document.getElementById('result');
    if (!element) return;

    try {
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        backgroundColor: null,
      });
      const image = canvas.toDataURL('image/png');

      const link = document.createElement('a');
      link.href = image;
      link.download = 'tarot-reading.png';
      link.click();
    } catch (error) {
      console.error('이미지 저장 중 오류:', error);
      alert('이미지 저장에 실패했습니다.');
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
              id="result"
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
              <div className="flex flex-wrap justify-center gap-3 mt-6">
                <button
                  onClick={handleCopyText}
                  className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2 shadow-lg"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                    <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
                  </svg>
                  텍스트 복사
                </button>
                <button
                  onClick={handleCopyImage}
                  className="px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors flex items-center gap-2 shadow-lg"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                      clipRule="evenodd"
                    />
                  </svg>
                  이미지 복사
                </button>
                <button
                  onClick={handleDownloadImage}
                  className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center gap-2 shadow-lg"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                  이미지 저장
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}
