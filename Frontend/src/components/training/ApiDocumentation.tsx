
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export function ApiDocumentation() {
  return (
    <div className="p-4 bg-[#1C2333] rounded-md">
      <h3 className="text-sm font-medium text-gray-200 mb-4">API Documentation</h3>
      
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="item-1">
          <AccordionTrigger className="text-xs text-gray-300">Backend API Structure</AccordionTrigger>
          <AccordionContent className="text-xs text-gray-400">
            <p className="mb-2">The backend is organized into two main components:</p>
            <ul className="list-disc pl-4 space-y-1">
              <li>API Server: Handles RESTful endpoints for data operations</li>
              <li>Agent: Manages AI model processes and real-time communication</li>
            </ul>
            <p className="mt-2">Both components communicate with Supabase for data persistence.</p>
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="item-2">
          <AccordionTrigger className="text-xs text-gray-300">Available Endpoints</AccordionTrigger>
          <AccordionContent className="text-xs text-gray-400">
            <div className="space-y-2">
              <div>
                <p className="font-medium">Agent API:</p>
                <ul className="list-disc pl-4">
                  <li>GET /health - Health check endpoint</li>
                  <li>GET/POST /test - Test connectivity</li>
                  <li>POST /chat - Submit prompts to the AI model</li>
                </ul>
              </div>
              
              <div>
                <p className="font-medium">Main API:</p>
                <ul className="list-disc pl-4">
                  <li>GET /api/training-metrics - Get training metrics</li>
                  <li>GET /api/wind-data - Get wind data for visualization</li>
                  <li>GET /api/locations - Get tracking locations</li>
                  <li>GET /api/risk-assessments - Get risk assessments</li>
                </ul>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="item-3">
          <AccordionTrigger className="text-xs text-gray-300">Environment Configuration</AccordionTrigger>
          <AccordionContent className="text-xs text-gray-400">
            <p className="mb-2">The application uses centralized environment configuration:</p>
            <ul className="list-disc pl-4 space-y-1">
              <li>Supabase: Authentication and database</li>
              <li>OpenAI/DeepSeek: AI model integration</li>
              <li>OpenWeather: Weather data API</li>
              <li>Cesium: 3D globe visualization</li>
            </ul>
            <p className="mt-2">All configuration is managed through environment variables.</p>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
