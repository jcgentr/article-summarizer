type Config = {
  supabaseUrl: string;
  supabaseAnonKey: string;
  supabaseServiceRoleKey: string;
  anthropicApiKey: string;
  stripeApiKey: string;
  stripePriceId: string;
  stripeWebhookSecret: string;
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
  supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY!,
  anthropicApiKey: process.env.ANTHROPIC_API_KEY!,
  stripeApiKey: process.env.STRIPE_API_KEY!,
  stripePriceId: process.env.STRIPE_PRICE_ID!,
  stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET!,
};

validateConfig(config);

export default config as Config;
