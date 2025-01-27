import { createServerSupabase } from './supabase';

export async function getUserSlots(userId: string, request: Request) {
  const { supabase } = createServerSupabase(request);

  // Get user's slot information
  const { data: slotData, error: slotError } = await supabase
    .from('avatar_slots')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (slotError || !slotData) {
    // Create initial slot record if none exists
    const { data: newSlot, error: createError } = await supabase
      .from('avatar_slots')
      .insert([
        {
          user_id: userId,
          total_slots: 5,
          unlocked_slots: 0,
        },
      ])
      .select()
      .single();

    if (createError) throw createError;
    return newSlot;
  }

  return slotData;
}

export async function getSlotUnlocks(request: Request) {
  const { supabase } = createServerSupabase(request);

  const { data: unlocks, error } = await supabase
    .from('slot_unlocks')
    .select('*')
    .order('slot_number', { ascending: true });

  if (error) throw error;
  return unlocks;
}

export async function checkUploadPermission(
  userId: string,
  totalPoints: number,
  request: Request,
): Promise<{
  canUpload: boolean;
  reason?: string;
  pointsNeeded?: number;
  currentSlot: number;
  nextUnlock?: {
    slot: number;
    pointsRequired: number;
  };
}> {
  const { supabase } = createServerSupabase(request);
  const slots = await getUserSlots(userId, request);
  const unlocks = await getSlotUnlocks(request);

  // Get current avatar count
  const { data: avatars } = await supabase.storage
    .from('avatars')
    .list(`${userId}/custom`);

  const currentAvatarCount = (avatars || []).filter(
    (file: { name: string }) => file.name !== '.keep',
  ).length;

  // Check if user has enough points for first slot
  if (slots.unlocked_slots === 0) {
    const firstSlot = unlocks.find((u) => u.slot_number === 1);
    if (!firstSlot) {
      throw new Error('Slot configuration error');
    }

    if (totalPoints < firstSlot.points_required) {
      return {
        canUpload: false,
        reason: `You need ${firstSlot.points_required} points to unlock your first avatar slot`,
        pointsNeeded: firstSlot.points_required - totalPoints,
        currentSlot: 0,
        nextUnlock: {
          slot: 1,
          pointsRequired: firstSlot.points_required,
        },
      };
    }
  }

  // Check if user has available slots
  if (currentAvatarCount >= slots.unlocked_slots) {
    const nextSlot = unlocks.find(
      (u) => u.slot_number === slots.unlocked_slots + 1,
    );

    if (nextSlot) {
      return {
        canUpload: false,
        reason: `You need ${nextSlot.points_required} points to unlock your next avatar slot`,
        pointsNeeded: nextSlot.points_required - totalPoints,
        currentSlot: slots.unlocked_slots,
        nextUnlock: {
          slot: nextSlot.slot_number,
          pointsRequired: nextSlot.points_required,
        },
      };
    }

    return {
      canUpload: false,
      reason: 'You have reached the maximum number of avatar slots',
      currentSlot: slots.unlocked_slots,
    };
  }

  return {
    canUpload: true,
    currentSlot: slots.unlocked_slots,
  };
}
