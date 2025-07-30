import { supabase } from './supabaseClient'

export async function uploadImage(file, pathPrefix = 'img') {
  const fileExt = file.name.split('.').pop()
  const fileName = `${Date.now()}.${fileExt}`
  const filePath = `${pathPrefix}/${fileName}`

  const { error } = await supabase.storage
    .from('cms-desa-cikelat')
    .upload(filePath, file)

  if (error) throw error

  return filePath
}
