import moment from 'moment';
import Account from './account.js'
import db from '../utils/database.js';
import { generateUUID } from '../utils/getRandom.js';

class OutGo {
  static async InsertoutGo(req, res) {
    const { uuid, type } = req.body;

    if (!student_id || !type) return res.status(400).json({
      status: 400,
      success: false,
      message: 'invaild request'
    })
    
    const [user] = await db.select('*').from('member').where({ uuid })
    if (!user) return res.status(400).json({
      status: 400,
      success: false,
      error: {
        message: 'invaild request'
      }
    })
    else {
      const [outgo] = await db.select('*').from('outgo').where({ sutdent_id: user.student_id, createdAt: moment(new Date()).format('YYYY-MM-DD HH:mm:ss') }) 
      if (!outgo) return res.status(400).json({
        status: 400,
        success: false,
        error: {
          message: 'invaild request'
        }
      })
      else {
        await db.insert({ uuid: generateUUID(), student_id: user.student_id, type, createdAt: moment(new Date()).format('YYYY-MM-DD HH:mm:ss') }).into('outgo')
        return res.status(200).json({
          status: 200,
          success: true,
          message: ''
        })
      }
    }
  }

  static async updateOutGo(req, res) {
    const { uuid, type } = req.body;
    
  }

  static async cancelOutGo(req, res) {
    const { student_id } = req.body;

    try {
      await db.delete().from('outgo').where({ student_id, createdAt: moment(new Date()).format('YYYY-MM-DD HH:mm:ss') })
      return res.status(200).json({
        status: 200,
        success: true,
        message: ''
      })
    } catch (err) {
      return res.status(400).json({
        status: 400,
        success: false,
        error: {
          message: 'invaild request'
        }
      })
    }
  }
}

export default OutGo;