import fs from 'fs';
import crypto from 'crypto';


export default class Respository{
  constructor(filename){
    if(!(filename)){
      throw new Error('UsersRepository requires a filename');
    }
    this.filename = filename;
    try{
      fs.accessSync(this.filename);
    }catch(err){
      fs.writeFileSync(this.filename,'[]');
    }
  }

  async getAll(){
    //Open file
    const contents = JSON.parse(await fs.promises.readFile(this.filename,{encoding: 'utf8'}))
    return contents;
  }

  async create(attrs){
    attrs.id = this.randomId()
    const records = await this.getAll()
    records.push(attrs)
    await this.writeAll(records)
    return attrs
  }

  async writeAll(records){
    await fs.promises.writeFile(this.filename,JSON.stringify(records,null,2) )
  }

  randomId(){
    return crypto.randomBytes(4).toString('hex')
  }

  async getOne(id){
    const records = await this.getAll();
    return records.find(record => record.id === id)
  }

  async delete(id){
    const records = await this.getAll();
    const filteredRecords = records.filter(record => record.id!==id)
    this.writeAll(filteredRecords)
  }

  async update(id, attrs){
    const records = await this.getAll();
    const record = records.find(record => record.id==id);

    if(!(record)) throw new Error('Record not found')

    Object.assign(record, attrs); 

    this.writeAll(records);
  }

  async getOneBy(filters){
    const records = await this.getAll();
    for(let record of records){
      let found = true;
      for(let key in filters){
        if(record[key]!=filters[key]) found = false;
      }
      if(found) return record;
    }
  }
}