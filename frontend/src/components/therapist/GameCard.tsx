"use client";

import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

type GamesCardProps = {
  score: number;
  image: string;
  name: string;
  speed: string;
};

export default function GamesCard({
  score,
  image,
  name,
  speed,
}: GamesCardProps) {
  return (
    <div
      className="flex flex-col bg-gray-50 rounded-2xl border border-gray-200 shadow-sm w-40 
                        transform transition-transform duration-300 hover:scale-105 hover:shadow-lg"
    >
      <div className="px-4 py-4">
        <div className="grid items-center justify-center w-full">
          <div>
            <h2 className="text-base font-semibold tracking-tight text-gray-700 text-center">
              {name}
            </h2>
          </div>
          <div className="relative w-36 h-36 p-2">
            <img
              src={image}
              alt={name}
              className="w-full h-full object-cover rounded-lg brightness-50"
            />

            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-16">
                <CircularProgressbar
                  value={score}
                  text={`${score}%`}
                  styles={buildStyles({
                    pathColor: `hsl(${(score / 100) * 120}, 100%, 45%)`,
                    textColor: `hsl(${(score / 100) * 120}, 100%, 45%)`,
                  })}
                />
              </div>
            </div>
            <p className="absolute mt-1 left-1/2 transform -translate-x-1/2 text-xs text-gray-500">
              {speed}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
