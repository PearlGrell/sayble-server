
// Third-party imports
import jwt from 'jsonwebtoken';

// Custom imports
import { settings } from '../config/settings'; 

export const tokenVerify = (token: string): string => {
      if (token.length < 1) return ''

      let user_id = ""

      jwt.verify(token, settings.auth.JWT_SECRET as string, (err: any, decoded: any) => {
            if (err) console.log(err)
            user_id = decoded?.user_id;
      })

     //  logger.info(`Token verification for ${user_id}`)
      return user_id
};