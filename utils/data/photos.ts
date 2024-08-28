import type { Photo } from "./types";

let getPhotos: (slug?: string) => Promise<Photo[]> = async () => [];

if (process.server) {
  const exifr = await import("exifr");
  const fs = await import("fs");
  const { globby } = await import("globby");
  const { parse, join } = await import("path");
  const sharp = await import("sharp");

  getPhotos = async (slug?: string) => {
    const slugs = await globby(getPhotosPath(slug));
    const data = await Promise.all(slugs.map((slug) => getPhotoData(slug)));
    return data.reverse();
  };

  const getPhotosPath = (slug = "*") => {
    return join(process.cwd(), `public/${slug}.jpeg`);
  };

  const getPhotoData = async (path: string): Promise<Photo> => {
    const [exif, blurDataURL] = await Promise.all([
      fs.promises.readFile(path).then(exifr.parse),
      getBlurDataURL(path),
    ]);
    const slug = parse(path).name;
    const placeParts = exif.ImageDescription?.split(", ");

    const data: Photo = {
      slug,
      place: [placeParts[0], placeParts.pop()].join(", "),
      date:
        exif.DateTimeOriginal?.toJSON() || exif.CreateDate?.toJSON() || null,
      camera: exif.Model ? exif.Model : null,
      fnumber: exif.FNumber,
      iso: exif.ISO,
      focalLength: exif.FocalLength,
      exposureTime: exif.ExposureTime,
      width: exif.ExifImageWidth, // Does not provide correct dimension
      height: exif.ExifImageHeight, // Does not provide correct dimension
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
