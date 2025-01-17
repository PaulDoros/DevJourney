import { ActionFunctionArgs, json } from '@remix-run/node';
import { supabase } from '~/utils/supabase.server';
import { requireUser } from '~/utils/session.server';
import { ANIMATED_AVATARS, STATIC_AVATARS } from '~/constants/avatars';

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
    const fileName = `${user.id}-${Date.now()}.${fileExt}`;

    // Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(`custom/${fileName}`, file);

    if (uploadError) {
      return json({ error: 'Upload failed' }, { status: 500 });
    }

    // Get public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from('avatars').getPublicUrl(`custom/${fileName}`);

    // Update user profile
    const { error: updateError } = await supabase
      .from('users')
      .update({ avatar_url: publicUrl })
      .eq('id', user.id);

    if (updateError) {
      return json({ error: 'Profile update failed' }, { status: 500 });
    }

    return json({ success: true, avatar_url: publicUrl });
  }

  // Handle preset avatar selection
  if (formData.has('preset_avatar')) {
    const presetId = formData.get('preset_avatar') as string;

    const preset = [...ANIMATED_AVATARS, ...STATIC_AVATARS].find(
      (avatar) => avatar.id === presetId,
    );

    if (!preset) {
      return json({ error: 'Invalid preset avatar' }, { status: 400 });
    }

    const { error: updateError } = await supabase
      .from('users')
      .update({ avatar_url: preset.url })
      .eq('id', user.id);

    if (updateError) {
      return json({ error: 'Profile update failed' }, { status: 500 });
    }

    return json({ success: true, avatar_url: preset.url });
  }

  // Handle avatar removal
  if (formData.get('action') === 'remove-avatar') {
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
