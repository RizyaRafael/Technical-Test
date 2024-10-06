import { Injectable } from '@nestjs/common';
import { getDB } from 'mongo/config';
import * as XLSX from 'xlsx'

export interface savedData {
  resultTime: String,
  enodebID: String,
  cellId: String,
  availDur: Number
}

export interface outputMessage {
  message: string
}

@Injectable()
export class AppService {

  async postData(raw_data: Express.Multer.File): Promise<outputMessage> {
    const file = XLSX.read(raw_data.buffer, { type: 'buffer' })
    const sheet = file.SheetNames[0]
    const workFile = file.Sheets[sheet]
    let data: any = XLSX.utils.sheet_to_json(workFile, {
      raw: false
    })
    console.log(data[1][`Object Name`].split(','));
    const transormedData: savedData[] = data.map((el, i) => {
      if (i === 0) {
        return null
      }
      const objectName = el[`Object Name`].split(',')
      const enodebID = objectName[3].split('=')[1] || ''
      const cellId = objectName[1].split('=')[1] || ''
      const availDur = Number(el[`L.Cell.Avail.Dur`]) || 0
      const date = new Date(el['Result Time'])
      const resultTime = date.toISOString()
      return {
        resultTime,
        enodebID,
        cellId,
        availDur
      }
    }).filter(Boolean)

    const db = await getDB()
    await db.collection('raw_data').insertMany(transormedData);
    return {
      message: 'Data succesfully uploaded'
    }
  }

  async getDatas(
    enodebId: string,
    cellId: string,
    startDate: Date,
    endDate: Date
  ): Promise<savedData[]> {
    const db = await getDB()
    let query: any = {}
    if (enodebId) {
      query.enodebID = enodebId
    }
    if (cellId) {
      query.cellId = cellId
    }
    if (startDate || endDate) {
      query.resultTime = {}
      if (startDate) {
        query.resultTime.$gte = startDate
      }
      if (endDate) {
        query.resultTime.$lte = endDate
      }
    }
    
    console.log(query);
    
    const datas = await db.collection('raw_data').find(query, { projection: { _id: 0 } }).toArray()
    
    const transformedData: savedData[] = datas.map(el => ({
      resultTime: el.resultTime,
      enodebID: el.enodebID,
      cellId: el.cellId,
      availDur: (el.availDur / 900) * 100,
    }))
    return transformedData
  }
}
