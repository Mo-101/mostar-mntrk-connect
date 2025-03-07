// File root: supabase/functions/chat/
// File name: index.ts

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Configuration, OpenAIApi } from "openai";
import { OpenAI } from "../openai.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { query, type } = await req.json();

    if (!query || !type) {
      return new Response(JSON.stringify({ error: "Query and type are required" }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    const supabaseClient = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_ANON_KEY')!); // Non-null assertion

    const configuration = new Configuration({ apiKey: Deno.env.get('OPENAI_API_KEY')! }); // Non-null assertion
    const openai = new OpenAIApi(configuration);

    const prompt = ((): string => {  // Immediately invoked function expression for prompt generation
      switch (type) {
        case 'analysis': return `Analyze the following environmental data and provide insights: ${query}`;
        case 'prediction': return `Based on the data: ${query}, predict potential environmental changes.`;
        default: return `Answer the following question about environmental data: ${query}`;
      }
    })();

    const completion = await openai.createCompletion({
      model: "gpt-3.5-turbo",
      prompt,
      temperature: 0.7,
      max_tokens: 500,
    });

    const response = completion.data.choices[0].text?.trim() || "No response from OpenAI"; // Handle potential undefined response

    try { // Separate try-catch for Supabase interaction
      await supabaseClient.from('chat_history').insert([{ query, response, type, timestamp: new Date().toISOString() }]);
    } catch (dbError) {
      console.error("Error inserting into Supabase:", dbError);
      // Consider whether to return an error to the client or just log the database error.
    }


    return new Response(JSON.stringify({ result: response }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 });

  } catch (error) {
    console.error('Error in GPT process:', error);
    return new Response(JSON.stringify({ error: error.message }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 });
  }
});

