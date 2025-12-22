import { supabase } from '../supabase';

export const uploadMealImage = async (file: File, userId: string): Promise<string> => {
  const ext = file.name.split('.').pop();
  const fileName = `${userId}/${crypto.randomUUID()}.${ext}`;

  const { error } = await supabase.storage.from('meal-images').upload(fileName, file, {
    cacheControl: '3600',
    upsert: false,
  });

  if (error) {
    throw error;
  }

  const { data } = supabase.storage.from('meal-images').getPublicUrl(fileName);

  return data.publicUrl;
};

export const deleteMealImage = async (imageUrl: string): Promise<void> => {
  const url = new URL(imageUrl);

  // /storage/vi/object/public/meal-images/xxxxx
  const path = url.pathname.replace('/storage/v1/object/public/meal-images/', '');

  const { error } = await supabase.storage.from('meal-images').remove([path]);

  if (error) {
    throw error;
  }
};
