type Config = {
  supabaseUrl: string;
  supabaseAnonKey: string;
  anthropicApiKey: string;
  groqApiKey: string;
  // Add other config variables here
};

function validateConfig(config: Config): asserts config is Config {
  for (const [key, value] of Object.entries(config)) {
    if (value === undefined) {
      throw new Error(`Config error: ${key} is undefined`);
    }
  }
}

const config = {
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL!,
  supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  anthropicApiKey: process.env.ANTHROPIC_API_KEY!,
  groqApiKey: process.env.GROQ_API_KEY!,
  // Add other config variables here
};

validateConfig(config);

export default config as Config;
