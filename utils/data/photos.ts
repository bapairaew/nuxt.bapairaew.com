import type { Photo } from "./types";

let getPhotos: (slug?: string) => Promise<Photo[]> = async () => [];

if (process.server) {
  const { default: exifr } = await import("exifr");
  const { globby } = await import("globby");
  const { parse, join } = await import("path");
  const sharp = await import("sharp");

  getPhotos = async (slug?: string) => {
    const slugs = await globby(getPhotosPath(slug));
    const data = await Promise.all(slugs.map((slug) => getPhotoData(slug)));
    return data.reverse();
  };

  const getPhotosPath = (slug = "*") => {
    return join(process.cwd(), `public/photos/${slug}.jpeg`);
  };

  const getPhotoData = async (path: string): Promise<Photo> => {
    const [exifData, blurDataURL] = await Promise.all([
      exifr.parse(path),
      getBlurDataURL(path),
    ]);
    const slug = parse(path).name;

    const placeParts = exifData.ImageDescription?.split(", ");

    const data: Photo = {
      slug,
      place: [placeParts[0], placeParts.pop()].join(", "),
      date:
        exifData.DateTimeOriginal?.toJSON() ||
        exifData.CreateDate?.toJSON() ||
        null,
      camera: exifData.Model ? exifData.Model : null,
      fnumber: exifData.FNumber,
      iso: exifData.ISO,
      focalLength: exifData.FocalLength,
      exposureTime: exifData.ExposureTime,
      width: exifData.ExifImageWidth, // Does not provide correct dimension
      height: exifData.ExifImageHeight, // Does not provide correct dimension
      blurDataURL,
    };

    return data;
  };

  const getBlurDataURL = async (src: string) => {
    return sharp
      .default(src)
      .resize(10)
      .blur(5)
      .jpeg({ mozjpeg: true })
      .toBuffer()
      .then((r) => `data:image/jpeg;base64,${r.toString("base64")}`);
  };
}

export { getPhotos };
