import * as dotenv from 'dotenv';
// Load environment variables before other imports
dotenv.config();

import { createClient } from '@supabase/supabase-js';
import { getEnvVars } from '../app/utils/env.server';
import { ANIMATED_AVATARS, STATIC_AVATARS } from '../app/constants/avatars';
import * as fs from 'fs';
import * as path from 'path';
import { initializeStorage } from '../app/utils/supabase-storage.server';

const env = getEnvVars();

// Create a Supabase client with the service role key for admin operations
const supabaseAdmin = createClient(
  env.SUPABASE_URL,
  env.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  },
);

async function uploadPresetAvatars() {
  try {
    console.log('Initializing storage...');
    await initializeStorage();

    console.log('Starting preset avatars upload...');

    // Upload animated avatars
    for (const avatar of ANIMATED_AVATARS) {
      const filePath = path.join(process.cwd(), 'public', avatar.localPath);

      if (!fs.existsSync(filePath)) {
        console.warn(`File not found: ${filePath}`);
        continue;
      }

      const fileContent = fs.readFileSync(filePath);
      const fileName = path.basename(avatar.localPath);

      const { error } = await supabaseAdmin.storage
        .from('avatars')
        .upload(`preset/${fileName}`, fileContent, {
          cacheControl: '3600',
          upsert: true,
        });

      if (error) {
        console.error(`Error uploading ${fileName}:`, error);
      } else {
        console.log(`Successfully uploaded ${fileName}`);
      }
    }

    // Upload static avatars
    for (const avatar of STATIC_AVATARS) {
      const filePath = path.join(process.cwd(), 'public', avatar.localPath);

      if (!fs.existsSync(filePath)) {
        console.warn(`File not found: ${filePath}`);
        continue;
      }

      const fileContent = fs.readFileSync(filePath);
      const fileName = path.basename(avatar.localPath);

      const { error } = await supabaseAdmin.storage
        .from('avatars')
        .upload(`preset/${fileName}`, fileContent, {
          cacheControl: '3600',
          upsert: true,
        });

      if (error) {
        console.error(`Error uploading ${fileName}:`, error);
      } else {
        console.log(`Successfully uploaded ${fileName}`);
      }
    }

    console.log('Preset avatars upload completed!');
  } catch (error) {
    console.error('Error uploading preset avatars:', error);
    process.exit(1);
  }
}

// Run the upload script
uploadPresetAvatars();
