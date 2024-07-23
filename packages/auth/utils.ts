import crypto from "crypto";
import jwt from "jsonwebtoken";

export type KeyPair = {
  publicKey: string;
  privateKey: string;
};
export type CreateTokenPairValidOptions = {
  accessTokenExpiresIn: string | number;
  refreshTokenExpiresIn: string | number;
};

class AuthUtils {
  static generateKeyPair() {
    const { privateKey, publicKey } = crypto.generateKeyPairSync("rsa", {
      modulusLength: 4096,
    });
    return {
      privateKey,
      publicKey,
    };
  }
  static createTokenPair(
    payload: Record<string, any>,
    privateKey: any,
    { accessTokenExpiresIn, refreshTokenExpiresIn }: CreateTokenPairValidOptions
  ) {
    // create accessToken using private key
    const accessToken = jwt.sign(payload, privateKey, {
      algorithm: "RS256",
      expiresIn: accessTokenExpiresIn,
    });
    // create refreshToken using private key
    const refreshToken = jwt.sign(payload, privateKey, {
      algorithm: "RS256",
      expiresIn: refreshTokenExpiresIn,
    });
    return {
      accessToken,
      refreshToken,
    };
  }
}

export default AuthUtils;
