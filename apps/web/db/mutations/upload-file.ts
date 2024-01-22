'use server'

import { fetcher } from '../utils'

export async function uploadFile(formData: FormData) {
  try {
    const result = await fetcher<{
      attachmentId: string
    }>('/attachments', {
      method: 'POST',
      body: formData,
    })

    const attachmentId = result.attachmentId

    return attachmentId
  } catch (error) {
    throw new Error('Error ao fazer upload do arquivo.')
  }
}
