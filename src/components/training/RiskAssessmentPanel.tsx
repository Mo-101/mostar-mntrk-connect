
import { useState, useEffect } from 'react';
import { Shield } from "lucide-react";
import { useApi } from "@/hooks/useApi";
import { RiskAssessment } from '@/types/api';
import { DeepSeekInsights } from '@/components/DeepSeekInsights';

export function RiskAssessmentPanel() {
  const { apiCall, api, realtime } = useApi();
  const [riskLevel, setRiskLevel] = useState<'LOW' | 'MEDIUM' | 'HIGH'>('LOW');
  const [mitigationMeasures, setMitigationMeasures] = useState<string[]>([]);
  const [lastAssessment, setLastAssessment] = useState<string>('');

  useEffect(() => {
    const fetchRiskData = async () => {
      try {
        // Use optional chaining to safely access riskAssessments
        const latestAssessments = await apiCall<RiskAssessment[]>(
          () => api.riskAssessments?.getLatest() || 
                Promise.resolve({ success: false, error: 'API not available' })
        );
        
        if (latestAssessments && latestAssessments.length > 0) {
          // Sort by risk level priority
          const sortedAssessments = [...latestAssessments].sort((a, b) => {
            const riskPriority = { 'HIGH': 3, 'MEDIUM': 2, 'LOW': 1 };
            return riskPriority[b.risk_level] - riskPriority[a.risk_level];
          });
          
          const highestRisk = sortedAssessments[0];
          updateRiskData(highestRisk);
        }
      } catch (error) {
        console.error("Error fetching risk data:", error);
      }
    };
    
    fetchRiskData();
    
    // Subscribe to real-time risk assessment updates
    const unsubscribe = realtime.subscribe('risk-assessment', (data) => {
      if (Array.isArray(data) && data.length > 0) {
        // Sort by risk level priority
        const sortedAssessments = [...data].sort((a, b) => {
          const riskPriority = { 'HIGH': 3, 'MEDIUM': 2, 'LOW': 1 };
          return riskPriority[b.risk_level] - riskPriority[a.risk_level];
        });
        
        const highestRisk = sortedAssessments[0];
        updateRiskData(highestRisk);
      } else if (!Array.isArray(data)) {
        // Handle single assessment update
        updateRiskData(data);
      }
    });
    
    return () => {
      unsubscribe();
    };
  }, []);

  const updateRiskData = (assessment: RiskAssessment) => {
    setRiskLevel(assessment.risk_level as 'LOW' | 'MEDIUM' | 'HIGH');
    setMitigationMeasures(assessment.mitigation_measures.slice(0, 3));
    
    // Format assessment date
    const date = new Date(assessment.assessment_date);
    setLastAssessment(`${date.toLocaleDateString()}, ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`);
  };

  // Background and text color based on risk level
  const getRiskLevelStyle = (level: string) => {
    if (level === 'HIGH') return 'bg-red-500/20 text-red-500';
    if (level === 'MEDIUM') return 'bg-amber-500/20 text-amber-500';
    return 'bg-green-500/20 text-green-500';
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-300">Current Risk Level</div>
        <div className={`flex items-center gap-2 ${getRiskLevelStyle(riskLevel)} px-3 py-1 rounded-md text-xs font-medium`}>
          <Shield className="w-3 h-3" />
          {riskLevel}
        </div>
      </div>

      <div className="bg-[#1C2333] p-3 rounded-md">
        <div className="text-sm text-gray-300 mb-2">Top Mitigation Measures:</div>
        <ul className="text-xs text-gray-400 space-y-1.5">
          {mitigationMeasures.length > 0 ? (
            mitigationMeasures.map((measure, index) => (
              <li key={index}>• {measure}</li>
            ))
          ) : (
            <li>• No mitigation measures available</li>
          )}
        </ul>
      </div>

      <div className="grid grid-cols-3 gap-2 text-center">
        {['LOW', 'MEDIUM', 'HIGH'].map((level) => (
          <div 
            key={level}
            className={`p-2 rounded-md text-xs font-medium ${
              level === riskLevel 
                ? getRiskLevelStyle(level) 
                : 'bg-[#1C2333] text-gray-400'
            }`}
          >
            {level}
          </div>
        ))}
      </div>
      
      <div className="mt-4 pt-4 border-t border-[#2A324B]">
        <div className="text-xs text-gray-400 mb-4">
          Last assessment: {lastAssessment || 'Pending...'}
        </div>
        
        {/* DeepSeek Insights Section */}
        <DeepSeekInsights />
      </div>
    </div>
  );
}
