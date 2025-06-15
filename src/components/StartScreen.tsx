
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface StartScreenProps {
  onStart: () => void;
}

const StartScreen = ({ onStart }: StartScreenProps) => {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-sky-400 to-green-400">
      <Card className="w-full max-w-md mx-auto p-8 bg-white/90 backdrop-blur-sm text-center">
        <div className="mb-8">
          <h1 className="text-5xl font-bold text-gray-800 mb-4">🏁</h1>
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Thumb Race</h2>
          <h3 className="text-xl text-gray-600 mb-6">Rally</h3>
          <p className="text-gray-600 mb-8">
            Use your thumbs alternately to race your cars to the finish line!
          </p>
        </div>

        <div className="mb-6 space-y-2">
          <div className="flex items-center justify-center space-x-4 text-2xl">
            <span>🚗</span>
            <span className="text-gray-400">VS</span>
            <span>🚙</span>
          </div>
        </div>

        <Button 
          onClick={onStart}
          className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-4 text-lg"
        >
          Start Racing
        </Button>

        <div className="mt-6 text-sm text-gray-500">
          <p>Touch each lane alternately with your thumbs</p>
          <p>First to reach 100 meters wins!</p>
        </div>
      </Card>
    </div>
  );
};

export default StartScreen;
