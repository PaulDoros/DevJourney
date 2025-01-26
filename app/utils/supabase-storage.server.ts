import { createClient } from '@supabase/supabase-js';
import { getEnvVars } from './env.server';

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

// Add this function to initialize folder structure
export async function createFolderStructure(userId: string) {
  try {
    // Create an empty file to establish the folder structure
    const placeholderFile = new Uint8Array(0);

    // Create the user's custom folder
    await supabaseAdmin.storage
      .from('avatars')
      .upload(`${userId}/custom/.keep`, placeholderFile, {
        upsert: true,
      });

    console.log('Folder structure created for user:', userId);
  } catch (error) {
    console.error('Error creating folder structure:', error);
  }
}

// Update the initializeStorage function
export async function initializeStorage() {
  try {
    // List all buckets
    const { data: buckets, error: listError } =
      await supabaseAdmin.storage.listBuckets();

    if (listError) {
      throw listError;
    }

    // Check if avatars bucket exists
    const avatarsBucket = buckets?.find((bucket) => bucket.name === 'avatars');

    if (!avatarsBucket) {
      // Create the avatars bucket
      const { data, error: createError } =
        await supabaseAdmin.storage.createBucket('avatars', {
          public: true,
          fileSizeLimit: 5242880, // 5MB in bytes
          allowedMimeTypes: ['image/jpeg', 'image/png', 'image/gif'],
        });

      if (createError) {
        console.error('Error creating bucket:', createError);
        throw createError;
      }

      console.log('Avatars bucket created successfully');
    } else {
      console.log('Avatars bucket already exists');
    }

    return true;
  } catch (error) {
    console.error('Error initializing storage:', error);
    throw error;
  }
}

export async function deleteOldAvatar(url: string) {
  if (!url) return;

  try {
    // Extract the path after the bucket name
    const path = url.split('avatars/').pop();
    if (!path) return;

    console.log('Attempting to delete from storage, path:', path);

    // Use supabaseAdmin for storage operations
    const { data, error } = await supabaseAdmin.storage
      .from('avatars')
      .remove([path]);

    if (error) {
      console.error('Error deleting from storage:', error);
      throw error;
    }

    console.log('Delete result:', data);
    return data;
  } catch (error) {
    console.error('Error in deleteOldAvatar:', error);
    throw error;
  }
}

// Let's update deletePersonalAvatar to match the upload pattern
export async function deletePersonalAvatar(avatarPath: string) {
  try {
    console.log('Starting deletion with path:', avatarPath);

    // Extract userId and filename from the path
    const [userId, _, filename] = avatarPath.split('/');
    const filePath = `${userId}/custom/${filename}`;

    console.log('Delete request:', {
      bucket: 'avatars',
      filePath,
      originalPath: avatarPath,
    });

    // Use supabaseAdmin for storage operations
    const { data, error } = await supabaseAdmin.storage
      .from('avatars')
      .remove([filePath]);

    if (error) {
      console.error('Delete error:', error);
      throw error;
    }

    console.log('Delete success:', {
      path: filePath,
      result: data,
    });

    return true;
  } catch (error) {
    console.error('Delete failed:', {
      error,
      path: avatarPath,
    });
    throw error;
  }
}

// Update getUserAvatars to create folder structure if it doesn't exist
export async function getUserAvatars(userId: string) {
  try {
    // Check if user's folder exists
    const { data: folderCheck } = await supabaseAdmin.storage
      .from('avatars')
      .list(`${userId}/custom`);

    // If folder doesn't exist, create it
    if (!folderCheck || folderCheck.length === 0) {
      await createFolderStructure(userId);
    }

    const { data, error } = await supabaseAdmin.storage
      .from('avatars')
      .list(`${userId}/custom`, {
        sortBy: { column: 'created_at', order: 'desc' },
      });

    if (error) {
      console.error('Error fetching user avatars:', error);
      return [];
    }

    // Filter out the .keep file and map to correct format
    const avatars = data
      .filter((file) => file.name !== '.keep')
      .map((file) => ({
        name: `${userId}/custom/${file.name}`, // This is the full path needed for deletion
        url: supabaseAdmin.storage
          .from('avatars')
          .getPublicUrl(`${userId}/custom/${file.name}`).data.publicUrl,
        size: file.metadata.size,
        created_at: file.created_at,
      }));

    console.log('Fetched avatars:', avatars);
    return avatars;
  } catch (error) {
    console.error('Error in getUserAvatars:', error);
    return [];
  }
}

// Update the upload function to ensure proper path structure
export async function uploadAvatar(
  userId: string,
  file: Blob,
  filename: string,
) {
  const filePath = `${userId}/custom/${filename}`;

  try {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = new Uint8Array(arrayBuffer);

    const { data, error } = await supabaseAdmin.storage
      .from('avatars')
      .upload(filePath, buffer, {
        contentType: file.type,
        cacheControl: '3600',
        upsert: true,
      });

    if (error) {
      console.error('Upload error:', error);
      throw error;
    }

    const {
      data: { publicUrl },
    } = supabaseAdmin.storage.from('avatars').getPublicUrl(filePath);

    return publicUrl;
  } catch (error) {
    console.error('Avatar upload error:', error);
    throw error;
  }
}
