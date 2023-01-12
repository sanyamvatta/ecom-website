import fs from 'fs';
import crypto from 'crypto';
import util from 'util';
import Respository from './repository.js';

const cscrypt = util.promisify(crypto.scrypt)

class UsersRepository extends Respository{
  async create(attrs){
    attrs.id = this.randomId();
    
    const salt = crypto.randomBytes(8).toString('hex');
    const buf= await cscrypt(attrs.password,salt,64)
    const record = {
      ...attrs,
      password: `${buf.toString('hex')}.${salt}`
    }
    const records = await this.getAll();
    records.push(record);
    await this.writeAll(records);
    return record;
  }

  async comparePassword(saved,supplied){
    const [hashed,salt] = saved.split('.')
    const hashedSupplied = await cscrypt(supplied,salt,64)
    return hashed == hashedSupplied.toString('hex')
  }
}

export default new UsersRepository('users.json');