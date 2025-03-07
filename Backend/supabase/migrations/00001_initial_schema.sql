-- Initial schema for Mastomys tracking system
create table if not exists locations (
    id serial primary key,
    name text not null,
    latitude double precision not null,
    longitude double precision not null,
    elevation numeric,
    created_at timestamp default now(),
    updated_at timestamp default now()
);

create table if not exists observations (
    id serial primary key,
    location_id integer references locations(id),
    observer_id uuid,
    observation_date timestamp not null,
    population_count integer,
    habitat_description text,
    weather_conditions jsonb default '{}'::jsonb,
    images text[] default array[]::text[],
    status text default 'pending',
    notes text,
    created_at timestamp default now(),
    updated_at timestamp default now(),
    constraint valid_status check (status in ('pending', 'verified', 'rejected'))
);

create table if not exists environmental_data (
    id serial primary key,
    location_id integer references locations(id),
    timestamp timestamp not null,
    temperature numeric,
    humidity numeric,
    rainfall numeric,
    soil_moisture numeric,
    vegetation_index numeric,
    created_at timestamp default now()
);

create table if not exists risk_assessments (
    id serial primary key,
    location_id integer references locations(id),
    assessment_date timestamp not null,
    risk_level text,
    factors jsonb default '{}'::jsonb,
    mitigation_measures text[] default array[]::text[],
    created_at timestamp default now(),
    updated_at timestamp default now(),
    constraint valid_risk_level check (risk_level in ('low', 'medium', 'high', 'critical'))
);

-- Create indexes
create index if not exists idx_observations_location on observations(location_id);
create index if not exists idx_observations_date on observations(observation_date);
create index if not exists idx_environmental_data_location on environmental_data(location_id);
create index if not exists idx_environmental_data_timestamp on environmental_data(timestamp);
create index if not exists idx_risk_assessments_location on risk_assessments(location_id);
create index if not exists idx_risk_assessments_level on risk_assessments(risk_level);

-- Create updated_at function
create or replace function handle_updated_at() 
returns trigger as $$
begin
    new.updated_at = now();
    return new;
end;
$$ language plpgsql;

-- Create triggers
drop trigger if exists on_update_locations on locations;
create trigger on_update_locations
    before update on locations
    for each row
    execute function handle_updated_at();

drop trigger if exists on_update_observations on observations;
create trigger on_update_observations
    before update on observations
    for each row
    execute function handle_updated_at();

drop trigger if exists on_update_risk_assessments on risk_assessments;
create trigger on_update_risk_assessments
    before update on risk_assessments
    for each row
    execute function handle_updated_at();

-- Enable RLS
alter table locations enable row level security;
alter table observations enable row level security;
alter table environmental_data enable row level security;
alter table risk_assessments enable row level security;

-- Create policies
drop policy if exists "Enable read access for all users" on locations;
create policy "Enable read access for all users"
    on locations for select
    using (true);

drop policy if exists "Enable read access for all users" on observations;
create policy "Enable read access for all users"
    on observations for select
    using (true);

drop policy if exists "Enable read access for all users" on environmental_data;
create policy "Enable read access for all users"
    on environmental_data for select
    using (true);

drop policy if exists "Enable read access for all users" on risk_assessments;
create policy "Enable read access for all users"
    on risk_assessments for select
    using (true);

-- Insert initial data
insert into locations (name, latitude, longitude, elevation) values
    ('Lagos Research Station', 6.5244, 3.3792, 41),
    ('Ibadan Field Site', 7.3775, 3.9470, 227),
    ('Port Harcourt Monitor Point', 4.8156, 7.0498, 15);

insert into observations (location_id, observation_date, population_count, habitat_description, weather_conditions, status) values
    (1, now(), 45, 'Urban environment with mixed vegetation', '{"temperature": 28, "humidity": 75}'::jsonb, 'verified'),
    (2, now(), 32, 'Agricultural area with dense ground cover', '{"temperature": 26, "humidity": 80}'::jsonb, 'verified'),
    (3, now(), 28, 'Coastal region with scattered vegetation', '{"temperature": 29, "humidity": 85}'::jsonb, 'verified');

insert into environmental_data (location_id, timestamp, temperature, humidity, rainfall, soil_moisture, vegetation_index) values
    (1, now(), 28.5, 75, 12.5, 0.45, 0.65),
    (2, now(), 26.2, 80, 15.8, 0.52, 0.78),
    (3, now(), 29.1, 85, 18.2, 0.48, 0.58);

insert into risk_assessments (location_id, assessment_date, risk_level, factors, mitigation_measures) values
    (1, now(), 'medium', '{"population_density": "high", "habitat_suitability": "medium"}'::jsonb, array['Increased monitoring', 'Public awareness campaigns']),
    (2, now(), 'high', '{"population_density": "high", "habitat_suitability": "high"}'::jsonb, array['Daily surveillance', 'Preventive measures']),
    (3, now(), 'low', '{"population_density": "low", "habitat_suitability": "medium"}'::jsonb, array['Regular monitoring', 'Habitat management']);
