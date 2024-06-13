import * as crypto from 'crypto';
import appConfig from '../config';
import Jwt from 'jsonwebtoken';

const { auth } = appConfig;

class Cryptography {
  private readonly jwt = Jwt;

  constructor() {}

  public createSignature(
    payload: any,
    setExpire?: string | number | undefined,
  ) {
    return this.jwt.sign(payload, auth.jwt.secret, {
      expiresIn: setExpire ?? auth.jwt.expiration,
      issuer: auth.jwt.issuer,
    });
  }

  public generateToken(uid: number, setExpire?: string | number | undefined) {
    return this.createSignature({ uid }, setExpire);
  }

  public verifyToken(token: string, jwt_secret?: string) {
    return this.jwt.verify(token, jwt_secret ?? auth.jwt.secret);
  }
}

export default new Cryptography();
