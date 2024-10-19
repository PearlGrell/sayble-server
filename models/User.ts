
import { Entity, PrimaryKey, Property } from '@mikro-orm/core'
import { TContext, User } from '../types'
import { hashGenerate } from '../helpers/hashGenerate';
import otpGenerate from '../helpers/otpGenerate';
import generateToken from '../helpers/generateToken';
import { MailTemplate, sendMail } from '../services/mailSent';
import { v4 } from 'uuid';
import { verifyPassword } from '../helpers/verifyPassword';


@Entity({ tableName: "User" })

export class UserModel implements User {
      @PrimaryKey({
            name: "id",
            type: "string"
      })
      id!: string;

      @Property({
            name: "firstName",
            type: "varchar",
            length: 255,
      })

      firstName!: string;

      @Property({
            name: "lastName",
            type: "varchar",
            length: 255,
      })
      lastName!: string;

      @Property({
            name: "username",
            type: "varchar",
            length: 255,
            nullable: true
      })
      username!: string;

      @Property({
            name: "email",
            type: "varchar",
            length: 255,
      })
      email!: string;

      @Property({
            name: "password",
            type: "varchar",
            length: 255,
            nullable: true
      })
      password!: string;

      @Property({
            name: "dob",
            type: "date",
            default: Date.now(),
            onUpdate: () => new Date(),
      })
      dob!: Date;

      @Property({
            name: "image",
            type: "varchar",
            length: 255,
      })
      image!: string;

      @Property({
            name: "isVerified",
            type: "boolean",
      })
      isVerified = false;

      @Property({
            name: "isLoggedIn",
            type: "boolean",
      })
      isLoggedIn = false;

      @Property({
            name: "otp",
            type: "varchar",
            length: 255,
      })
      otp!: string;

      @Property({
            name: "salt",
            type: "varchar",
            length: 255,
      })
      salt!: string;

      @Property({
            name: "temp_password",
            type: "varchar",
            length: 255,
      })
      temp_password!: string;

      @Property({
            name: "createdAt",
            type: "date",
            default: Date.now(),
            onUpdate: () => new Date(),
      })
      createdAt = new Date();

      @Property({
            name: "updatedAt",
            type: "date",
            default: Date.now(),
            onUpdate: () => new Date(),
      })
      updatedAt = new Date();

      constructor(user: Omit<User, "id" | "otp" | "isVerified" | "isLoggedIn" | "salt" | "createdAt" | "updatedAt">) {
            this.id = v4();
            this.email = user.email;
            this.firstName = user.firstName;
            this.lastName = user.lastName;
            this.dob = user.dob;
            this.image = user.image;
            this.createdAt = new Date();
            this.updatedAt = new Date();
            this.username = user.username;
            this.setPassword(user.password);
      };

      async setOTP(): Promise<void> {
            const { hash, salt } = await hashGenerate(this.firstName + this.lastName);
            const otpGenerated = await otpGenerate();
            this.otp = otpGenerated;
            this.salt = salt;
            this.password = hash;
      };

      async resendOTP(): Promise<void> {
            const otpGenerated = await otpGenerate();
            this.otp = otpGenerated;
      };

      async setPassword(password: string): Promise<void> {
            this.temp_password = password;
            const { hash, salt } = await hashGenerate(password);
            this.password = hash;
            this.salt = salt;

            // send the otp now 
            const otpGenerated = await otpGenerate();
            this.otp = otpGenerated;
      };

      async setUsername(username: string): Promise<void> {
            this.username = username
      };

      async isUserVerified(): Promise<boolean> {
            return this.isVerified;
      };

      async isUserLoggedin(): Promise<boolean> {
            return this.isLoggedIn;
      };

      async loginUser(): Promise<User> {
            this.isLoggedIn = true
            return this
      };

      async logoutUser(): Promise<User> {
            this.isLoggedIn = false
            return this
      };

      async verifyUser(): Promise<User> {
            this.isVerified = true
            return this
      };

      async saveUser(em: TContext['em']): Promise<void> {
            await await em.persistAndFlush(this);
      };

      async getToken(): Promise<string> {
            const token = await generateToken(this.id);
            return token;
      };

      async verifyPassword(password: string): Promise<boolean> {
            const passwordVerified = await verifyPassword({
                  password: password,
                  user: this
            });
            return passwordVerified;
      };

      async sendMail(mailType: MailTemplate): Promise<void> {
            await sendMail({
                  mailType: mailType,
                  otp: this.otp,
                  to: this.email,
                  firstname: this.firstName,
                  password: this.temp_password,
                  username: this.username
            });
      };
};