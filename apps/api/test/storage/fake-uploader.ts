import {
  Uploader,
  UploadParams,
} from '@/domain/restaurant/application/storage/uploader'

interface Upload {
  url: string
  fileName: string
}

export class FakeUploader implements Uploader {
  public uploads: Upload[] = []

  async upload({ fileName }: UploadParams): Promise<{ url: string }> {
    const url = `https://fake-uploader.com/${fileName}`

    this.uploads.push({
      url,
      fileName,
    })

    return {
      url,
    }
  }
}
