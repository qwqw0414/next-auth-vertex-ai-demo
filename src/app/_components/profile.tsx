"use client"

import React, { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { User, Clock, LogOut } from 'lucide-react';
import { Session } from 'next-auth';

interface ExtendedSession extends Session {
  accessToken?: string;
  refreshToken?: string;
  expiresAt?: number;
}

const ProfileCard = () => {
  const { data: session } = useSession() as { data: ExtendedSession | null };
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    if (session?.expiresAt) {
      const updateTimeLeft = () => {
        const now = Date.now() / 1000; // 현재 시간을 Unix 타임스탬프로 변환
        const diff = (session?.expiresAt || 0) - now;

        if (diff > 0) {
          const days = Math.floor(diff / (60 * 60 * 24));
          const hours = Math.floor((diff % (60 * 60 * 24)) / (60 * 60));
          const minutes = Math.floor((diff % (60 * 60)) / 60);
          const seconds = Math.floor(diff % 60);

          let timeString = '';
          if (days > 0) timeString += `${days}일 `;
          if (hours > 0 || days > 0) timeString += `${hours}시간 `;
          if (minutes > 0 || hours > 0 || days > 0) timeString += `${minutes}분 `;
          timeString += `${seconds}초`;

          setTimeLeft(timeString);
        } else {
          setTimeLeft('만료됨');
        }
      };

      updateTimeLeft();
      const timer = setInterval(updateTimeLeft, 1000);
      return () => clearInterval(timer);
    }
  }, [session]);

  if (!session) {
    return null;
  }

  const handleLogout = () => {
    signOut({ callbackUrl: '/' });
  };

  return (
    <div className="bg-white shadow-lg rounded-lg p-6 max-w-sm mx-auto">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-4">
          {session.user?.image ? (
            <img
              src={session.user.image}
              alt="Profile"
              className="w-16 h-16 rounded-full"
            />
          ) : (
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
              <User className="w-8 h-8 text-gray-500" />
            </div>
          )}
          <div>
            <h2 className="text-xl font-semibold">{session.user?.name || '사용자'}</h2>
            <p className="text-gray-600">{session.user?.email}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center justify-center p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors duration-200"
          aria-label="로그아웃"
        >
          <LogOut className="w-5 h-5" />
        </button>
      </div>
      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <Clock className="w-4 h-4" />
          <span>세션 만료까지: {timeLeft}</span>
        </div>
      </div>
      {session.accessToken && (
        <div className="mt-2 pt-2 border-t border-gray-200">
          <p className="text-sm text-gray-500">액세스 토큰 사용 가능</p>
        </div>
      )}
      {session.expiresAt && (
        <div className="mt-2 text-xs text-gray-400">
          만료 일시: {new Date(session.expiresAt * 1000).toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' })}
        </div>
      )}
    </div>
  );
};

export default ProfileCard;