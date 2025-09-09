import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './src/tests',
  fullyParallel: true,
  retries: 0, // No retries for the assessment purpose
  workers: 2, // Limiting to 2 workers for the assessment purpose. Also not added any CI environment variables
  reporter: 'html',
  /* Configure projects for major browsers */
  projects: [
    {
      name: 'Desktop Chrome',
      use: { ...devices['Desktop Chrome']},
    },
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'], isMobile: true },
    },
  ],
 
  use: {
    trace: 'on', // For the assessment purpose, keeping trace 'on' for all tests
    headless: true,
    screenshot: 'only-on-failure',
    video: 'on', // For the assessment purpose, keeping video 'on' for all tests
  },
  
});
