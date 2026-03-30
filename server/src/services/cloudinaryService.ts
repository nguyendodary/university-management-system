import cloudinary from "../config/cloudinary.js";

export const uploadToCloudinary = async (
  file: Express.Multer.File,
  folder: string = "university-management"
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: "image",
        transformation: [
          { width: 400, height: 400, crop: "fill", gravity: "face" },
          { quality: "auto", fetch_format: "auto" },
        ],
      },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result!.secure_url);
        }
      }
    );

    uploadStream.end(file.buffer);
  });
};

export const deleteFromCloudinary = async (url: string): Promise<void> => {
  const publicId = extractPublicId(url);
  if (publicId) {
    await cloudinary.uploader.destroy(publicId);
  }
};

const extractPublicId = (url: string): string | null => {
  const match = url.match(
    /\/upload\/(?:v\d+\/)?(.+)\.(jpg|jpeg|png|gif|webp)/
  );
  return match ? match[1] : null;
};
