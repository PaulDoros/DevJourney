import { ActionFunctionArgs, json, LoaderFunctionArgs } from '@remix-run/node';
import { supabase } from '~/utils/supabase.server';
import { requireUser } from '~/utils/session.server';
import { ANIMATED_AVATARS, STATIC_AVATARS } from '~/constants/avatars';
import {
  deleteOldAvatar,
  getUserAvatars,
} from '~/utils/supabase-storage.server';

export async function action({ request }: ActionFunctionArgs) {
  const user = await requireUser(request);
  const formData = await request.formData();

  // Handle file upload
  if (formData.has('avatar')) {
    const file = formData.get('avatar') as File;
    if (!file || file.size === 0) {
      return json({ error: 'No file uploaded' }, { status: 400 });
    }

    if (file.size > 5 * 1024 * 1024) {
      return json({ error: 'File too large (max 5MB)' }, { status: 400 });
    }

    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}.${fileExt}`;

    // Upload to user's folder in Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(`custom/${user.id}/${fileName}`, file, {
        cacheControl: '3600',
        upsert: true,
      });

    if (uploadError) {
      return json({ error: 'Upload failed' }, { status: 500 });
    }

    // Get public URL
    const {
      data: { publicUrl },
    } = supabase.storage
      .from('avatars')
      .getPublicUrl(`custom/${user.id}/${fileName}`);

    return json({ success: true, avatar_url: publicUrl });
  }

  // Handle personal avatar deletion
  if (formData.get('action') === 'delete-personal-avatar') {
    const avatarName = formData.get('avatar_name') as string;

    const { error: deleteError } = await supabase.storage
      .from('avatars')
      .remove([`custom/${user.id}/${avatarName}`]);

    if (deleteError) {
      return json({ error: 'Failed to delete avatar' }, { status: 500 });
    }

    // If this was the current avatar, remove it from user profile
    const { data: currentUser } = await supabase
      .from('users')
      .select('avatar_url')
      .eq('id', user.id)
      .single();

    if (
      currentUser?.avatar_url &&
      currentUser.avatar_url.includes('/avatars/custom/')
    ) {
      await deleteOldAvatar(currentUser.avatar_url);
    }

    return json({ success: true });
  }

  // Handle preset avatar selection
  if (formData.get('action') === 'select-preset') {
    const avatarUrl = formData.get('avatar_url') as string;

    // Delete old custom avatar if exists
    const { data: currentUser } = await supabase
      .from('users')
      .select('avatar_url')
      .eq('id', user.id)
      .single();

    if (
      currentUser?.avatar_url &&
      currentUser.avatar_url.includes('/avatars/custom/')
    ) {
      await deleteOldAvatar(currentUser.avatar_url);
    }

    const { error: updateError } = await supabase
      .from('users')
      .update({ avatar_url: avatarUrl })
      .eq('id', user.id);

    if (updateError) {
      return json({ error: 'Profile update failed' }, { status: 500 });
    }

    return json({ success: true, avatar_url: avatarUrl });
  }

  // Handle avatar removal
  if (formData.get('action') === 'remove-avatar') {
    // Delete old custom avatar if exists
    const { data: currentUser } = await supabase
      .from('users')
      .select('avatar_url')
      .eq('id', user.id)
      .single();

    if (
      currentUser?.avatar_url &&
      currentUser.avatar_url.includes('/avatars/custom/')
    ) {
      await deleteOldAvatar(currentUser.avatar_url);
    }

    const { error: updateError } = await supabase
      .from('users')
      .update({ avatar_url: null })
      .eq('id', user.id);

    if (updateError) {
      return json({ error: 'Profile update failed' }, { status: 500 });
    }

    return json({ success: true });
  }

  return json({ error: 'Invalid action' }, { status: 400 });
}

// Add a loader to get user's personal avatars
export async function loader({ request }: LoaderFunctionArgs) {
  const user = await requireUser(request);
  const personalAvatars = await getUserAvatars(user.id);

  return json({ personalAvatars });
}
