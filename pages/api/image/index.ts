import nc from "next-connect";
import { NextApiRequest, NextApiResponse as res } from "next";
import upload from "../../../utils/upload";
import fs from "fs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

type Override<T1, T2> = Omit<T1, keyof T2> & T2;

export type File = {
  path: string;
};

export type req = Override<NextApiRequest, { body: Body; file: File }>;

const handler = nc()
  .use(upload.single("file"))
  .get(async (req: req, res: res) => {
    try {
      const allImages = await prisma.photos.findMany();
      res.status(200).json(allImages);
    } catch (error) {
      res.status(400).json({ message: "deu ruim" });
    }
  })
  .post(async (req: req, res: res) => {
    try {
      const file: Buffer = fs.readFileSync(`${req.file.path}`);
      const base64: string = Buffer.from(file).toString("base64");

      const newImage = await prisma.photos.create({ data: { data: base64 } });

      fs.unlinkSync(`${req.file.path}`);

      res.status(200).json({ message: "deu bom" });
    } catch (error) {
      res.status(400).json({ message: "deu ruim" });
    }
  });

export default handler;

export const config = {
  api: {
    bodyParser: false,
  },
};

// export default function handler(req: req, res: res) {}
