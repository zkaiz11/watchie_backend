import * as bcrypt from 'bcrypt';

export class AuthenticationProvider {
  static async generateHash(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }
  static async comparePassword(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    const verified = await bcrypt.compare(password, hashedPassword);
    return verified;
  }
}
