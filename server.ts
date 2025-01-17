import * as dotenv from 'dotenv';
import { initializeStorage } from '~/utils/supabase-storage.server';

dotenv.config();

// Initialize storage bucket
initializeStorage().catch(console.error);
