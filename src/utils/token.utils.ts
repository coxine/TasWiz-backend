import * as jwt from 'jsonwebtoken';

const secretKey =
  '26117e60433ab66101c7fbc70afa9e9577c6c00d783cf2a183de4c536a2139f9';

export function generateToken(
  payload: object,
  expiresIn: string | number = '1h'
): string {
  return jwt.sign(payload, secretKey, { expiresIn });
}
