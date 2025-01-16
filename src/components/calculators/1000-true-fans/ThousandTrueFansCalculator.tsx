import React, { useState } from 'react';
import { PlusCircle, RefreshCw } from 'lucide-react';
import { InfoTooltip } from './InfoTooltip';
import { RevenueStream } from './RevenueStream';
import { RevenueChart } from './RevenueChart';
import { NumberInput } from './NumberInput';

interface RevenueStreamType {
  id: string;
  name: string;
  revenue: number;
}

export const ThousandTrueFansCalculator: React.FC = () => {
  const [numFans, setNumFans] = useState<number>(1000);
  const [spendPerFan, setSpendPerFan] = useState<number>(100);
  const [revenueStreams, setRevenueStreams] = useState<RevenueStreamType[]>([
    { id: '1', name: '1 on 1 Consulting Package', revenue: 20000 },
    { id: '2', name: 'Awesome Training Courses', revenue: 24850 },
  ]);
  const [showResults, setShowResults] = useState<boolean>(false);

  const handleAddRevenueStream = () => {
    const newStream = {
      id: Date.now().toString(),
      name: '',
      revenue: 0,
    };
    setRevenueStreams([...revenueStreams, newStream]);
  };

  const handleUpdateRevenueStream = (
    id: string,
    field: 'name' | 'revenue',
    value: string | number
  ) => {
    setRevenueStreams(
      revenueStreams.map((stream) =>
        stream.id === id ? { ...stream, [field]: value } : stream
      )
    );
  };

  const handleDeleteRevenueStream = (id: string) => {
    setRevenueStreams(revenueStreams.filter((stream) => stream.id !== id));
  };

  const calculateResults = () => {
    setShowResults(true);
  };

  const resetCalculator = () => {
    setShowResults(false);
    setNumFans(1000);
    setSpendPerFan(100);
    setRevenueStreams([
      { id: '1', name: '1 on 1 Consulting Package', revenue: 20000 },
      { id: '2', name: 'Awesome Training Courses', revenue: 24850 },
    ]);
  };

  const trueFansRevenue = numFans * spendPerFan;
  const superFansRevenue = revenueStreams.reduce((total, stream) => total + stream.revenue, 0);
  const totalRevenue = trueFansRevenue + superFansRevenue;
  
  const fansNeededFor100k = Math.ceil(
    (100000 - superFansRevenue) / spendPerFan
  );

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6">
      {/* Main border container */}
      <div className="border border-gray-200 rounded-xl shadow-sm p-6 space-y-8">
        {/* Input Section */}
        <div className="space-y-6">
          <h1 className="text-3xl font-bold text-skin-base">
            1,000 True Fans Revenue Calculator
          </h1>
          
          <div className="bg-skin-card rounded-xl p-6 shadow-sm border border-skin-base">
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="flex items-center text-skin-base font-medium">
                    Number of True Fans
                    <InfoTooltip text="Enter your estimated number of dedicated followers who will consistently support your work." />
                  </label>
                  <NumberInput
                    value={numFans}
                    onChange={setNumFans}
                    placeholder="1,000"
                    className="mt-1"
                  />
                </div>

                <div>
                  <label className="flex items-center text-skin-base font-medium">
                    Average Yearly Spend per Fan
                    <InfoTooltip text="The average amount each true fan spends on your products/services annually." />
                  </label>
                  <NumberInput
                    value={spendPerFan}
                    onChange={setSpendPerFan}
                    placeholder="100"
                    prefix="$"
                    className="mt-1"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-4">
                  <label className="flex items-center text-skin-base font-medium">
                    Additional "Super Fan" Revenue Streams
                    <InfoTooltip text="Add premium offerings or special products/services for your most dedicated fans." />
                  </label>
                  <button
                    onClick={handleAddRevenueStream}
                    className="flex items-center gap-2 text-emerald-600 hover:text-emerald-700"
                  >
                    <PlusCircle size={20} />
                    Add Stream
                  </button>
                </div>
                
                {revenueStreams.map((stream) => (
                  <RevenueStream
                    key={stream.id}
                    {...stream}
                    onUpdate={handleUpdateRevenueStream}
                    onDelete={handleDeleteRevenueStream}
                  />
                ))}
              </div>

              <div className="flex gap-4">
                <button
                  onClick={calculateResults}
                  className="flex-1 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 shadow-sm border-2 border-emerald-100 text-emerald-700 font-medium hover:shadow-md transition-shadow"
                >
                  Calculate Revenue
                </button>
                <button
                  onClick={resetCalculator}
                  className="flex items-center justify-center gap-2 px-6 rounded-xl border-2 border-skin-base text-skin-base hover:bg-skin-secondary transition-colors"
                >
                  <RefreshCw size={20} />
                  Reset
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Results Section */}
        {showResults && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-skin-base">1,000 True Fan Financial Projection</h2>
            
            <div className="bg-skin-card rounded-xl p-6 shadow-sm border border-skin-base">
              <div className="space-y-6">
                {/* Metrics Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 bg-white rounded-lg border-2 border-emerald-100 shadow-sm hover:shadow-md transition-shadow">
                    <p className="text-sm text-emerald-600 font-medium">True Fans Revenue</p>
                    <p className="text-xl sm:text-2xl font-bold text-emerald-700 truncate">
                      ${trueFansRevenue.toLocaleString()}
                    </p>
                  </div>
                  
                  <div className="p-4 bg-white rounded-lg border-2 border-emerald-100 shadow-sm hover:shadow-md transition-shadow">
                    <p className="text-sm text-emerald-600 font-medium">Super Fans Revenue</p>
                    <p className="text-xl sm:text-2xl font-bold text-emerald-700 truncate">
                      ${superFansRevenue.toLocaleString()}
                    </p>
                  </div>
                </div>
                
                {/* Total Revenue and Fans Needed */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-lg border-2 border-emerald-200 shadow-sm hover:shadow-md transition-shadow">
                    <p className="text-sm text-emerald-600 font-medium">Total Annual Revenue</p>
                    <p className="text-2xl sm:text-3xl font-bold text-emerald-700 truncate">
                      ${totalRevenue.toLocaleString()}
                    </p>
                  </div>

                  <div className="p-4 bg-white rounded-lg border-2 border-emerald-100 shadow-sm hover:shadow-md transition-shadow">
                    <p className="text-sm text-emerald-600 font-medium">True Fans for $100k/year</p>
                    <p className="text-xl sm:text-2xl font-bold text-emerald-700 truncate">
                      {fansNeededFor100k.toLocaleString()} fans
                    </p>
                    <p className="text-xs sm:text-sm text-emerald-600 mt-1 truncate">
                      (After ${superFansRevenue.toLocaleString()} Super Fan revenue)
                    </p>
                  </div>
                </div>

                {/* Chart - Always Below */}
                <div className="h-[300px] sm:h-[400px] w-full mt-6">
                  <RevenueChart
                    trueFansRevenue={trueFansRevenue}
                    superFansRevenue={revenueStreams.map((stream) => stream.revenue)}
                    superFansNames={revenueStreams.map((stream) => stream.name)}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Make sure to export the component as both a named export and default export
export default ThousandTrueFansCalculator;