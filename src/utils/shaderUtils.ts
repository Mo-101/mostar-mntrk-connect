
// Vertex shader for particle system initialization
export const particleInitVertexShader = `
  attribute vec2 st;
  varying vec2 textureCoordinate;
  
  void main() {
    textureCoordinate = st;
    gl_Position = vec4(st * 2.0 - 1.0, 0.0, 1.0);
  }
`;

// Fragment shader for particle initialization
export const particleInitFragmentShader = `
  uniform sampler2D randomTexture;
  varying vec2 textureCoordinate;
  
  void main() {
    // Initial random position in world coordinates
    vec4 randomValues = texture2D(randomTexture, textureCoordinate);
    
    vec3 worldPosition;
    worldPosition.x = randomValues.x * 360.0 - 180.0; // longitude -180 to 180
    worldPosition.y = randomValues.y * 180.0 - 90.0;  // latitude -90 to 90
    worldPosition.z = randomValues.z * 10000.0;       // altitude

    // Output initial position and age of particle
    gl_FragColor = vec4(worldPosition, 0.0);
  }
`;

// Compute shader for updating particle positions
export const particleUpdateComputeShader = `
  uniform sampler2D currentParticlesPosition;
  uniform sampler2D windTexture;
  uniform vec3 dimensions;
  uniform vec2 uRange;
  uniform vec2 vRange;
  uniform float deltaTime;
  uniform float speedFactor;
  uniform float dropRate;
  uniform float dropRateBump;
  
  varying vec2 textureCoordinate;
  
  vec2 mapPositionToWindTextureCoord(vec3 position) {
    // Convert from world coordinates to texture coordinates
    float lon = (position.x + 180.0) / 360.0;
    float lat = (position.y + 90.0) / 180.0;
    
    return vec2(lon, lat);
  }
  
  vec2 getWindVector(vec3 position) {
    vec2 texCoord = mapPositionToWindTextureCoord(position);
    
    // Sample wind data from texture
    vec4 windData = texture2D(windTexture, texCoord);
    
    // Convert normalized value back to actual wind speed
    float u = mix(uRange.x, uRange.y, windData.r);
    float v = mix(vRange.x, vRange.y, windData.g);
    
    return vec2(u, v);
  }
  
  void main() {
    vec4 currentPosition = texture2D(currentParticlesPosition, textureCoordinate);
    vec3 pos = currentPosition.xyz;
    float age = currentPosition.w;
    
    vec2 windVector = getWindVector(pos);
    
    // Calculate new position
    float u = windVector.x * speedFactor * deltaTime;
    float v = windVector.y * speedFactor * deltaTime;
    
    // Update position based on wind vector
    pos.x += u;
    pos.y += v;
    
    // Handle wrapping around the globe
    if (pos.x < -180.0) pos.x += 360.0;
    if (pos.x > 180.0) pos.x -= 360.0;
    
    // Limit latitude
    pos.y = clamp(pos.y, -90.0, 90.0);
    
    // Age the particle
    age += deltaTime;
    
    // Determine if we should drop this particle and restart it
    // Higher ages and particles moving out of bounds get dropped more frequently
    float dropRateFactor = 1.0;
    if (windVector.x == 0.0 && windVector.y == 0.0) {
      dropRateFactor = 10.0; // Increase chance of dropping if no wind
    }
    
    float randVal = fract(sin(textureCoordinate.x * 12345.6789 + textureCoordinate.y * 98765.4321 + age * 54321.0) * 43758.5453);
    if (randVal < dropRate * dropRateFactor) {
      // Reset the particle with random values in the next frame
      age = 0.0;
      // Use a new random position
      pos.x = randVal * 360.0 - 180.0;
      pos.y = fract(randVal * 7.0) * 180.0 - 90.0;
    }
    
    // Output updated position and age
    gl_FragColor = vec4(pos, age);
  }
`;

// Vertex shader for rendering particles
export const particleRenderVertexShader = `
  attribute vec2 st;
  uniform sampler2D particlesTexture;
  uniform sampler2D previousParticlesTexture;
  uniform mat4 modelViewMatrix;
  uniform mat4 projectionMatrix;
  
  varying vec4 color;
  
  void main() {
    vec4 particlePosition = texture2D(particlesTexture, st);
    vec4 prevParticlePosition = texture2D(previousParticlesTexture, st);
    
    // Determine color based on speed
    float speed = length(particlePosition.xy - prevParticlePosition.xy);
    color = vec4(mix(vec3(0.0, 0.5, 1.0), vec3(1.0, 0.0, 0.0), speed / 0.2), 0.7);
    
    // Convert lat-lon to world coordinates
    float lambda = radians(particlePosition.x);
    float phi = radians(particlePosition.y);
    float cosLat = cos(phi);
    
    vec3 worldPos = vec3(
      6378137.0 * cosLat * cos(lambda) + particlePosition.z,
      6378137.0 * cosLat * sin(lambda) + particlePosition.z,
      6378137.0 * sin(phi) + particlePosition.z
    );
    
    // Apply projection
    gl_Position = projectionMatrix * modelViewMatrix * vec4(worldPos, 1.0);
    gl_PointSize = 1.5;
  }
`;

// Fragment shader for rendering particles
export const particleRenderFragmentShader = `
  varying vec4 color;
  
  void main() {
    gl_FragColor = color;
  }
`;
