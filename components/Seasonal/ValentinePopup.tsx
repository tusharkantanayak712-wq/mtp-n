"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ValentinePopup() {
  const router = useRouter();

  const [show, setShow] = useState(false);
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    message: "",
  });

  useEffect(() => {
    const seen = sessionStorage.getItem("valentine_popup_seen");

    if (!seen) {
      setShow(true);
    }

    const now = new Date();
    let targetDate = new Date(now.getFullYear(), 1, 14); // Feb 14

    // If Feb 14 already passed → next year
    if (now > targetDate) {
      targetDate = new Date(now.getFullYear() + 1, 1, 14);
    }

    const timer = setInterval(() => {
      const current = new Date().getTime();
      const distance = targetDate.getTime() - current;

      if (distance <= 0) {
        setTimeLeft((prev) => ({
          ...prev,
          message: "It's Valentine's Day! 💖",
        }));
        clearInterval(timer);
        return;
      }

      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor(
          (distance % (1000 * 60 * 60 * 24)) /
          (1000 * 60 * 60)
        ),
        minutes: Math.floor(
          (distance % (1000 * 60 * 60)) /
          (1000 * 60)
        ),
        seconds: Math.floor(
          (distance % (1000 * 60)) / 1000
        ),
        message: "",
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleRedirect = () => {
    setShow(false);
    setTimeout(() => {
      sessionStorage.setItem("valentine_popup_seen", "true");
      router.push("/special-leaderboard");
    }, 300);
  };

  const handleClose = () => {
    setShow(false);
    setTimeout(() => {
      sessionStorage.setItem("valentine_popup_seen", "true");
    }, 300);
  };

  if (!show) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 99999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        backdropFilter: 'blur(8px)',
        animation: 'fadeIn 0.3s ease'
      }}
    >
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { 
            opacity: 0; 
            transform: translateY(30px);
          }
          to { 
            opacity: 1; 
            transform: translateY(0);
          }
        }
        @keyframes heartBeat {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }
      `}</style>

      {/* Popup Card */}
      <div
        style={{
          position: 'relative',
          width: '90%',
          maxWidth: '400px',
          borderRadius: '20px',
          padding: '32px 24px',
          textAlign: 'center',
          background: 'linear-gradient(135deg, rgba(236, 72, 153, 0.2), rgba(244, 63, 94, 0.15))',
          backdropFilter: 'blur(16px)',
          border: '1px solid rgba(236, 72, 153, 0.3)',
          boxShadow: '0 20px 60px rgba(236, 72, 153, 0.3)',
          animation: 'slideUp 0.4s ease-out'
        }}
      >
        {/* Close Button */}
        <button
          onClick={handleClose}
          style={{
            position: 'absolute',
            top: '12px',
            right: '12px',
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            color: '#fff',
            fontSize: '18px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(236, 72, 153, 0.3)';
            e.currentTarget.style.transform = 'rotate(90deg)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
            e.currentTarget.style.transform = 'rotate(0deg)';
          }}
        >
          ✕
        </button>

        {/* Heart Icon */}
        <div
          style={{
            fontSize: '64px',
            marginBottom: '16px',
            animation: 'heartBeat 1.5s ease-in-out infinite'
          }}
        >
          💖
        </div>

        {/* Title */}
        <h2
          style={{
            fontSize: '28px',
            fontWeight: 700,
            marginBottom: '8px',
            color: '#fff',
            textShadow: '0 2px 10px rgba(236, 72, 153, 0.5)'
          }}
        >
          Valentine Special
        </h2>

        {/* Description */}
        <p
          style={{
            fontSize: '14px',
            color: 'rgba(255, 255, 255, 0.8)',
            marginBottom: '24px',
            lineHeight: '1.5'
          }}
        >
          Celebrate love & epic wins.<br />
          Top 10 players will receive exclusive prizes!
        </p>

        {/* Countdown */}
        {timeLeft.message ? (
          <div
            style={{
              marginBottom: '24px',
              color: '#fda4af',
              fontWeight: 600,
              fontSize: '16px'
            }}
          >
            {timeLeft.message}
          </div>
        ) : (
          <div
            style={{
              marginBottom: '24px',
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '8px'
            }}
          >
            {["days", "hours", "minutes", "seconds"].map((unit) => (
              <div
                key={unit}
                style={{
                  borderRadius: '12px',
                  background: 'rgba(236, 72, 153, 0.15)',
                  border: '1px solid rgba(236, 72, 153, 0.3)',
                  padding: '10px 6px'
                }}
              >
                <div
                  style={{
                    fontSize: '20px',
                    fontWeight: 700,
                    color: '#fff'
                  }}
                >
                  {timeLeft[unit as keyof typeof timeLeft]}
                </div>
                <div
                  style={{
                    fontSize: '10px',
                    textTransform: 'uppercase',
                    color: 'rgba(255, 255, 255, 0.7)',
                    marginTop: '2px'
                  }}
                >
                  {unit}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* CTA Button */}
        <button
          onClick={handleRedirect}
          style={{
            padding: '12px 28px',
            borderRadius: '50px',
            background: 'linear-gradient(135deg, #ec4899, #f43f5e)',
            color: '#fff',
            fontWeight: 600,
            fontSize: '15px',
            border: 'none',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            boxShadow: '0 4px 16px rgba(236, 72, 153, 0.4)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 6px 20px rgba(236, 72, 153, 0.5)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 16px rgba(236, 72, 153, 0.4)';
          }}
        >
          View Special Leaderboard 💝
        </button>
      </div>
    </div>
  );
}
