'use client';

import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Clock, CheckCircle2 } from 'lucide-react';
import type {
  TransportData,
  EnergyData,
  FoodData,
  ShoppingData,
  WasteData,
  TravelData,
  AssessmentData,
  FootprintResult,
} from '@/types';
import { calculateTotalFootprint } from '@/lib/calculator/calculator';
import { generateId } from '@/utils/validation';
import { saveAssessment } from '@/services/assessment.service';
import TransportStep from './TransportStep';
import EnergyStep from './EnergyStep';
import FoodStep from './FoodStep';
import ShoppingStep from './ShoppingStep';
import WasteStep from './WasteStep';
import TravelStep from './TravelStep';
import ResultsView from './ResultsView';

const STEP_LABELS = ['Transport', 'Energy', 'Food', 'Shopping', 'Waste', 'Travel'];
const TOTAL_STEPS = 6;

const defaultTransportData: TransportData = {
  vehicleType: 'petrol',
  dailyDistanceKm: 20,
  publicTransportDaysPerWeek: 2,
  flightsPerYear: 2,
};

const defaultEnergyData: EnergyData = {
  monthlyElectricityKwh: 300,
  renewablePercentage: 0,
  usesGas: true,
  monthlyGasM3: 50,
  acHeatingHoursPerDay: 4,
};

const defaultFoodData: FoodData = {
  dietType: 'mediumMeat',
  localFoodPercentage: 30,
  foodWasteFrequency: 'sometimes',
};

const defaultShoppingData: ShoppingData = {
  clothingItemsPerMonth: 3,
  electronicsPerYear: 2,
  prefersSecondHand: false,
};

const defaultWasteData: WasteData = {
  recyclingFrequency: 'sometimes',
  composts: false,
  singleUsePlastic: 'sometimes',
  usesReusableItems: false,
};

const defaultTravelData: TravelData = {
  flightsPerYear: 2,
  averageFlightDistance: 'medium',
  businessTravelPercentage: 20,
};

export default function CalculatorWizard() {
  const [currentStep, setCurrentStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isCalculating, setIsCalculating] = useState(false);
  const [result, setResult] = useState<FootprintResult | null>(null);

  // Form data state
  const [transportData, setTransportData] = useState<TransportData>(defaultTransportData);
  const [energyData, setEnergyData] = useState<EnergyData>(defaultEnergyData);
  const [foodData, setFoodData] = useState<FoodData>(defaultFoodData);
  const [shoppingData, setShoppingData] = useState<ShoppingData>(defaultShoppingData);
  const [wasteData, setWasteData] = useState<WasteData>(defaultWasteData);
  const [travelData, setTravelData] = useState<TravelData>(defaultTravelData);

  const showResults = currentStep === TOTAL_STEPS;

  const goNext = useCallback(async () => {
    if (currentStep === TOTAL_STEPS - 1) {
      // Calculate results
      setIsCalculating(true);
      try {
        const assessmentData: AssessmentData = {
          id: generateId(),
          date: new Date().toISOString(),
          transport: transportData,
          energy: energyData,
          food: foodData,
          shopping: shoppingData,
          waste: wasteData,
          travel: travelData,
        };

        const footprintResult = calculateTotalFootprint(assessmentData);
        setResult(footprintResult);

        // Save asynchronously
        try {
          await saveAssessment(assessmentData);
        } catch {
          // Silently fail save — results are still shown
          console.warn('Failed to save assessment');
        }

        setDirection(1);
        setCurrentStep(TOTAL_STEPS);
      } catch (err) {
        console.error('Calculation error:', err);
      } finally {
        setIsCalculating(false);
      }
    } else {
      setDirection(1);
      setCurrentStep((prev) => Math.min(prev + 1, TOTAL_STEPS));
    }
  }, [currentStep, transportData, energyData, foodData, shoppingData, wasteData, travelData]);

  const goBack = useCallback(() => {
    setDirection(-1);
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  }, []);

  const handleRecalculate = useCallback(() => {
    setResult(null);
    setDirection(-1);
    setCurrentStep(0);
  }, []);

  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 300 : -300,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (dir: number) => ({
      x: dir > 0 ? -300 : 300,
      opacity: 0,
    }),
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return <TransportStep data={transportData} onChange={setTransportData} />;
      case 1:
        return <EnergyStep data={energyData} onChange={setEnergyData} />;
      case 2:
        return <FoodStep data={foodData} onChange={setFoodData} />;
      case 3:
        return <ShoppingStep data={shoppingData} onChange={setShoppingData} />;
      case 4:
        return <WasteStep data={wasteData} onChange={setWasteData} />;
      case 5:
        return <TravelStep data={travelData} onChange={setTravelData} />;
      default:
        return null;
    }
  };

  if (showResults && result) {
    return <ResultsView result={result} onRecalculate={handleRecalculate} />;
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
            Step {currentStep + 1} of {TOTAL_STEPS}
          </span>
          {currentStep === 0 && (
            <span className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
              <Clock className="w-3.5 h-3.5" />
              Takes ~3 minutes
            </span>
          )}
        </div>

        {/* Step Progress */}
        <div className="flex gap-1.5">
          {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
            <div
              key={i}
              className="flex-1 h-2 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700"
            >
              <motion.div
                className="h-full rounded-full bg-emerald-500"
                initial={{ width: '0%' }}
                animate={{ width: i <= currentStep ? '100%' : '0%' }}
                transition={{ duration: 0.3 }}
              />
            </div>
          ))}
        </div>

        {/* Step Labels */}
        <div className="flex mt-2">
          {STEP_LABELS.map((label, i) => (
            <div key={label} className="flex-1 text-center">
              <span
                className={`text-xs font-medium ${
                  i === currentStep
                    ? 'text-emerald-600 dark:text-emerald-400'
                    : i < currentStep
                    ? 'text-gray-500 dark:text-gray-400'
                    : 'text-gray-400 dark:text-gray-500'
                }`}
              >
                {i < currentStep ? (
                  <span className="flex items-center justify-center gap-0.5">
                    <CheckCircle2 className="w-3 h-3" />
                    {label}
                  </span>
                ) : (
                  label
                )}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Step Content with Animation */}
      <div className="relative overflow-hidden min-h-[400px]">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentStep}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            {renderStep()}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
        <button
          type="button"
          onClick={goBack}
          disabled={currentStep === 0}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
        >
          <ChevronLeft className="w-4 h-4" />
          Back
        </button>

        <button
          type="button"
          onClick={goNext}
          disabled={isCalculating}
          className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors shadow-lg shadow-emerald-600/25 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
        >
          {isCalculating ? (
            <>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
              />
              Calculating...
            </>
          ) : currentStep === TOTAL_STEPS - 1 ? (
            <>
              Calculate Results
              <CheckCircle2 className="w-4 h-4" />
            </>
          ) : (
            <>
              Next
              <ChevronRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>
    </div>
  );
}
