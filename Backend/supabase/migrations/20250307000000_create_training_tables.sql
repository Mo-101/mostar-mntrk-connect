
-- Create training metrics table
CREATE TABLE IF NOT EXISTS public.training_metrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    epoch INTEGER NOT NULL,
    accuracy FLOAT NOT NULL,
    loss FLOAT NOT NULL,
    val_accuracy FLOAT,
    val_loss FLOAT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create training sessions table
CREATE TABLE IF NOT EXISTS public.training_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    status TEXT NOT NULL CHECK (status IN ('running', 'paused', 'completed', 'failed', 'reset')),
    started_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    paused_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    target_epochs INTEGER DEFAULT 50,
    current_epoch INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create AI logs table to store DeepSeek interactions
CREATE TABLE IF NOT EXISTS public.ai_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    prompt TEXT NOT NULL,
    response TEXT NOT NULL,
    processing_time FLOAT,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create weather data table for weather metrics
CREATE TABLE IF NOT EXISTS public.weather_data (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    type TEXT NOT NULL,
    value FLOAT NOT NULL,
    unit TEXT NOT NULL,
    location TEXT,
    coordinates JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create wind data table for 3D visualization
CREATE TABLE IF NOT EXISTS public.wind_data (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    coordinates FLOAT[] NOT NULL,
    u FLOAT NOT NULL,
    v FLOAT NOT NULL,
    speed FLOAT NOT NULL,
    direction FLOAT NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT now(),
    position JSONB NOT NULL,
    weather TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Add triggers for updated_at columns
CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = now();
   RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_training_metrics_updated_at
BEFORE UPDATE ON public.training_metrics
FOR EACH ROW EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_training_sessions_updated_at
BEFORE UPDATE ON public.training_sessions
FOR EACH ROW EXECUTE FUNCTION update_timestamp();

-- Enable row-level security
ALTER TABLE public.training_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.training_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.weather_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wind_data ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (since we don't have auth yet)
CREATE POLICY "Allow public read access" ON public.training_metrics
FOR SELECT USING (true);

CREATE POLICY "Allow public read access" ON public.training_sessions
FOR SELECT USING (true);

CREATE POLICY "Allow public read access" ON public.ai_logs
FOR SELECT USING (true);

CREATE POLICY "Allow public read access" ON public.weather_data
FOR SELECT USING (true);

CREATE POLICY "Allow public read access" ON public.wind_data
FOR SELECT USING (true);

-- Create policies for public write access
CREATE POLICY "Allow public write access" ON public.training_metrics
FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public write access" ON public.training_sessions
FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public write access" ON public.ai_logs
FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public write access" ON public.weather_data
FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public write access" ON public.wind_data
FOR INSERT WITH CHECK (true);

-- Create policies for public update access
CREATE POLICY "Allow public update access" ON public.training_metrics
FOR UPDATE USING (true);

CREATE POLICY "Allow public update access" ON public.training_sessions
FOR UPDATE USING (true);

-- Enable realtime subscriptions for these tables
ALTER PUBLICATION supabase_realtime ADD TABLE public.training_metrics;
ALTER PUBLICATION supabase_realtime ADD TABLE public.training_sessions;
ALTER PUBLICATION supabase_realtime ADD TABLE public.weather_data;
ALTER PUBLICATION supabase_realtime ADD TABLE public.wind_data;

-- Set these tables to full replica identity for realtime
ALTER TABLE public.training_metrics REPLICA IDENTITY FULL;
ALTER TABLE public.training_sessions REPLICA IDENTITY FULL;
ALTER TABLE public.weather_data REPLICA IDENTITY FULL;
ALTER TABLE public.wind_data REPLICA IDENTITY FULL;
