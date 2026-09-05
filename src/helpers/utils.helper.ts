import { Injectable } from "@nestjs/common";
import bcrypt from "bcrypt";
import { Readable } from "stream";

@Injectable()
export class UtilsHelper {
  validPassword(pwd: string, hash: string) {
    return bcrypt.compareSync(pwd, hash);
  }

  generateHash(pwd: string) {
    return bcrypt.hashSync(pwd, bcrypt.genSaltSync(+(process.env.SALT_ROUND || 10)));
  }

  getNamesFromBody(body: any) {
    if (body.fullName) {
      const splittedVal = body.fullName.split(" ");
      body.firstName = splittedVal[0];
      body.lastName =
        splittedVal.length > 1 ? splittedVal[splittedVal.length - 1] : "";
    }
    if (body.firstName && body.lastName) {
      body.fullName = (body.firstName + " " + body.lastName).trim();
    }
    return body;
  }

  async streamToBuffer(stream: Readable): Promise<Buffer> {
    const chunks: Uint8Array[] = [];
    return new Promise((resolve, reject) => {
      stream.on('data', (chunk) => chunks.push(chunk));
      stream.on('end', () => resolve(Buffer.concat(chunks)));
      stream.on('error', reject);
    });
  }
}
