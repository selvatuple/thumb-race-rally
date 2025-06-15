
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface WinnerModalProps {
  winner: 'left' | 'right';
  onClose: () => void;
}

const WinnerModal = ({ winner, onClose }: WinnerModalProps) => {
  const winnerData = {
    left: {
      car: '🚗',
      color: 'Red',
      bgColor: 'bg-red-500',
      textColor: 'text-red-600'
    },
    right: {
      car: '🚙',
      color: 'Blue',
      bgColor: 'bg-blue-500',
      textColor: 'text-blue-600'
    }
  };

  const data = winnerData[winner];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-sm mx-auto p-8 text-center bg-white animate-scale-in">
        <div className="mb-6">
          <div className="text-6xl mb-4">{data.car}</div>
          <h2 className="text-3xl font-bold mb-2">🏆 Winner!</h2>
          <p className="text-xl">
            <span className={`font-bold ${data.textColor}`}>{data.color} Car</span> 
            <span className="block text-gray-600 text-base mt-2">
              reached the finish line first!
            </span>
          </p>
        </div>

        <div className="mb-6 text-4xl">
          🎉 🎊 🎉
        </div>

        <Button 
          onClick={onClose}
          className={`w-full ${data.bgColor} hover:opacity-90 text-white font-semibold py-3`}
        >
          Play Again
        </Button>
      </Card>
    </div>
  );
};

export default WinnerModal;
