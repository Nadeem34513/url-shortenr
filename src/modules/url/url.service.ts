import ApiError from "../../helper/classes/api-error";
import generateRandomId from "../../helper/functions/generateRandomId";
import { prisma } from "../../prisma";

// TODO: change unique_url_id generation
export async function createShortURL(url: string) {
  const unique_url_id = generateRandomId();
  const short_url = `${process.env.BASE_URL}/${unique_url_id}`;

  const urlData = await prisma.url.create({
    data: {
      original_url: url,
      short_url,
    },
  });

  return urlData;
}

// TODO: add validations
export async function redirect(id: string) {
  const short_url = `${process.env.BASE_URL}/${id}`;

  const url = await prisma.url.findUnique({ where: { short_url } });

  if (!url) throw new ApiError("URL not found on db!");

  return url.original_url;
}
