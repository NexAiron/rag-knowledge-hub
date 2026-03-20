import { Injectable } from "@nestjs/common";

@Injectable()
export class StorageService {
  async saveFile(fileName: string, _binary: Buffer) {
    return {
      fileName,
      fileUrl: `/uploads/${fileName}`,
      driver: process.env.STORAGE_DRIVER ?? "local",
    };
  }
}

